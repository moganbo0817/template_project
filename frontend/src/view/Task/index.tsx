import React, { useState,useEffect } from 'react';
import { Space, Table, Tag,Button,Col} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Admin from "../Admin"
import httpClient from "../../utils/httpClient"
import {task} from "../../model/task"
import { Link } from "react-router-dom";

interface DataType {
  key: string; // stringからnumberに変更
  id: number;
  title: string;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
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
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link to={"/taskdetail?" + record.id}>Detail</Link>
      </Space>
    ),
  },
];

const User: React.FC = () => {

  const [data, setData] = useState<DataType[]>()

useEffect(() => {
  task();
}, []);

const task=(async()=>{
  try {
    const res= await httpClient.get<task[]>("/tasks");
    const {data} = res || {};
    const initdata: DataType[] =[];
    let i:number = 0;
    setData(initdata);
    data.forEach(task => {
      const record: DataType ={
        key: String(i),
        id: task.id,
        title: task.title,
        status: task.status,
      }
      initdata.push(record);
      i++;
    })
    setData(initdata);
    return res;
  } catch(err) {
    console.log("error");
  }
});

return (
   <Admin activeKey='2'>
    <Col span={24} style={{ textAlign: 'right' }}>
    <Button type="primary" href="/taskdetail">addtask</Button>
    </Col>
      <Table columns={columns} dataSource={data} />
    </Admin>
  );
};

export default User;
