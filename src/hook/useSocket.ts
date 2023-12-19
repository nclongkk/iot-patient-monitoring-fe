// socketService.ts

import { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const socketUrl = 'https://patient-monitoring.site/socket.io';

const useSocket = <OnEventType, EmitEventType>() => {
  const socketRef = useRef<Socket>();

  const onEvent = useCallback((ev: string, cb: (args: OnEventType) => void) => {
    socketRef.current?.on(ev, cb);
  }, []);

  const emitEvent = useCallback((ev: string, args: EmitEventType) => {
    socketRef.current?.emit(ev, args);
  }, []);

  useEffect(() => {
    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.io");
    });

    socketRef.current.on("disconnect", (ev) => {
      console.log("Disconnected from Socket.io", ev);
    });

    socketRef.current.on("unauthorized", (ev) => {
      console.log("unauthorized", ev);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [socketRef]);

  return { onEvent, emitEvent };
};

export default useSocket;
