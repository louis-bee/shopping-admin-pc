import './ActionLog.scss'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Form, Button, Radio, Select, Popconfirm, message, Popover } from 'antd'
// 导入资源
import { Table, Tag, Space } from 'antd'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {getActionLogListAPI, delActionLogAPI } from '@/apis/log'
import { useSelector } from 'react-redux'

const ActionLog = () => {

  const Navigate = useNavigate()

  const roleType = {
    1: <Tag color="warning">用户</Tag>,
    2: <Tag color="success">销售人员</Tag>,
    3: <Tag color="processing">管理人员</Tag>,
  }

    const typeType = {
    1: <Tag color="processing">查询</Tag>,
    2: <Tag color="success">插入</Tag>,
    3: <Tag color="warning">更新</Tag>,
    4: <Tag color="red">删除</Tag>,
  }

  const typeList = [
    { "id": 0, "name": "全部"},
    { "id": 1, "name": "查询"},
    { "id": 2, "name": "插入"},
    { "id": 3, "name": "更新"},
    { "id": 4, "name": "删除"},
  ]

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 70
    },
    {
      title: '用户',
      dataIndex: 'userId'
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: data => roleType[data]
    },
    {
      title: '操作',
      dataIndex: 'message',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: data => typeType[data]
    },
    {
      title: '操作时间',
      dataIndex: 'time'
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
    role: 1,
    type: null,
    search: null,
  }) 

  useEffect(()=>{
    async function getList() {
      const res = await getActionLogListAPI(params)
      setList(res.data.list || [])
      setCount(res.data.total)
    }
    getList()
  },[params])

  const [form] = Form.useForm();

  const handleRoleChange = ()=>{
    setParams({
      ...params,
      role: form.getFieldValue('role'),
    })
  }

  const handleTypeChange = ()=>{
    setParams({
      ...params,
      type: form.getFieldValue('type'),
    })
  }

  const onFinish = () =>{
    setParams({
      ...params,
      type: form.getFieldValue('type'),
      role: form.getFieldValue('role'),
      search: form.getFieldValue('search'),
    })
  }

  const delLog = async (id)=>{
    const delParams = {
      actionId: id,
      adminId: userId
    }
    const res = await delActionLogAPI(delParams)
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
      <Card title='操作日志'>

      <Form initialValues={{ role: 1 }} form={form} onFinish={onFinish}>
          <Form.Item label="角色" name="role">
            <Radio.Group onChange={handleRoleChange}>
              <Radio value={1}>用户</Radio>
              <Radio value={2}>销售人员</Radio>
              <Radio value={3}>管理人员</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Select placeholder="全部" style={{ width: 100 }} onChange={handleTypeChange}>
              {typeList.map(item=><Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
          <div className="search-box">
            <Form.Item label="搜索" name="search">
              <Input className='search' placeholder="按用户id搜索" allowClear onPressEnter={onFinish} onClear={onFinish}/>
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

export default ActionLog