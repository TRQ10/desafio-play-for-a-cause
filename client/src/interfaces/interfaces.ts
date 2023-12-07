import { z } from 'zod';


export const BaseUserDtoSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Requer name').max(100),
  senha: z.string().min(1, 'Requer senha').min(8, 'A senha precisa ter mais de 8 caracteres')
});

export const CreateUserDtoSchema = BaseUserDtoSchema.extend({
  email: z.string().min(1, "Requer Email").email('Email inválido'),
  picture: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
});


export const CreateLoginResponse = z.object({
  id: z.number(),
  token: z.string()
});

export const MessageValidator = z.object({
  id: z.number(),
  chatId: z.number(),
  senderId: z.number(),
  content: z.string(),
  createdAt: z.date(),
  isSeen: z.boolean(),
  updatedAt: z.date(),
  order: z.number(),
})

export const ChatValidator = z.object({
  id: z.number(),
  user1Id: z.number(),
  user2Id: z.number(),
})

export const MessageSender = z.object({
  chatId: z.number(),
  senderId: z.number(),
  content: z.string(),
})

export const LoginDtoSchema = BaseUserDtoSchema;

export type MessageSender = z.infer<typeof MessageSender>

export type ChatValidator = z.infer<typeof ChatValidator>

export type MessageValidator = z.infer<typeof MessageValidator>;

export type LoginResponse = z.infer<typeof CreateLoginResponse>;

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type LoginDto = z.infer<typeof LoginDtoSchema>;


