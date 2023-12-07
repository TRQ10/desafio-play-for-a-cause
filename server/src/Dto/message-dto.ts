import { z } from 'zod';

export const SendMessageDto = z.object({
    chatId: z.number(),
    senderId: z.number(),
    content: z.string(),
});

export const UpdateMessageDto = z.object({
    chatId: z.number(),
    messageId: z.number(),
    newContent: z.string(),
});


export type UpdateMessageDtoType = z.infer<typeof UpdateMessageDto>;

export type SendMessageDtoType = z.infer<typeof SendMessageDto>;