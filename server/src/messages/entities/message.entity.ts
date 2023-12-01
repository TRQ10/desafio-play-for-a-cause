import { z } from 'zod';

export const MessageSchema = z.object({
  name: z.string(),
  message: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;