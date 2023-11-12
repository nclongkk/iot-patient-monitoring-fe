import React from 'react';
import { Layout as AntLayout, Menu, MenuProps, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = AntLayout;

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
    <AntLayout className="h-screen">
      <Header style={{ padding: 0, background: colorBgContainer }} />
      <AntLayout hasSider>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menuItems}
          />
        </Sider>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>

      <Footer style={{ textAlign: 'center' }}>Footer</Footer>
    </AntLayout>
  );
};

export default Layout;
