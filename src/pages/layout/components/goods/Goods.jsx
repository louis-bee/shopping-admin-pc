import { Navigate, useNavigate } from 'react-router-dom'
import './Goods.scss'
import { Card, Button, Popconfirm, Table, Tag, Space, Form, Input, Popover } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined, SnippetsOutlined } from '@ant-design/icons'
import img404 from '@/assets/img/error.png'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { delGoodsAPI, getGoodsListAPI } from '@/apis/goods'

const Goods = () => {

  const navigate = useNavigate()

  const status = {
    1: <Tag color="warning">下架</Tag>,
    2: <Tag color="success">在售</Tag>
  }
  const typeDic = {
    1: '唱片',
    2: '衣饰',
    3: '日用品',
    4: '其它',
    5: '特价'
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'images',
      width: 100,
      render: images => {
        return <img src={`${import.meta.env.VITE_API_URL}/uploads/${images[0]}` || img404} width={60} height={60} alt="" />
      }
    },
    {
      title: '名称',
      dataIndex: 'goodsName',
      width: 300
    },
    {
      title: '销售人员',
      dataIndex: 'sellerId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => status[data]
    },
    {
      title: '类别',
      dataIndex: 'type',
      render: data => typeDic[data]
    },
    {
      title: '价格',
      dataIndex: 'price'
    },
    {
      title: '销量',
      dataIndex: 'sales'
    },
    {
      title: '浏览量',
      dataIndex: 'view'
    },
    {
      title: '库存',
      dataIndex: 'amount'
    },
    {
      title: '操作',
      width: 200,
      render: data => {
        return (
          <Space size="middle">
            <Popover content={'查看订单'} placement="top">
              <Button type="primary" shape="circle" icon={<SnippetsOutlined />} onClick={()=>navigate(`/layout/order?goodsId=${data.id}`)}/>
            </Popover>
            <Popover content={'修改商品'} placement="top">
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>navigate(`/layout/edit?id=${data.id}`)}/>
            </Popover>
            <Popconfirm
              title="删除商品"
              description="确认要删除该商品吗?"
              onConfirm={()=>onConfirm(data)}
              okText="Yes"
              cancelText="No"
            >
              <Popover content={'删除商品'} placement="left">
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  disabled={data.status===3}
                  icon={<DeleteOutlined />}
                />
              </Popover>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const [ list, setList] = useState([])
  const [count, setCount] = useState(0)

  const userId =  useSelector(state => state.user.userInfo.id)
  const [ params, setParams ] = useState({
    role: 3,
    sellerId: '',
    pageSize: 10,
    pageNum: 1,
  }) 

  useEffect(()=>{
    async function getList() {
      const res = await getGoodsListAPI(params)
      setList(res.data.list)
      setCount(res.data.total)
    }
    getList()
  },[params])

  const onConfirm = async (data)=>{
    const delParams = {
      id: data.id,
      sellerId: userId,
    }
    await delGoodsAPI(delParams)
    setParams({
      ...params
    })
  }

  const [searchForm] = Form.useForm();

  const onFinish = ()=>{
    setParams({
      ...params,
      sellerId: searchForm.getFieldValue('search'),
    })
  }

  return (
    <div>
      <Card title='商品管理' style={{ marginBottom: 20 }} >

        <Form initialValues={{}} form={searchForm} onFinish={onFinish}>
          <div className="search-box">
            <Form.Item label="按销售人员查看" name="search">
              <Input className='search' placeholder="输入销售人员id" allowClear onPressEnter={onFinish}/>
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

export default Goods