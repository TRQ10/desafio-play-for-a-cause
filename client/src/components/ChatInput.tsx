'use client'

import { url } from '@/app/api/auth/[...nextauth]/route';
import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import toast from 'react-hot-toast';

interface ChatInputProps {
    chatId: number,
    senderId: number
    friendInfo: any
}

const ChatInput: FC<ChatInputProps> = ({ chatId, senderId, friendInfo }) => {

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setisLoading] = useState<boolean>(false)

    const sendMessage = async () => {
        setisLoading(true);

        try {


            const response = await fetch(`${url}/message/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: +chatId,
                    senderId: senderId,
                    content: message,
                }),
            });
            setMessage('')
            textareaRef.current?.focus()

        } catch (error) {
            toast.error("Algo deu errado, por favor tente novamente mais tarde")
        } finally {
            setisLoading(false);

        }
    };

    return (
        <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
            <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-pink-500'>
                <TextareaAutosize
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                        }
                    }}
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message ${friendInfo.name}`}
                    className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
                />

                <div
                    onClick={() => textareaRef.current?.focus()}
                    className='py-2'
                    aria-hidden='true'>
                    <div className='py-px'>
                        <div className='h-9' />
                    </div>
                </div>

                <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                    <div className='flex-shrin-0'>
                        <Button isLoading={isLoading} onClick={sendMessage} type='submit'>
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInput

