"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useWebSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        // Verifica se session e session.backendTokens.token estão definidos
        if (session && session.backendTokens?.token) {
            const newToken = session.backendTokens.token;
            console.log(newToken);

            socketRef.current = io('http://localhost:3001/events', {
                withCredentials: true,
                extraHeaders: {
                    Authorization: `Bearer ${newToken}`,
                },
            });

            return () => {
                // Desconecta o socket quando o componente é desmontado
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [session]);

    const onEvent = (event: string, callback: (data: any) => void) => {
        // Adiciona ouvinte para eventos
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const emitEvent = (event: string, payload: any) => {
        // Emite um evento para o servidor
        if (socketRef.current) {
            socketRef.current.emit(event, payload);
        }
    };

    return { onEvent, emitEvent };
};

export default useWebSocket;
