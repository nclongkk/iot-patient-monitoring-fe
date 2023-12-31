import { Layout as AntLayout, Typography, theme } from 'antd';
import LoginForm from '../components/loginForm';
const { Header, Content } = AntLayout;
const { Title } = Typography;

const LoginPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntLayout style={{ height: '100vh' }}>
      <Header
        style={{ padding: 10, background: colorBgContainer }}
        title="Hệ thống giám sát bệnh nhân"
      >
        <Title style={{ marginBottom: '24px' }}>
          Hệ thống giám sát bệnh nhân
        </Title>
      </Header>
      <Content style={{ margin: 'auto 16px' }}>
        <LoginForm />
      </Content>
    </AntLayout>
  );
};

export default LoginPage;
