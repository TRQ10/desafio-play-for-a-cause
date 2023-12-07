"use client"

import { MessageValidator } from '@/interfaces/interfaces'
import { cn } from '@/lib/utils'
import { FC, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import useChatWebSocket from './useChatWebSocket'

interface MessagesProps {
    initialMessages: MessageValidator[];
    sessionId: number;
    friendInfo: any;
}

const Messages: FC<MessagesProps> = ({
    initialMessages,
    sessionId,
    friendInfo,
}) => {
    const [messages, setMessages] = useState<MessageValidator[]>(initialMessages);
    const { sendMessage } = useChatWebSocket({
        chatId: friendInfo.chatId, // Certifique-se de ter o ID correto aqui
        onChatHistory: (chatHistory) => setMessages(chatHistory),
        onMessageReceived: (newMessage) => setMessages((prevMessages) => [...prevMessages, newMessage]),
    });
    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        // Scroll down to show the latest messages when the component updates
        scrollDownRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (message: string) => {
        sendMessage(message);
    };

    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef} />

            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === sessionId

                const hasNextMessageFromSameUser =
                    messages[index - 1]?.senderId === messages[index].senderId

                return (
                    <div
                        className='chat-message'
                        key={`${message.id}-${message.createdAt}`}>
                        <div
                            className={cn('flex items-end', {
                                'justify-end': isCurrentUser,
                            })}>
                            <div
                                className={cn(
                                    'flex flex-col space-y-2 text-base max-w-xs mx-2',
                                    {
                                        'order-1 items-end': isCurrentUser,
                                        'order-2 items-start': !isCurrentUser,
                                    }
                                )}>
                                <span
                                    className={cn('px-4 py-2 rounded-lg inline-block', {
                                        'bg-pink-500 text-white': isCurrentUser,
                                        'bg-gray-200 text-gray-900': !isCurrentUser,
                                        'rounded-br-none':
                                            !hasNextMessageFromSameUser && isCurrentUser,
                                        'rounded-bl-none':
                                            !hasNextMessageFromSameUser && !isCurrentUser,
                                    })}>
                                    {message.content}{' '}
                                    <span className='ml-2 text-xs text-gray-400'>
                                        {format(new Date(message.createdAt), ' HH:mm')}
                                    </span>
                                </span>
                            </div>

                            <div
                                className={cn('relative w-6 h-6', {
                                    'order-2': isCurrentUser,
                                    'order-1': !isCurrentUser,
                                    invisible: hasNextMessageFromSameUser,
                                })}>
                                <Image
                                    fill
                                    src={isCurrentUser ? friendInfo.picture : "/perfil.png"}
                                    alt='Foto de perfil'
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Messages