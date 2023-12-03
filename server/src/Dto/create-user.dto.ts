import { z } from 'zod';

export const BaseUserDtoSchema = z.object({
  usuario: z.string(),
  senha: z.string().min(8).max(20),
});

export const CreateUserDtoSchema = BaseUserDtoSchema.extend({
  email: z.string().email(),
  perfil: z.string().optional(),
});

export const LoginDtoSchema = z.object({
  usuario: z.string(),
  senha: z.string(),
});

export const UserDtoSchema = z.object({
  id: z.number(),
  usuario: z.string(),
  senha: z.string(),
  email: z.string(),
  perfil: z.string().optional(),
  verified: z.boolean(),
  verificationToken: z.string().optional(),
});

export const FriendshipDtoSchema = z.object({
  id: z.number(),
  user1Id: z.number(),
  user2Id: z.number(),
  user1: UserDtoSchema,
  user2: UserDtoSchema,
});

export const FriendshipKeyDtoSchema = z.object({
  user1Id: z.number(),
  user2Id: z.number()
})

export type FriendshipKey = z.infer<typeof FriendshipKeyDtoSchema>;

export type FriendshipDto = z.infer<typeof FriendshipDtoSchema>;

export type UserDto = z.infer<typeof UserDtoSchema>;

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type LoginDto = z.infer<typeof LoginDtoSchema>;
