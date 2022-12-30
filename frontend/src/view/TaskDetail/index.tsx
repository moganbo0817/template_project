import React, { useState,useEffect } from "react";
import { Select } from "antd";
import './index.css';
import Admin from "../Admin";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import {task} from "../../model/task"
import httpClient from "../../utils/httpClient"

const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const TaskDetail: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<task>();
  const [task, setTask] = useState<task>();


  const navigate = useNavigate();

  const onFinish = async(values: any) => {
    if (window.confirm("登録/更新しますか?")) {
      const req:task = {
        id:form.getFieldValue('id'),
        title:form.getFieldValue('title'),
        status:form.getFieldValue('status'),
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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Change:", e.target.value);
  };

  const onClickBack = () => {
    navigate("/task");
  };

  useEffect(() => {
    const param = window.location.pathname.split('/');
    if (param[2]) {
      form.setFieldValue('id',param[2]);
      initTask(param[2]);
    }
  }, []);

  const initTask = async(id: string) => {
    try{
      const res = await httpClient.get<task>(`/tasks/${id}`);
      form.setFieldValue('id',res.data.id);
      setTask(res.data);
      form.resetFields();
    } catch(err) {
      messageApi.open({
        type: "error",
        content: "This is an error message",
      });
    }
  };

  const insertTask = async(task: task) => {
    try{
      const res = await httpClient.post<task>("/tasks",task); 
      form.setFieldValue('id',res.data.id);
      messageApi.open({
        type: "success",
        content: "This is a success message",
      });
      navigate("/taskdetail/" + res.data.id);
    } catch(err) {
      messageApi.open({
        type: "error",
        content: "This is an error message",
      });
    }
  };

  const updateTask = async(task: task) => {
    try{
      await httpClient.put<number>(`/tasks/${form.getFieldValue('id')}`,task); 
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

  const deleteTask = async() => {
    if (window.confirm("削除してもよろしいですか?")) {
      try{
        await httpClient.delete<number>(`/tasks/${form.getFieldValue('id')}`); 
        messageApi.open({
          type: "success",
          content: "This is a success message",
        });
        form.setFieldValue('id',undefined);
        form.setFieldValue('title',undefined);
        form.setFieldValue('status',undefined);
        navigate("/taskdetail");
      } catch(err) {
        messageApi.open({
          type: "error",
          content: "This is an error message",
        });
      }
    }
  };

  return (
    <Admin activeKey={"1"} activeOptionKey={"public"}>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={task}
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
          {contextHolder}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {contextHolder}
          <Button type="primary" onClick={deleteTask} danger>
            Delete
          </Button>
          <Button  onClick={onClickBack}>
            Back
          </Button>
        </Form.Item>
      </Form>
    </Admin>
  );
};

export default TaskDetail;
