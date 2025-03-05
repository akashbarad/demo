import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Content, Footer, Sider } = Layout;

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={signOut}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div
          className="logo"
          style={{
            color: 'white',
            textAlign: 'center',
            padding: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          My App
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
          {/* Add more menu items as needed */}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            background: '#fff',
            padding: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: '16px',
          }}
        >
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <UserOutlined style={{ fontSize: '18px', marginRight: '8px' }} />
              <span>{user?.name || user?.email}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ background: '#fff', minHeight: 360 }}>
            {/* This Outlet renders the nested protected pages */}
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center',background: '#fff' }}>
          My App ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
