import { useState, useEffect, useCallback } from 'react';
import { ParsedDiagram } from '../types';

export function usePlantUMLParser() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (event) => {
      setError('WebSocket error occurred');
      console.error('WebSocket error:', event);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const parsePlantUML = useCallback(async (plantUML: string): Promise<ParsedDiagram> => {
    if (!ws || !isConnected) {
      throw new Error('WebSocket is not connected');
    }

    return new Promise((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        } catch (error) {
          reject(error);
        }
        ws.removeEventListener('message', messageHandler);
      };

      ws.addEventListener('message', messageHandler);
      ws.send(JSON.stringify({ plantUML }));
    });
  }, [ws, isConnected]);

  return {
    parsePlantUML,
    isConnected,
    error
  };
} 