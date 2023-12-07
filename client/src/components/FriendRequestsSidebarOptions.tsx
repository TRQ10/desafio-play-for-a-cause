"use client"

import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import useWebSocket from './UseWebSocket'

interface FriendRequestsSidebarOptionsProps {
    sessionId: number
}

const FriendRequestsSidebarOptions: FC<FriendRequestsSidebarOptionsProps> = ({ sessionId }) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<[]>([]);
    const { onEvent } = useWebSocket();

    useEffect(() => {
        const updateUnseenRequestCount = (payload: any) => {
            console.log('Received UpdatedPendingRequests event:', payload);

            if (payload.userId === sessionId && payload.pendingFriends) {
                setUnseenRequestCount(payload.pendingFriends.length);
                console.log('Updated unseenRequestCount:', payload.pendingFriends.length);
            }
        };

        onEvent('UpdatedPendingRequests', updateUnseenRequestCount);

        return () => {
            onEvent('UpdatedPendingRequests', updateUnseenRequestCount);
        };
    }, [onEvent, sessionId]);

    console.log('unseenRequestCount:', unseenRequestCount);
    console.log(sessionId);



    return <Link
        href='/dashboard/requests'
        className='text-gray-700 hover:text-pink-500 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
        <div className="text-gray-400 border-gray-400 group-hover:border-pink-500 group-hover:text-pink-500 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
            <User className='h-4 w-4' />
        </div>
        <p className="truncate">Pedidos de Amizade</p>

        {unseenRequestCount.length > 0 ? (
            <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-pink-500">
                {unseenRequestCount}
            </div>
        ) : null}

    </Link>
}

export default FriendRequestsSidebarOptions