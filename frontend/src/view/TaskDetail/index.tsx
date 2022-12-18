import React, { useState,useEffect } from "react";
import { Space, Table, Tag, Select, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import Admin from "../Admin";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import {task} from "../../model/task"
import httpClient from "../../utils/httpClient"

const { TextArea } = Input;
const { Option } = Select;

//const Book: React.FC = () => <Table columns={columns} dataSource={data} />;
const BookDetail: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<task>();


  const navigate = useNavigate();

  const onFinish = async(values: any) => {
    try{
      if (form.getFieldValue('id')){
        // updateは後々作ろうか
        return;
      }
      const req:task = {
        id:0,
        title:form.getFieldValue('title'),
        status:"todo",
      } 
      const res = await httpClient.post<task>("/tasks",req);
      form.setFieldValue('id',res.data.id);
      messageApi.open({
        type: "success",
        content: "This is a success message",
      });
    } catch(err) {
      console.log("error");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Change:", e.target.value);
  };

  const onClick = () => {
    navigate("/task");
  };

  useEffect(() => {
    const param = window.location.search;
    if (param) {
      form.setFieldValue('id',param.slice(1));
    }
    console.log(param);

  }, []);

  return (
    <Admin activeKey="2">
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="ID"
          name="id"
        >
          <Input style={{ width: 300 }} disabled={true}/>
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please input your status!" }]}
        >
          <Select style={{ width: 300 }}>
            <Option value="todo">todo</Option>
            <Option value="doing">doing</Option>
            <Option value="done">done</Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 30 }}>
          <Row gutter={2}>
            <Col span={20}>
              {contextHolder}
              <Button type="primary" htmlType="submit" >
                Submit
              </Button>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={onClick}>
                Back
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Admin>
  );
};

export default BookDetail;
