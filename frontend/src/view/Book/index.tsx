import React, { useState } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Admin from "../Admin";
import { Link } from "react-router-dom";

interface DataType {
  key: string;
  bookNo: number;
  title: string;
  status: string;
  description: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "BookNo",
    dataIndex: "bookNo",
    key: "bookNo",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status) => {
      let color = "green";
      if (status === "on loan") {
        color = "volcano";
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={"/bookdetail?key=" + record.key}>Detail</Link>
      </Space>
    ),
  },
];

// ToDo APIから値を設定する
const data: DataType[] = [
  {
    key: "1",
    bookNo: 1,
    title: "海辺のカフカ",
    status: "on loan",
    description: "なんだっけ",
  },
  {
    key: "2",
    bookNo: 2,
    title: "ねじまき鳥クロニクル",
    status: "enable",
    description: "なんだっけ",
  },
];
//const Book: React.FC = () => <Table columns={columns} dataSource={data} />;
const Book: React.FC = () => {
  return (
    <Admin activeKey={"2"} activeOptionKey={"public"}>
      <Table columns={columns} dataSource={data} />
    </Admin>
  );
};

export default Book;
