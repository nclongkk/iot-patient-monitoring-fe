import { useAtom } from 'jotai';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { heartbeatState } from '../atoms/socketData';

interface HeartbeatChartProps {}

const HeartbeatChart: React.FC<HeartbeatChartProps> = () => {
  const [heartbeatData] = useAtom(heartbeatState);

  return (
    <LineChart width={800} height={300} data={heartbeatData}>
      <XAxis dataKey="time" />
      <YAxis />
      <Line dataKey="heartbeat" stroke="#8884d8" dot={false} />
    </LineChart>
  );
};

export default HeartbeatChart;
