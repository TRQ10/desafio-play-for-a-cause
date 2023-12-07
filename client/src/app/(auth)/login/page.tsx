'use client'

import Button from '@/components/ui/Button'
import { LoginDto } from '@/interfaces/interfaces'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import Image from 'next/image';
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from 'react-hot-toast'

interface pageProps { }

const Page: FC<pageProps> = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDto>();

    const onSubmit: SubmitHandler<LoginDto> = async (data) => {
        setIsLoading(true);
        try {

            const res = await signIn("credentials", {
                name: data.name,
                senha: data.senha,
                redirect: false,
            });

            if (res?.status == 200) {
                router.push('/dashboard');
            } else {
                toast.error("Falha ao logar, verifique suas credenciais");
            }
        } catch (error) {
            toast.error('Erro durante o login');
        } finally {
            setIsLoading(false);
        }
    };

    return <>
        <div className="flex min-h-full items-cente justify-center py-12 px-4 sm:px-6 lg-px-8">
            <div className="w-full flex flex-col items-cente max-w-md space-y-8">
                <div className="flex flex-col items-center gap-8">
                    <Image
                        src={'/logo.png'}
                        alt={'Logo'}
                        width={36}
                        height={36}
                        className='h-8 w-auto'
                    />
                    <h2 className="mt-6 text-cente text-3xl font-bold tracking-tight text-black">
                        Faça o Login para a sua conta
                    </h2>
                    <form className="relative flex flex-col items-center gap-8"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4 flex flex-col gap-6">
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 
                        font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200
                        placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 
                        disabled:border-0 disabled:bg-blue-gray-50" {...register('name', { required: true })} />
                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Usuario
                                </label>
                            </div>
                            <div className="relative h-11 w-full min-w-[200px]">
                                <input className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 
                        font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200
                        placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 
                        disabled:border-0 disabled:bg-blue-gray-50" {...register('senha', { required: true })} />
                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Senha
                                </label>
                                <p className='text-[11px] font-normal mt-2 ml-2'>Caso não possua uma conta clique <a className='text-pink-500' href="/register">aqui</a></p>
                            </div>
                        </div>
                        <Button type="submit" isLoading={isLoading}>Entrar</Button>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default Page