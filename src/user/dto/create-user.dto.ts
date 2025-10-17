import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
