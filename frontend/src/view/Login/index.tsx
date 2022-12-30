import React, { useContext} from "react";
import './index.css';
import { Button, Checkbox, Form, Input,Row,Col,message } from 'antd';
import { useNavigate } from "react-router-dom";
import httpClient from "../../utils/httpClient"
import {loginUser} from "../../model/loginUser"
import GlobalStore from "../../components/GlobalStore";
//import { useCookies } from "react-cookie";

const Login: React.FC = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm<loginUser>();
  const [messageApi, contextHolder] = message.useMessage();
  const { dispatchGlobal } = useContext(GlobalStore);

  const onFinish = async(values: any) => {
    console.log('Success:', values);
    try{
      const req:loginUser = {
        user_name :form.getFieldValue('username'),
        password:form.getFieldValue('password'),
      } 
      const res = await httpClient.post<loginUser>("/login",req);
      localStorage.setItem("token", res.data.access_token||"")
      localStorage.setItem("role", res.data.role||"")
      dispatchGlobal({
        type: 'LOGIN',
        payload: {
          role: res.data.role,
        },
      })
      navigate("/task");
    } catch(err) {
      messageApi.open({
        type: "error",
        content: "ログインIDもしくはパスワードが間違っています",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row className="login-row"  justify="space-around" align="middle">
    <Col span="8">
    <Form
      name="basic"
      form={form}
      layout="horizontal"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="login-form"
    >
      <h2 className="logo" ><span>logo</span></h2>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        {contextHolder}
        <Button type="primary" htmlType="submit" >
          Login
        </Button>
      </Form.Item>
    </Form>
    </Col>
    </Row>
  );
};

export default Login;