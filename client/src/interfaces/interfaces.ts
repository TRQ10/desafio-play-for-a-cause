import { z } from 'zod';


export const BaseUserDtoSchema = z.object({
  usuario: z.string(),
  senha: z.string().min(8).max(20)
});

export const CreateUserDtoSchema = BaseUserDtoSchema.extend({
  email: z.string().email(),
  perfil: z.string().optional(),
});


export const CreateLoginResponse = z.object({
  id: z.number(),
  token: z.string()
});

export type LoginResponse = z.infer<typeof CreateLoginResponse>

export const LoginDtoSchema = BaseUserDtoSchema;

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type LoginDto = z.infer<typeof LoginDtoSchema>;


