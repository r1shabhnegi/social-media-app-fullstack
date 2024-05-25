import { z } from 'zod';

// sign-in
export const signinInput = z.object({
  username: z
    .string({ message: 'A string is required for this field.' })
    .min(4, { message: 'This field cannot have less than 4 characters.' })
    .max(16, { message: 'This field cannot have more than 15 characters.' }),
  password: z
    .string({ message: 'A string is required for this field.' })
    .min(4, { message: 'This field cannot have less than 4 characters.' })
    .max(16, { message: 'This field cannot have more than 15 characters.' }),
});

export type signinType = z.infer<typeof signinInput>;

// sign-up

export const signupInput = z.object({
  name: z
    .string({ message: 'A string is required for this field.' })
    .min(4, { message: 'This field cannot have less than 4 characters.' })
    .max(16, { message: 'This field cannot have more than 15 characters.' }),
  username: z
    .string({ message: 'A string is required for this field.' })
    .min(4, { message: 'This field cannot have less than 4 characters.' })
    .max(16, { message: 'This field cannot have more than 15 characters.' }),
  email: z
    .string({ message: 'A string is required for this field.' })
    .email({ message: 'An email address is required for this field.' }),
  password: z
    .string({ message: 'A string is required for this field.' })
    .min(4, { message: 'This field cannot have less than 4 characters.' })
    .max(16, { message: 'This field cannot have more than 15 characters.' }),
});

export type SignupType = z.infer<typeof signupInput>;

// create community
