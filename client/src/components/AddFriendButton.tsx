'use client'

import { FC, useEffect, useState } from 'react';
import Button from './ui/Button';
import { useSession } from 'next-auth/react';
import { getUsers } from '@/lib/api';
import toast from 'react-hot-toast';
import { url } from '@/app/api/auth/[...nextauth]/route';

interface AddFriendButtonProps { }

interface User {
    id: number;
    name: string;
    email: string;
    Picture: string;
}

// ... imports ...

const AddFriendButton: FC<AddFriendButtonProps> = () => {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('getUsers() não retornou uma array de usuários:', response);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Erro ao buscar usuários. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const addFriend = async (userId: number, friendId: number) => {
        try {
            if (!userId || !friendId) {
                console.error('IDs de usuário inválidos.');
                return;
            }

            const response = await fetch(`${url}/friends/${userId}/${friendId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.backendTokens.token}`,
                },
            });

            if (response.ok) {
                // Verifica se a resposta tem conteúdo antes de chamar response.json()
                const data = response.headers.get('Content-Length') === '0' ? null : await response.json();
                console.log('Amigo adicionado com sucesso:', data);
                toast.success('Amigo adicionado com sucesso!');
            } else {
                console.error('Falha ao adicionar amigo. Status:', response.status);
                toast.error('Erro ao adicionar amigo. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao adicionar amigo:', error);
            toast.error('Erro ao adicionar amigo. Tente novamente.');
        }
    };

    return (
        <div className="max-h-[400px] overflow-y-auto">
            <ul className="space-y-4 flex-shrink-0">
                {users.map((user) => (
                    session?.user?.id !== user.id && (
                        <li
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded transition-transform hover:border-pink-500 hover:bg-gray-50"
                        >
                            <img
                                src="/perfil.png"
                                alt={`Profile of ${user.name}`}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col">
                                <p className="font-semibold text-sm text-blue-gray-700">{user.name}</p>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                            <Button onClick={() => addFriend(session?.user?.id || 0, user.id)}>add</Button>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default AddFriendButton;
