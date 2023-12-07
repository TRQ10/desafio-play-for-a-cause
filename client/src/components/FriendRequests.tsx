"use client"

import { url } from '@/app/api/auth/[...nextauth]/route'
import { Check, UserPlus, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import useWebSocket from './UseWebSocket'

interface FriendRequestsProps {
    sessionId: number
}

const FriendRequests: FC<FriendRequestsProps> = ({ sessionId }) => {
    const { onEvent } = useWebSocket();
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>([]);

    useEffect(() => {
        // Configurar o ouvinte para o evento 'UpdatedPendingRequests'
        const updateFriendRequests = (payload: any) => {
            if (payload.userId === sessionId) {
                setFriendRequests(payload.pendingFriends || []);
            }
        };

        onEvent('UpdatedPendingRequests', updateFriendRequests);

        return () => {
            // Limpar o ouvinte quando o componente é desmontado
            onEvent('UpdatedPendingRequests', () => { });
        };
    }, [onEvent, sessionId]);
    const router = useRouter()
    const { data: session } = useSession();

    const acceptFriendship = async (user1Id: number, user2Id: number) => {
        try {
            const response = await fetch(`${url}/friends/accept/${user1Id}/${user2Id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                throw new Error('Erro ao aceitar amizade');
            }
        } catch (error) {
            console.error('Erro ao aceitar amizade:', error);
        }

    }

    const rejectFriendship = async (user1Id: number, user2Id: number) => {
        try {
            const response = await fetch(`${url}/friends/reject/${user1Id}/${user2Id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            router.refresh()
            if (!response.ok) {
                throw new Error('Erro ao rejeitar amizade');
            }
        } catch (error) {
            console.error('Erro ao rejeitar amizade:', error);
        }

    }

    return <>
        {friendRequests.length === 0 ? (
            <p className='text-sm text-zinc-500'>Nada para ver aqui...</p>
        ) : (
            friendRequests.map((request) => {
                return (
                    <div key={request.id} className='flex gap-4 items-center'>
                        <UserPlus className="text-black" />
                        <p className="font-medium text-lg">{request.name}</p>
                        <button
                            onClick={async () => {
                                await acceptFriendship(session?.user.id || 0, request.id);
                                router.refresh()
                            }}
                            aria-label='Aceita amigo'
                            className='w-8 h-8 bg-pink-500 hover:bg-pink-600 grid place-items-center rounded-full transition hover:shadow-md'
                        >
                            <Check className='font-semibold text-white w-3/4 h-3/4' />
                        </button>

                        <button onClick={async () => {
                            await rejectFriendship(session?.user.id || 0, request.id);
                            router.refresh()
                        }} aria-label='Recusar amigo' className='w-8 h-8 bg-red-500 hover:bg-red-600 grid place-items-center rounded-full transition hover:shadow-md'>
                            <X className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                    </div>
                )
            })
        )}
    </>
}

export default FriendRequests