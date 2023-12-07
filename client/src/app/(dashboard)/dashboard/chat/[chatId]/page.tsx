import { authOptions, url } from '@/app/api/auth/[...nextauth]/route'
import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { MessageValidator } from '@/interfaces/interfaces'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        chatId: number
    }
}

interface chatSession {
    user1Id: number,
    user2Id: number,
}

async function getChatSession(chatId: number): Promise<chatSession | null> {
    try {
        if (!chatId) {
            throw new Error('Chat não encontrado');
        }

        const chatSession = await fetch(`${url}/chat/get-chat/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!chatSession.ok) {
            throw new Error(`Falha ao recuperar mensagens. Status: ${chatSession.status}`);
        }

        const data = chatSession.headers.get('Content-Length') === '0' ? null : await chatSession.json();
        return data;

    } catch (err) {
        console.error('Erro ao tentar pegar mensagens', err);
        return null;
    }
}

async function getChatMessages(chatId: number): Promise<MessageValidator[] | null> {
    try {
        if (!chatId) {
            throw new Error('Chat não encontrado');
        }

        const messages = await fetch(`${url}/chat/get-chat-messages/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!messages.ok) {
            throw new Error(`Falha ao recuperar mensagens. Status: ${messages.status}`);
        }

        const data = messages.headers.get('Content-Length') === '0' ? null : await messages.json();
        return data;

    } catch (error) {
        console.error('Erro ao tentar pegar mensagens', error);
        return null;
    }
}

async function getFriendInfo(user2Id: number): Promise<any | null> {
    try {
        if (!user2Id) {
            throw new Error('ID do usuário não encontrado');
        }

        const response = await fetch(`${url}/user/get/${user2Id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição. Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao tentar pegar informações do usuário:', error);
        return null;
    }
}


const page = async ({ params }: PageProps) => {
    const { chatId } = params
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    let validatedMessages: MessageValidator[] | null = [];
    const chatUsers = await getChatSession(chatId);

    let friendInfo: any = null;


    try {
        const messages = await getChatMessages(chatId);

        if (messages) {
            const reversedMessages = messages.reverse();
            validatedMessages = reversedMessages;
        } else {
            throw new Error("Não foi possível recuperar as mensagens");
        }

        friendInfo = await getFriendInfo(chatUsers?.user2Id || 0)

        console.log("meu erro para checar", friendInfo);
    } catch (error) {
        console.error('Erro ao tentar pegar mensagens ou informações do amigo', error);
    }



    return (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                src={friendInfo.picture || "/perfil.png"}
                                alt={`${friendInfo.name} foto de perfil`}
                                className='rounded-full'
                            />
                        </div>
                    </div>

                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-gray-700 mr-3 font-semibold">
                                {friendInfo.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600">{friendInfo.email}</span>
                    </div>
                </div>
            </div>

            <Messages initialMessages={validatedMessages} sessionId={session.user.id} friendInfo={friendInfo} />
            <ChatInput chatId={chatId} senderId={session.user.id} friendInfo={friendInfo} />
        </div>
    )
}

export default page