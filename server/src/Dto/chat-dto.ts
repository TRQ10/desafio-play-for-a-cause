import { z } from 'zod';

export const CreateChatDto = z.object({
    user1Id: z.number(),
    user2Id: z.number(),
});

export type CreateChatDto = z.infer<typeof CreateChatDto>;