import './Login.scss';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLogin } from '@/store/modules/user';
import { useNavigate } from 'react-router-dom';

const Login = ({setTab}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // 这里调用接口
    const params = {
      account: values.account,
      pwd: values.pwd,
      role: 3,
    }
    const res = await dispatch(fetchLogin(params));
    if (res.status===200) {
      message.success('登录成功');
      navigate('/layout');
    } else {
      message.error(res.desc);
    }
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const changeTab = (val)=> {
    setTab(val)
  }

  return (
    <Card className="card-box-login">
      <h1>管理员登录</h1>
      <Form
        className="form"
        initialValues={{ account: 'superAdmin', pwd: '123123' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="账号"
          name="account"
          rules={[{ required: true, message: '账号不能为空' }]}
        >
          <Input size="large" placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="pwd"
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input.Password size="large" placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            登录
          </Button>
        </Form.Item>
      </Form>
      <Modal
        style={{ top: 200 }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="close" type="primary" onClick={handleOk}>
            关闭
          </Button>,
        ]}
      >
        <h2 style={{ marginBottom: 16 }}>请联系管理员</h2>
        <p style={{ marginBottom: 5 }}>电话：13724648288</p>
        <p>邮箱：2720447678@qq.com</p>
      </Modal>
      <div className="link">
        <a onClick={()=>changeTab('register')}>注册</a>
        <a onClick={showModal}>忘记密码</a>
      </div>
    </Card>
  );
};

export default Login;