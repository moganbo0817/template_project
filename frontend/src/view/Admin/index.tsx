import React, { useState, useEffect } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu } from "antd";
import Book from "../Book";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Book", "1", <PieChartOutlined />),
  getItem("Task", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

// type Props = {
//   children?: React.ReactNode;
// };

type AdminPropsType = {
  children: any;
  activeKey: string;
};

const Admin: React.FC<any> = (props: AdminPropsType) => {
  const [collapsed, setCollapsed] = useState(false);
  //const [activeKey, setActiveKey] = useState<string>('2');

  const [menuNo, setMenuNo] = useState<number>(1);
  const navigate = useNavigate();
  const menuClickHandle = (item: any) => {
    // Menu毎にURLきったほうがいいかも
    // けどなんかちらついてうざい・・・
    // URLでルーティングするのとDOMの表示、非表示どっちがいいんだ
    setMenuNo(item.key);
    if (item.key == 1) {
      navigate("/book");
    } else if (item.key == 2) {
      navigate("/task");
    }
  };

  // useEffect(() => {

  // }, [menuNo]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={menuClickHandle}
          selectedKeys={[props.activeKey]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>{props.children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Admin;
