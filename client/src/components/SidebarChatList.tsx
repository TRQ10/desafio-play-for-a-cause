"use client"

import { url } from '@/app/api/auth/[...nextauth]/route'
import { CreateUserDto, MessageValidator } from '@/interfaces/interfaces'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface SidebarChatListProps {
    Friends: CreateUserDto[],
    sessionId: number
}

const SidebarChatList: FC<SidebarChatListProps> = ({ Friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setunseenMessages] = useState<MessageValidator[]>([])

    useEffect(() => {
        if (pathname?.includes('chat')) {
            setunseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId.toString()))
            })
        }
    }, [pathname])

    const handleFriendClick = async (friendId: number) => {
        try {
            // Passo 1: Verificar se já existe uma sessão de chat
            const existingChatsResponse = await fetch(`${url}/chat/get-user-chats/${sessionId}`);

            if (existingChatsResponse.ok) {
                const existingChats = await existingChatsResponse.json();
                const chatWithFriend = existingChats.find(
                    (chat: { user1Id: number; user2Id: number }) => chat.user1Id === friendId || chat.user2Id === friendId
                );

                if (chatWithFriend) {
                    // Já existe uma sessão, redirecionar para a sessão de chat existente
                    router.push(`/dashboard/chat/${chatWithFriend.id}`);
                    return; // Importante retornar para evitar a execução do bloco abaixo
                }
            }

            // Passo 2: Se não existir ou ocorrer um erro, criar uma nova sessão de chat
            const newChatResponse = await fetch(`${url}/chat/create-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1Id: sessionId, user2Id: friendId }),
            });

            if (newChatResponse.ok) {
                const newChat = await newChatResponse.json();

                // Redirecionar para a nova sessão de chat
                router.push(`/dashboard/chat/${newChat.id}`);
            } else {
                toast.error('Erro ao criar uma nova sessão de chat.');
                console.error('Erro ao criar uma nova sessão de chat:', newChatResponse.statusText);
            }
        } catch (error) {
            toast.error('Erro ao processar a sessão de chat.');
            console.error('Erro ao processar a sessão de chat:', error);
        }
    };



    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {Friends.sort().map((friend) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend.id;
                }).length;
                return (
                    <li key={friend.id}>
                        <a
                            href={`/dashboard/chat/${friend.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleFriendClick(friend.id);
                            }}
                            className='text-gray-700 hover:text-pink-500 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 texte-sm leading-6 font-semibold'
                        >
                            {friend.name}
                            {unseenMessagesCount > 0 ? (
                                <div className='bg-pink-500 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                    {unseenMessagesCount}
                                </div>
                            ) : null}
                        </a>
                    </li>
                );
            })}
        </ul>
    )
}

export default SidebarChatList
