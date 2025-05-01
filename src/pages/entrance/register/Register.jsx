import './Register.scss';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import { registerAPI, sendAdminCodeAPI } from "@/apis/user.js";
import { useState } from 'react';

const Register = ({setTab}) => {

  const [ loading, setLoading ] = useState(false)

  const [form] = Form.useForm();

  const handleSendCode = async ()=>{
    setLoading(true)
    const params = {
      account: form.getFieldValue('account'),
      userName: form.getFieldValue('userName'),
    }
    const res = await sendAdminCodeAPI(params)
    if(res.status===200) {
      showModal()
    } else {
      message.error(res.desc);
    }
    setLoading(false)
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };


  const onFinish = async (values) => {
    const params = {
      userInfo: {
        userName: values.userName,
        account: values.account,
        pwd: values.pwd,
        role: 3,        
      },
      code: values.code
    }
    const res = await registerAPI(params)
    if (res.status===200) {
      message.success('注册成功');
      setTab('login')
    } else {
      message.error(res.desc);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const changeTab = (val)=> {
    setTab(val)
  }

  return (
    <Card className="card-box">
      <h1>管理员注册</h1>
      <Form
        className="form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item
          label="用户名"
          name="userName"
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input size="medium" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="账号"
          name="account"
          rules={[{ required: true, message: '账号不能为空' }]}
        >
          <Input size="medium" placeholder="请输入账号" />
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

        <Form.Item
          label="注册许可"
          name="code"
          rules={[{ required: true, message: '注册许可不能为空' }]}
        >
          <div className='input-box'>
            <Input.Password size="medium" placeholder="请输入注册许可" />
            <Button loading={loading} onClick={handleSendCode} type="link">发送申请</Button>
          </div> 
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            注册
          </Button>
        </Form.Item>
      </Form>
      <div className="link">
        <a onClick={()=>changeTab('login')}>登录</a>
      </div>
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
        <h2 style={{ marginBottom: 3 }}>申请已发送，请联系管理员获取注册许可</h2>
        <h3 style={{ marginBottom: 5 }}>（有效期为1h）</h3>
        <p style={{ marginBottom: 5 }}>电话：13724648288</p>
        <p>邮箱：2720447678@qq.com</p>
      </Modal>
    </Card>
  );
};

export default Register;