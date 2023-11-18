import { Form, Input, Button, Typography, Flex, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios, { setAuthToken } from '../api/axiosService';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log('Received values:', values);
    const { email, password } = values;
    // Add your authentication logic here
    try {
      const response = await axios.post(
        'https://patient-monitoring.site/api/auth/login',
        {
          email,
          password,
        },
      );
      console.log({ response });
      if (response.data.status === 'success') {
        // Handle successful login, e.g., store token in local storage, etc.
        message.success('Đăng nhập thành công!');
        navigate('/');
        localStorage.setItem('token', response.data.data.accessToken);
        setAuthToken(response.data.data.accessToken);
      }
    } catch (error) {
      console.log({ error });
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
            message: 'The input is not a valid email address!',
          },
          { required: true, message: 'Please input your email!' },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters long' },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Mật khẩu"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
