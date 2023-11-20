import { Form, Input, Button, Typography, Flex, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios, { setAuthToken } from '../api/axiosService';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        'https://patient-monitoring.site/api/auth/login',
        values,
      );
      if (response.data.status === 'success') {
        message.success('Đăng nhập thành công!');
        navigate('/');
        localStorage.setItem('token', response.data.data.accessToken);
        setAuthToken(response.data.data.accessToken);
      }
    } catch (error) {
      message.error('Đăng nhập thất bại!');
    }
  };

  return (
    <Form
      name="loginForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ maxWidth: '400px', margin: 'auto', marginTop: '150px' }}
    >
      <Flex justify={'center'}>
        <Title>Đăng nhập hệ thống</Title>
      </Flex>
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'Vui lòng nhập email hợp lệ!',
          },
          { required: true, message: 'Vui lòng nhập email!' },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải chứa tối thiểu 6 kí tự' },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Mật khẩu"
        />
      </Form.Item>

      <Form.Item style={{ paddingTop: '16px' }}>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
