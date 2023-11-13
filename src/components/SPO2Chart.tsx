import { useAtom } from 'jotai';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { spo2State } from '../atoms/socketData';

interface SPO2ChartProps {}

const SPO2Chart: React.FC<SPO2ChartProps> = () => {
  const [spo2Data] = useAtom(spo2State);

  return (
    <LineChart width={800} height={300} data={spo2Data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Line dataKey="spo2" stroke="#82ca9d" dot={false} />
    </LineChart>
  );
};

export default SPO2Chart;
