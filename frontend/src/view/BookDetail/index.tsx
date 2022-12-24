import React, { useState } from "react";
import { Space, Table, Tag, Select, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import Admin from "../Admin";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

//const Book: React.FC = () => <Table columns={columns} dataSource={data} />;
const BookDetail: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const onFinish = (values: any) => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
    });
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
    navigate("/book");
  };

  return (
    <Admin activeKey={"2"} activeOptionKey={"public"}>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="BookNo"
          name="bookNo"
          rules={[{ required: true, message: "Please input your bookno!" }]}
        >
          <Input style={{ width: 300 }} />
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
          <Select defaultValue="" style={{ width: 300 }}>
            <Option value="ENABLE">ENABLE</Option>
            <Option value="ON LOAN">ON LOAN</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            showCount
            maxLength={100}
            style={{ height: 120, resize: "none" }}
            onChange={onChange}
            placeholder="disable resize"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 30 }}>
          <Row gutter={2}>
            <Col span={20}>
              {contextHolder}
              <Button type="primary" htmlType="submit">
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
