import { Layout as AntLayout, Button, Result, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header } = AntLayout;
const { Title } = Typography;

const NotFoundPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

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
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang web bạn truy cập không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate('')}>
            Back Home
          </Button>
        }
      />
    </AntLayout>
  );
};

export default NotFoundPage;
