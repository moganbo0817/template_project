import React, { useState, useEffect,useContext } from "react";
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
import GlobalStore from "../../components/GlobalStore";

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

type AdminPropsType = {
  children: any;
  activeKey: string;
  activeOptionKey: string;
};

const Admin: React.FC<any> = (props: AdminPropsType) => {
  const [items, setItems] = useState<MenuItem[]>();
  const [collapsed, setCollapsed] = useState(false);
  const [menuNo, setMenuNo] = useState<number>(1);
  const navigate = useNavigate();
  const { globalStore } = useContext(GlobalStore);

  const menuClickHandle = (item: any) => {
    setMenuNo(item.key);
    if (item.key == 1) {
      navigate("/task");
    } else if (item.key == 2) {
      navigate("/book");
    } else if (item.key == 3) {
      navigate("/user");
    }
  };

  useEffect(() => {
    const menu: MenuItem[] = [
      getItem("Public", "public", <TeamOutlined />, [
        getItem("Tasks", "1"),
        getItem("Todo", "2"),
      ]),
    ];
    if (globalStore.role == 'admin') {
      menu.push(getItem("Admin", "admin", <UserOutlined />, [
        getItem("User", "3"),
        getItem("Todo", "4"),
      ]));
    }
    setItems(menu);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">Template Project</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[props.activeKey]}
          defaultOpenKeys={[props.activeOptionKey]}
          mode="inline"
          items={items}
          onClick={menuClickHandle}
          selectable={true}
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
