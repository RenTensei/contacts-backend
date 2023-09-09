import { z } from 'zod';

export const UserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const EmailValidationSchema = z.object({
  email: z.string().email(),
});
