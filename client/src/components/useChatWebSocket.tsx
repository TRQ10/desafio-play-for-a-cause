"use client"

import { useSession } from 'next-auth/react';
import { MessageValidator } from '@/interfaces/interfaces';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseChatWebSocketProps {
    chatId: number;
    onChatHistory: (messages: MessageValidator[]) => void;
    onMessageReceived: (message: MessageValidator) => void;
}

const useChatWebSocket = ({ chatId, onChatHistory, onMessageReceived }: UseChatWebSocketProps) => {
    const socketRef = useRef<Socket | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (session && session.backendTokens?.token) {
            const newToken = session.backendTokens.token;
            console.log(newToken);

            socketRef.current = io('http://localhost:3001/events', {
                withCredentials: true,
                extraHeaders: {
                    Authorization: `Bearer ${newToken}`,
                },
            });

            socketRef.current.on('connect', () => {
                console.log('Connected to chat socket');

                socketRef.current?.emit('joinRoom', { chatId });
            });

            socketRef.current.on('reversedChatHistory', (messages: MessageValidator[]) => {
                console.log('Received reversed chat history:', messages.reverse());
                onChatHistory(messages);
            });

            socketRef.current.on('newMessage', (message: MessageValidator) => {
                console.log('Received new message:', message);
                onMessageReceived(message);
            });

            return () => {
                socketRef.current?.disconnect();
            };
        }
    }, [chatId, onChatHistory, onMessageReceived, session]);

    const sendMessage = (message: string) => {

        socketRef.current?.emit('message', { chatId, content: message });
    };

    return { sendMessage };
};

export default useChatWebSocket;
