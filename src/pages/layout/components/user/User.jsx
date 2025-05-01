import { data, Link, useNavigate } from 'react-router-dom'
import { Card, Input, Form, Button, Radio, DatePicker, Select, Popconfirm, message, Popover, Modal, InputNumber } from 'antd'
import './User.scss'
// 导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined, PlusCircleOutlined, SnippetsOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { getUserListAPI, delUserAPI, editUserAPI } from '@/apis/user'
import { useSelector } from 'react-redux'

const User = () => {

  const Navigate = useNavigate()

  const roleType = {
    1: <Tag color="warning">用户</Tag>,
    2: <Tag color="success">销售人员</Tag>,
    3: <Tag color="processing">管理人员</Tag>,
  }
  const statusType = {
    1: <Tag color="success">正常</Tag>,
    2: <Tag color="error">注销</Tag>,
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 70
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: data => roleType[data]
    },
    {
      title: '余额',
      render: data => {
        return data.role===1 ? data.balance : '-'
      }
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      render: data => statusType[data]
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Popover content={'查看订单'} placement="top">
              <Button disabled={data.role===3} type="primary" shape="circle" icon={<SnippetsOutlined />} onClick={()=>viewOrders(data.id, data.role)}/>
            </Popover>
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>handleEditUser(data)} disabled={data.status === 2}/>
            <Popconfirm
              title="删除账号"
              description="确认要删除该账号吗?"
              onConfirm={()=>delUser(data.id)}
              okText="确认"
              cancelText="取消"
            >
              { data.status === 1 ? (
                <Popover content={'删除账号'} placement="right">
                  <Button type="primary" danger shape="circle" icon={<DeleteOutlined />}/>
                </Popover>
              ) : (
                <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} disabled/>
              )}
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const [ list, setList] = useState([])
  const [count, setCount] = useState(0)
  
  const [ params, setParams ] = useState({
    search: '',
    role: 1,
    pageNum: 1,
    pageSize: 10,
  }) 

  useEffect(()=>{
    async function getList() {
      const res = await getUserListAPI(params)
      setList(res.data.list || [])
      setCount(res.data.total)
    }
    getList()
  },[params])

  const [form] = Form.useForm();

  const handleRoleChange = ()=>{
    console.log(form.role);
    
    setParams({
      ...params,
      role: form.getFieldValue('role'),
      search: '',
    })
  }

  const onFinish = () =>{
    setParams({
      ...params,
      role: form.getFieldValue('role'),
      search: form.getFieldValue('search'),
    })
  }

  const userId =  useSelector(state => state.user.userInfo.id)
  const delUser = async (id)=>{
    const delParams = {
      userId: id,
      adminId: userId
    }
    const res = await delUserAPI(delParams)
    if(res.status===200) {
      message.success('该账号已注销')
      const newList = list.map(item=>{
        if(item.id === id) return {...item, status:2}
        else return item
      })
      setList(newList);
    } else {
      message.error(res.desc)
    }
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm] = Form.useForm();
  const [initUserInfo, setInitUserInfo ]  = useState({})

  const handleEditCancel = ()=>{
    setIsEditModalOpen(false)
  }
  const handleEditOk = async ()=>{
    editForm.submit()
    const newUserInfo = editForm.getFieldValue()
    console.log(newUserInfo);
    if(!newUserInfo.role || !newUserInfo.account || !newUserInfo.userName || !newUserInfo.pwd || !newUserInfo.pwd2 || !newUserInfo.account) return
    if(newUserInfo.pwd!==newUserInfo.pwd2) return
    const userParams = {
      userInfo: {
        id: newUserInfo.id,
        account: newUserInfo.account,
        userName: newUserInfo.userName,
        pwd: newUserInfo.pwd,
        balance: newUserInfo.balance,
        role: newUserInfo.role
      },
      adminId: userId,
    }
    const res = await editUserAPI(userParams)
    if(res.status===200) {
      message.success(res.desc)
      setParams({...params})
      setIsEditModalOpen(false)
    } else {
      message.error(res.desc)
    }
  }
  const handleEditUser = (userInfo)=>{
    setIsEditModalOpen(true)
    setInitUserInfo({}); // 清空表单初始值
    editForm.resetFields(); // 重置表单字段
    editForm.setFieldsValue(userInfo);
    setInitUserInfo(userInfo)
  }
  const handleAddUser = ()=>{
    // setInitUserInfo({}); // 清空表单初始值
    // editForm.resetFields(); // 重置表单字段
    // editForm.setFieldValue('account','')
    setInitUserInfo({role:params.role,userName:'', account:'',balance:0,pwd:'',pwd2:'',id:''})
    editForm.setFieldsValue({role:params.role,userName:'', account:'',balance:0,pwd:'',pwd2:'',id:''})
    setIsEditModalOpen(true)
  }

  const viewOrders = (id, role)=>{
    const roleStr = role===1 ? 'consumerId' : 'sellerId'
    Navigate(`/layout/order?${roleStr}=${id}`)
  }

  return (
    <div>
      <Card title='账号管理'>

      <Form initialValues={{ role: 1 }} form={form} onFinish={onFinish}>
          <Form.Item label="角色" name="role">
            <Radio.Group onChange={handleRoleChange}>
              <Radio value={1}>用户</Radio>
              <Radio value={2}>销售人员</Radio>
              <Radio value={3}>管理人员</Radio>
            </Radio.Group>
          </Form.Item>
          <div className="search-box">
            <Form.Item label="搜索" name="search">
              <Input className='search' placeholder="输入用户id/用户名/账号" allowClear onPressEnter={onFinish}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} shape="circle" className='but'></Button>
            </Form.Item>
          </div>
        </Form>

        <Button type="primary" icon={<PlusCircleOutlined />} className='add' onClick={handleAddUser}>
          添加账号
        </Button>

        <Table rowKey="id" columns={columns} dataSource={list} pagination={{
          total: count,
          pageSize: params.pageSize,
        }}/>
      </Card>

      <Modal
        width={450}
        className='edit-modal'
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText={'确认'}
        cancelText={'取消'}
      >
        <h2>{initUserInfo.account ? '修改':'添加'  }账号</h2>
        <Form
          initialValues={initUserInfo}
          className="edit-form"
          form={editForm}
        >
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '角色不能为空' }]}
          >
            <Select disabled={initUserInfo.role} options={[{value:1,label:'用户'},{value:2,label:'销售人员'},{value:3,label:'管理人员'},]}>
              {/* <Option value={1}>用户</Option>
              <Option value={2}>销售人员</Option>
              <Option value={3}>管理人员</Option> */}
            </Select>
          </Form.Item>
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: '账号不能为空' }]}
          >
            <Input size="medium" placeholder="请输入账号" disabled={initUserInfo.account} />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="userName"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input size="medium" placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="pwd"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password size="medium" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="pwd2"
            rules={[
              { required: true, message: '密码不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('pwd') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password size="medium" placeholder="请再次输入密码" />
          </Form.Item>
          {initUserInfo.role===1 && <Form.Item
              label="余额"
              name="balance"
              rules={[{ required: true, message: '余额不能为空' }]}
            >
              <InputNumber
                size="medium"
                placeholder="请输入余额"
                min={0} // 最小值
                max={99999999} // 最大值
                controls={false}
                style={{width:120}}
              />
            </Form.Item>}
  
        </Form>
      </Modal>
    </div>
  )
}

export default User