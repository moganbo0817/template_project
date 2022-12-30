import React, { useState,useEffect } from "react";
import { Space, Table, Radio, Select, Row, Col } from "antd";
import './index.css';
import Admin from "../Admin";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import {user} from "../../model/user"
import httpClient from "../../utils/httpClient"


const UserDetail: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<user>();
  const [user, setUser] = useState<user>();


  const navigate = useNavigate();

  const onFinish = async(values: any) => {
    if (window.confirm("登録/更新しますか?")) {
      const req:user = {
        id:form.getFieldValue('id'),
        name:form.getFieldValue('name'),
        password:form.getFieldValue('password'),
        role:form.getFieldValue('role'),
      }
      if (form.getFieldValue('id')){
        // update
        updateTask(req);
      } else {
        // insert
        insertTask(req);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };

  const onClickBack = () => {
    // navigate("/user");
  };

  const onClickClear = () => {
    // navigate("/user");
    form.resetFields();
  };

  useEffect(() => {
    // 初期表示は未実装
    // const param = window.location.pathname.split('/');
    // if (param[2]) {
    //   form.setFieldValue('id',param[2]);
    //   initTask(param[2]);
    // }
  }, []);

  const initTask = async(id: string) => {
    // try{
    //   const res = await httpClient.get<user>(`/register/${id}`);
    //   setUser(res.data);
    //   form.resetFields();
    // } catch(err) {
    //   console.log("error");
    // }
  };

  const insertTask = async(user: user) => {
    try{
      const res = await httpClient.post<user>("/register",user); 
      form.setFieldValue('id',res.data.id);
      messageApi.open({
        type: "success",
        content: "This is a success message",
      });
    } catch(err) {
      messageApi.open({
        type: "error",
        content: "This is an error message",
      });
    }
  };

  const updateTask = async(task: user) => {
    // try{
    //   await httpClient.put<number>(`/tasks/${form.getFieldValue('id')}`,task); 
    //   messageApi.open({
    //     type: "success",
    //     content: "This is a success message",
    //   });
    // } catch(err) {
    //   console.log("error");
    // }
  };

  const deleteTask = async() => {
    // if (window.confirm("削除してもよろしいですか?")) {
    //   try{
    //     await httpClient.delete<number>(`/tasks/${form.getFieldValue('id')}`); 
    //     messageApi.open({
    //       type: "success",
    //       content: "This is a success message",
    //     });
    //     form.setFieldValue('id',undefined);
    //     form.setFieldValue('title',undefined);
    //     form.setFieldValue('status',undefined);
    //     navigate("/taskdetail");
    //   } catch(err) {
    //     console.log("error");
    //   }
    // }
  };

  return (
    <Admin activeKey={"3"} activeOptionKey={"admin"}>
      <Form
        name="userform"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={user}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* Chormeの自動保管対策にダミーのパスワード入力エリアを画面上部に配置する */}
        <Input type="text" name="dammy_id" style={{position:"absolute",top:"-200px"}}/>
        <Input type="password" name="dammy_pass" style={{position:"absolute",top:"-100px"}}/>
        <Form.Item
          label="ID"
          name="id"
        >
          <Input style={{ width: 300 }} disabled={true}/>
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password style={{ width: 300 }}/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password style={{ width: 300 }}/>
      </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please input your role!" }]}
        >
          <Radio.Group>
            <Radio value={"public"}>public</Radio>
            <Radio value={"admin"}>admin</Radio>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 4, span: 30 }}>
          {contextHolder}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {/* {contextHolder}
          <Button type="primary" onClick={deleteTask} danger>
            Delete
          </Button>
          <Button  onClick={onClickBack}>
            Back
          </Button> */}
          <Button  onClick={onClickClear}>
            Clear
          </Button>
        </Form.Item>
      </Form>
    </Admin>
  );
};

export default UserDetail;
