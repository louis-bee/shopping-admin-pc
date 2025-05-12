import './LoginLog.scss'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Form, Button, Radio, Popconfirm, message, Popover } from 'antd'
// 导入资源
import { Table, Tag, Space } from 'antd'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {getLoginLogListAPI, delLoginLogAPI } from '@/apis/log'
import { useSelector } from 'react-redux'

const LoginLog = () => {

  const Navigate = useNavigate()

  const roleType = {
    1: <Tag color="warning">用户</Tag>,
    2: <Tag color="success">销售人员</Tag>,
    3: <Tag color="processing">管理人员</Tag>,
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 70
    },
    {
      title: '账号id',
      dataIndex: 'userId'
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
      title: 'ip地址',
      dataIndex: 'ip',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime'
    },
    {
      title: '登出时间',
      dataIndex: 'logoutTime'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            {/* <Popover content={'查看操作日志'} placement="top">
              <Button type="primary" shape="circle" icon={<SnippetsOutlined />} onClick={()=>viewActionLog(data.userId)}/>
            </Popover> */}
            <Popconfirm
              title="删除日志"
              description="确认要删除该条日志吗?"
              onConfirm={()=>delLog(data.id)}
              okText="确认"
              cancelText="取消"
            >
              <Popover content={'删除日志'} placement="right">
                <Button type="primary" danger shape="circle" icon={<DeleteOutlined />}/>
              </Popover>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const [ list, setList] = useState([])
  const [count, setCount] = useState(0)

  const userId = useSelector(state => state.user.userInfo.id)

  const [ params, setParams ] = useState({
    adminId: userId,
    search: '',
    role: 1,
  }) 

  useEffect(()=>{
    async function getList() {
      const res = await getLoginLogListAPI(params)
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

  const delLog = async (id)=>{
    const delParams = {
      logId: id,
      adminId: userId
    }
    const res = await delLoginLogAPI(delParams)
    if(res.status===200) {
      message.success('已删除一条日志')
      const newList = list.filter(item=>item.id!==id)
      setList(newList);
    } else {
      message.error(res.desc)
    }
  }

  const viewActionLog = (userId) =>{
    console.log(userId);
    
  }

  return (
    <div>
      <Card title='登录日志'>

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
              <Input className='search' placeholder="输入用户id" allowClear onPressEnter={onFinish} onClear={handleRoleChange}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} shape="circle" className='but'></Button>
            </Form.Item>
          </div>
        </Form>

        <Table rowKey="id" columns={columns} dataSource={list} pagination={{
          total: count,
          pageSize: params.pageSize,
        }}/>
      </Card>
    </div>
  )
}

export default LoginLog