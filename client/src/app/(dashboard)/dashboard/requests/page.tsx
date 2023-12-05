import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import FriendRequests from '@/components/FriendRequests';
import { fetchPendingFriendRequests } from '@/lib/api'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'


const page = async () => {
    const session = await getServerSession(authOptions);

    if (!session) notFound();

    const result = await fetchPendingFriendRequests(session?.user.id);

    const friendRequest: IncomingFriendRequest[] = result?.data;


    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
            <div className="flex flex-col gap-4">
                <FriendRequests incomingFriendRequests={friendRequest} sessionId={session.user.id} />
            </div>
        </main>
    );
};

export default page;