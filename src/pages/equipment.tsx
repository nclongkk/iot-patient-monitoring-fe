import useSelectEquipment from '../atoms/equipment';

export const Equipment = () => {
  const [selectedEquipment] = useSelectEquipment();

  if (!selectedEquipment) return null;

  return (
    <div>
      Equipment Detail
      {selectedEquipment.id}
    </div>
  );
};
