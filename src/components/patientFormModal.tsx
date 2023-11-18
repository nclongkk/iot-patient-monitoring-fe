import { Modal, Form, Input, Select, message } from 'antd';
import { useAtom } from 'jotai';
import { isOpenModalAtom } from '../atoms/patient';
import axios from '../api/axiosService';
const { Option } = Select;

interface FormData {
  name: string;
  age: number;
  gender: string;
}

export const PatientFormModal = () => {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useAtom(isOpenModalAtom);

  const handleAddPatient = async (data: FormData) => {
    try {
      const response = await axios.post(
        'https://patient-monitoring.site/api/patients',
        data,
      );

      // Handle the response as needed
      console.log('API Response:', data, response.data);

      // Display success message
      message.success('Thêm bệnh nhân thành công!');

      // Close the modal
      setIsOpenModal(false);
    } catch (error) {
      console.error('API Error:', error);
      // Display error message
      message.error('Thêm bệnh nhân thất bại!');
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        handleAddPatient({ ...values, age: Number(values.age) } as FormData);
      })
      .catch((err) => {
        console.error('Validation Error:', err);
      });
  };

  return (
    <Modal
      open={isOpenModal}
      title="Add new patient"
      onCancel={() => setIsOpenModal(false)}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: 'Please enter the age' }]}
        >
          <Input type="number" placeholder="Enter age" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select the gender' }]}
        >
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
