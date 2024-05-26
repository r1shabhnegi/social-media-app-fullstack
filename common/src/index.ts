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

// TODO: From here

// create community

export const createCommunityInput = z.object({
  communityName: z.string(),
  description: z.string(),
});

export type CreateCommunityType = z.infer<typeof createCommunityInput>;

export const editCommunityInput = z.object({
  name: z.string(),
  rules: z.array(z.string()),
  description: z.string(),
  avatarImg: z.instanceof(File).or(z.instanceof(Blob)),
  coverImg: z.instanceof(File).or(z.instanceof(Blob)),
});

export type EditCommunityType = z.infer<typeof editCommunityInput>;
