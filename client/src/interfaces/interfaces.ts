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


export const CreateLoginResponse = z.object({
  id: z.number(),
  token: z.string()
});

export type LoginResponse = z.infer<typeof CreateLoginResponse>

export const LoginDtoSchema = BaseUserDtoSchema;

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type LoginDto = z.infer<typeof LoginDtoSchema>;


