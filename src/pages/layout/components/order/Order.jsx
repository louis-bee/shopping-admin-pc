import { Card, Button,  Table, Tag, Space, message, Form, Input } from 'antd'
import { TruckOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons'
import img404 from '@/assets/img/error.png'
import './Order.scss'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getOrderListAPI, deliveryAPI } from '@/apis/order'

const Order = () => {

  const status = {
    2: <Tag color="warning">未发货</Tag>,
    3: <Tag color="success">已完成</Tag>
  }
  
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id'
    },
    {
      title: '封面',
      dataIndex: 'images',
      width: 100,
      render: images => {
        return <img src={`${import.meta.env.VITE_API_URL}/uploads/${images[0]}` || img404} width={60} height={60} alt="" />
      }
    },
    {
      title: '商品名',
      dataIndex: 'goodsName',
      width: 200
    },
    {
      title: '销售人员id',
      dataIndex: 'sellerId'
    },
    {
      title: '用户id',
      dataIndex: 'consumerId'
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '数量',
      dataIndex: 'number'
    },
    {
      title: '交易时间',
      dataIndex: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => status[data]
    },
    {
      title: '发货',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              disabled={data.status===3}
              icon={<TruckOutlined />}
              onClick={()=>delivery(data.id)}
            />
          </Space>
        )
      }
    }
  ]

  const [ list, setList] = useState([])
  const [count, setCount] = useState(0)

  const userId =  useSelector(state => state.user.userInfo.id)

  const [ searchParams ] = useSearchParams()
  const goodsId = searchParams.get('goodsId')
  const consumerId = searchParams.get('consumerId')
  const sellerId = searchParams.get('sellerId')

  const [ params, setParams ] = useState({
    role: 2,
    pageSize: 10,
    pageNum: 1,
    type: goodsId ? 'goods' : consumerId ? 'consumer' : sellerId ? 'seller' : '',
    search: goodsId ? goodsId : consumerId ? consumerId : sellerId ? sellerId : ''
  }) 

  useEffect(()=>{
    async function getList() {
      const res = await getOrderListAPI(params)
      setList(res.data.list)
      setCount(res.data.total)
    }
    getList()
  },[params])

  const delivery = async (id)=>{
    const params = {
      orderId: id,
      sellerId: userId
    }
    const res = await deliveryAPI(params)
    if(res.status===200) {
      message.success('该订单已发货')
      const newList = list.map(item=>{
        if(item.id === id) return {...item, status:3}
        else return item
      })
      setList(newList);
    } else {
      message.error(res.desc)
    }
  }

  const [searchForm] = Form.useForm()

  const onSearch = (type)=>{
    if(!searchForm.getFieldValue(type)) return reset()
    setParams({
      ...params,
      search: searchForm.getFieldValue(type),
      type: type
    })
  }
  
  const reset = ()=>{
    searchForm.setFieldValue('goods','')
    searchForm.setFieldValue('seller','')
    searchForm.setFieldValue('consumer','')
    setParams({
      ...params,
      search: '',
      type: ''
    })
  }

  return (
    <div>
      <Card title='订单列表' style={{ marginBottom: 20 }} >
        
        <Form initialValues={{}} form={searchForm}>
          <div className="search-box">
            <Form.Item label="按商品查询" name="goods">
              <Input className='search' placeholder="输入商品id" allowClear onPressEnter={()=>onSearch('goods')}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} shape="circle" className='but' onClick={()=>onSearch('goods')}></Button>
            </Form.Item>
          </div>
          <div className="search-box">
            <Form.Item label="按用户查询" name="consumer">
              <Input className='search' placeholder="输入用户id" allowClear onPressEnter={()=>onSearch('consumer')}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} shape="circle" className='but' onClick={()=>onSearch('consumer')}></Button>
            </Form.Item>
          </div>
          <div className="search-box">
            <Form.Item label="按销售人员查询" name="seller">
              <Input className='search' placeholder="输入销售人员id" allowClear onPressEnter={()=>onSearch('seller')}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} shape="circle" className='but' onClick={()=>onSearch('seller')}></Button>
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

export default Order