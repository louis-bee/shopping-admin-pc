import { Layout, Menu, Popconfirm } from 'antd'
import {
  BarChartOutlined,
  AppstoreOutlined,
  FormOutlined,
  SnippetsOutlined,
  TeamOutlined,
  LogoutOutlined,
  DatabaseOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import './Layout.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserInfo} from '@/store/modules/user'
import { logoutAPI } from '@/apis/user'

const { Header, Sider } = Layout

const items = [
  {
    label: '数据中心',
    key: '/layout',
    icon: <BarChartOutlined />,
  },
  {
    label: '账号管理',
    key: '/layout/user',
    icon: <TeamOutlined />,
  },
  {
    label: '商品管理',
    key: '/layout/goods',
    icon: <AppstoreOutlined />,
  },
  {
    label: '修改商品',
    key: '/layout/edit',
    icon: <FormOutlined />,
  },
  {
    label: '订单管理',
    key: '/layout/order',
    icon: <SnippetsOutlined />,
  },
  {
    label: '登录日志',
    key: '/layout/login-log',
    icon: <UnorderedListOutlined />,
  },
  {
    label: '操作日志',
    key: '/layout/action-log',
    icon: <DatabaseOutlined />,
  },
]

const AdminLayout = () => {
  
  const Navigate = useNavigate()
  const onMenuClick = (route)=>{
    const path = route.key
    Navigate(path)
  }
  const location = useLocation()
  const selectedKeys = location.pathname

  const userName =  useSelector(state => state.user.userInfo.userName)
  const userId =  useSelector(state => state.user.userInfo.id)
  const dispatch = useDispatch()
  const onConfirm = ()=>{
    dispatch(clearUserInfo())
    logoutAPI({id: userId})
    Navigate('/')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo">管理后台</div>
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onConfirm}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            onClick={onMenuClick}
            selectedKeys={selectedKeys}
            mode="inline"
            theme="dark"
            items={items}
            style={{ height: '100%', borderRight: 0 }}></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet/>
        </Layout>
      </Layout>
    </Layout>
  )
}
export default AdminLayout