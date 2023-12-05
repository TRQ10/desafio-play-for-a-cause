import { z } from 'zod';

export const BaseUserDtoSchema = z.object({
  name: z.string().min(1, 'Requer name').max(100),
  senha: z.string().min(1, 'Requer senha').min(8, 'A senha precisa ter mais de 8 caracteres')
});

export const CreateUserDtoSchema = BaseUserDtoSchema.extend({
  email: z.string().min(1, "Requer Email").email('Email inválido'),
  picture: z.string().optional(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const LoginDtoSchema = z.object({
  name: z.string().min(1, "Requer name "),
  senha: z.string().min(1, "Requer Senha "),
});

export const UserDtoSchema = CreateUserDtoSchema.extend({
  id: z.number(),
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
