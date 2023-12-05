import Providers from '@/components/Providers'
import { Icons, Icon } from '@/components/icons'
import Link from 'next/link'
import Image from 'next/image';
import { ReactNode } from 'react'
import { getServerSession } from 'next-auth';
import { authOptions, url } from '@/app/api/auth/[...nextauth]/route';
import SignOutButton from '@/components/SignOutButton';
import { redirect } from 'next/navigation';
import FriendRequestsSidebarOptions from '@/components/FriendRequestsSidebarOptions';
import { fetchPendingFriendRequests } from '@/lib/api';

interface LayoutProps {
    children: ReactNode
}

interface SidebarOption {
    id: number
    name: string
    href: string
    Icon: Icon
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add um amigo',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    }
]



const Layout = async ({ children }: LayoutProps) => {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/api/auth/signin')
    }

    const result = await fetchPendingFriendRequests(session?.user.id);

    let unseenRequestCount = result?.data.length

    return (
        <Providers>
            <div className="w-full flex h-screen">
                <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                        <Image
                            src={'/logo.png'}
                            alt={'Logo'}
                            width={36}
                            height={36}
                            className='h-8 w-auto'
                        />
                    </Link>

                    <div className="text-xs font-semibold leading-6 text-gray-400">
                        Suas Conversas
                    </div>

                    <nav className='flex flex-1 flex-col'>
                        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                            <li>
                                // Conversas que esse usuario tem
                            </li>
                            <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400">
                                    Resumo
                                </div>

                                <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                    {sidebarOptions.map((option) => {
                                        const Icon = Icons[option.Icon]
                                        return (
                                            <li key={option.id}>
                                                <Link href={option.href}
                                                    className='text-gray-700 hover:text-pink-500 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                    <span className='text-gray-400 border-gray-200 group-hover:border-pink-500 group-hover:text-pink-500 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium'>
                                                        <Icon className='h-4 w-4' />
                                                    </span>

                                                    <span className='truncate'>{option.name}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>

                            <li>
                                <FriendRequestsSidebarOptions sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                            </li>

                            <li className='-mx-6 mt-auto flex items-center'>
                                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                    <div className="relative h-8 w-8 bg-gray-50">
                                        <Image
                                            fill
                                            referrerPolicy='no-referrer'
                                            className='rounded-full'
                                            src={session.user.picture || '/perfil.png'}
                                            alt="Sua foto de perfil"
                                        />
                                    </div>

                                    <span className='sr-only'>Seu Perfil</span>
                                    <div className="flex flex-col">
                                        <span aria-hidden='true'>{session.user.name}</span>
                                        <span className='text-xs text-zinc-400' aria-hidden="true">
                                            {session.user.email}
                                        </span>
                                    </div>
                                </div>
                                <SignOutButton className='h-full flex justify-center items-center aspect-square' />
                            </li>
                        </ul>
                    </nav>
                </div>
                {children}
            </div>
        </Providers>
    )
}


export default Layout