// socketService.ts

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const socketUrl = 'https://patient-monitoring.site/socket.io';

interface UseSocketOptions {
  event?: string;
  callback?: (data: any) => void;
}

const useSocket = ({ event, callback }: UseSocketOptions): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('aConnected to the server');
    });

    if (event && callback) {
      socketRef.current.on(event, callback);
    }
  }

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Disconnected from the server');
      }
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
