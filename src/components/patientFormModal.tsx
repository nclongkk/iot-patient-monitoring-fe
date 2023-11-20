import { Modal, Form, Input, Select, message } from 'antd';
import { useAtom } from 'jotai';
import useSelectPatient, {
  isOpenModalAtom,
  paginationInfoState,
  selectPatient,
} from '../atoms/patient';
import axios from '../api/axiosService';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchPatients } from '../api/patientsService';
const { Option } = Select;

interface FormData {
  name: string;
  age: number;
  gender: string;
}

export const PatientFormModal = () => {
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useAtom(isOpenModalAtom);
  const [selectedPatient] = useAtom(selectPatient);
  const [, setSelectedPatient] = useSelectPatient();

  const [paginationInfo] = useAtom(paginationInfoState);

  const { data, isLoading, isError, refetch } = useQuery(
    ['patients', paginationInfo.current],
    () => fetchPatients(paginationInfo.current),
  );
  //   const mutation = useMutation(addPost);

  const handleAddPatient = async (data: FormData) => {
    try {
      const response = await axios.post(
        'https://patient-monitoring.site/api/patients',
        data,
      );
      if (response.data.status === 'success') {
        message.success('Thêm bệnh nhân thành công!');
        setIsOpenModal(false);
        form.resetFields();
        setSelectedPatient(undefined);
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
      );
      if (response.data.status === 'success') {
        message.success('Cập nhật thông tin bệnh nhân thành công!');
        setIsOpenModal(false);
        form.resetFields();
        setSelectedPatient(undefined);
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
        selectedPatient
          ? handleUpdatePatient(selectedPatient?.id, formData)
          : handleAddPatient(formData);
      })
      .catch((err) => {
        console.error('Validation Error:', err);
      });
  };

  useEffect(() => {
    return () => {
      setSelectedPatient(undefined);
    };
  }, [setSelectedPatient]);

  return (
    <Modal
      open={isOpenModal}
      title={
        selectedPatient ? 'Cập nhật thông tin bệnh nhân' : 'Thêm bệnh nhân mới'
      }
      onCancel={() => {
        setIsOpenModal(false);
        setSelectedPatient(undefined);
      }}
      onOk={handleOk}
      destroyOnClose
      okText={selectedPatient ? 'Cập nhật' : 'Thêm'}
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
