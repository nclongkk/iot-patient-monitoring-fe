import React from 'react';
import { Layout as AntLayout, Menu, MenuProps, Typography, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      onClick: () => {
        navigate(`/`);
      },
    },
    {
      key: 'equipments',
      label: 'Equipments',
      onClick: () => {
        navigate(`/equipments`);
      },
    },
    {
      key: 'patients',
      label: 'Patients',
      onClick: () => {
        navigate(`/patients`);
      },
    },
  ];

  return (
    <AntLayout style={{ height: '100vh' }}>
      <Header
        style={{ padding: 0, background: colorBgContainer }}
        title="My App"
      >
        <Title style={{ margin: '10px 0' }}>My App</Title>
      </Header>
      <AntLayout hasSider style={{ height: '100%' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={menuItems}
          />
        </Sider>
        <Content style={{ margin: '24px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: '100%',
              background: colorBgContainer,
              overflow: 'auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>

      {/* <Footer style={{ textAlign: 'center' }}>Footer</Footer> */}
    </AntLayout>
  );
};

export default Layout;
