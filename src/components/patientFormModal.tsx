import { Modal, Form, Input, Select, message } from 'antd';
import { useAtom } from 'jotai';
import { isOpenModalAtom, paginationInfoState } from '../atoms/patient';
import axios from '../api/axiosService';
import { useQuery } from 'react-query';
import { fetchPatients } from '../api/patientService';
import { IPatient } from '../types/patient';
import { useEffect } from 'react';
const { Option } = Select;

interface FormData {
  name: string;
  age: number;
  gender: string;
}

export const PatientFormModal = ({ patient }: { patient?: IPatient }) => {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useAtom(isOpenModalAtom);

  const [paginationInfo] = useAtom(paginationInfoState);

  const { refetch } = useQuery(['patients', paginationInfo.current], () =>
    fetchPatients(paginationInfo.current),
  );

  const handleAddPatient = async (data: FormData) => {
    try {
      const response = await axios.post(
        'https://patient-monitoring.site/api/patients',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (response.data.status === 'success') {
        message.success('Thêm bệnh nhân thành công!');
        setIsOpenModal(false);
        refetch();
      }
    } catch (error) {
      message.error('Thêm bệnh nhân thất bại!');
    }
  };

  const handleUpdatePatient = async (id: number, data: FormData) => {
    try {
      const response = await axios.patch(
        `https://patient-monitoring.site/api/patients/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (response.data.status === 'success') {
        message.success('Cập nhật thông tin bệnh nhân thành công!');
        setIsOpenModal(false);
        refetch();
      }
    } catch (error) {
      message.error('Cập nhật thông tin bệnh nhân thất bại!');
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formData: FormData = { ...values, age: Number(values.age) };
        patient
          ? handleUpdatePatient(patient?.id, formData)
          : handleAddPatient(formData);
      })
      .catch((err) => {
        console.error('Validation Error:', err);
      });
  };

  useEffect(() => {
    if (patient) {
      form.setFieldsValue(patient);
    } else {
      form.resetFields();
    }
  }, [form, patient]);

  return (
    <Modal
      open={isOpenModal}
      title={patient ? 'Cập nhật thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
      onCancel={() => {
        setIsOpenModal(false);
      }}
      onOk={handleOk}
      destroyOnClose
      okText={patient ? 'Cập nhật' : 'Thêm'}
      cancelText={'Hủy bỏ'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          name="age"
          label="Tuổi"
          rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
        >
          <Input type="number" placeholder="Nhập tuổi" />
        </Form.Item>

        <Form.Item
          name="hospitalId"
          label="Mã bệnh nhân"
          rules={[{ required: true, message: 'Vui lòng nhập mã bệnh nhân' }]}
        >
          <Input type="string" placeholder="Nhập mã bệnh nhân" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
