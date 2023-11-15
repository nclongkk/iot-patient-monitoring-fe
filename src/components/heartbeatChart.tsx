import { useAtom } from 'jotai';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { heartbeatState } from '../atoms/socketData';
import { memo } from 'react';

interface HeartbeatChartProps {}

const HeartbeatChart: React.FC<HeartbeatChartProps> = memo(() => {
  const [heartbeatData] = useAtom(heartbeatState);

  return (
    <LineChart width={1200} height={300} data={heartbeatData}>
      <XAxis dataKey="time" />
      <YAxis />
      <Line dataKey="heartbeat" stroke="#8884d8" dot={false} />
    </LineChart>
  );
});

export default HeartbeatChart;
