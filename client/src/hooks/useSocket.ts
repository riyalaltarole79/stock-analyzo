'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (symbol?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [latestPrice, setLatestPrice] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    if (symbol) {
      newSocket.emit('subscribe', symbol);
      newSocket.on('priceUpdate', (data) => {
        if (data.symbol === symbol) {
          setLatestPrice(data);
        }
      });
    }

    return () => {
      if (symbol) newSocket.emit('unsubscribe', symbol);
      newSocket.disconnect();
    };
  }, [symbol]);

  return { socket, latestPrice };
};
