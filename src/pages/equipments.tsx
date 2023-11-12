import { useAtom } from 'jotai';
import useSelectEquipment, {
  addAllEquipments,
  equipments as equipmentState,
} from '../atoms/equipment';
import { useEffect } from 'react';
import axios from '../api/axiosService';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Equipments = () => {
  const [, addEquipments] = useAtom(addAllEquipments);
  const [equipments] = useAtom(equipmentState);
  const [, setSelectEquipment] = useSelectEquipment();
  const navigate = useNavigate();

  const fetchEquipments = async () => {
    const response = await axios.get(
      'http://14.225.207.82:3000/api/equipments'
    );

    const data = await response.data.data;

    addEquipments(data);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div>
      Equipments
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Status</Th>
              <Th>Patient</Th>
            </Tr>
          </Thead>
          <Tbody>
            {equipments.map((equipment) => (
              <Tr
                key={equipment.id}
                onClick={() => {
                  setSelectEquipment(equipment);
                  navigate(`/equipments/${equipment.id}`);
                }}
                className=":hover cursor-pointer"
              >
                <Td>{equipment.id}</Td>
                <Td>{equipment.status}</Td>
                <Td>{equipment.patient.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};
