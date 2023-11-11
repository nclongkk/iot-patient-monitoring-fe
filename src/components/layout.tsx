import Header from './header';
import Content from './mainContent';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex w-screen h-screen flex-col">
      <Header />
      <div className="flex w-screen h-screen">
        <Sidebar />
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
}

export default Layout;
