import React from 'react';
import './index.css';
import { Button, Checkbox, Form, Input,Row,Col,message } from 'antd';
import { useNavigate } from "react-router-dom";
import httpClient from "../../utils/httpClient"
import {user} from "../../model/user"
//import { useCookies } from "react-cookie";

const Login: React.FC = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm<user>();
  const [messageApi, contextHolder] = message.useMessage();
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);

  const onFinish = async(values: any) => {
    console.log('Success:', values);
    try{
      const req:user = {
        user_name :form.getFieldValue('username'),
        password:form.getFieldValue('password'),
      } 
      const res = await httpClient.post<user>("/login",req);
      //setCookie("name", inputVal);
      localStorage.setItem("token", res.data.access_token||"")
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