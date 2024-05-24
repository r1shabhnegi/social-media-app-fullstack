import { z } from 'zod';

const signinInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

type signinType = z.infer<typeof signinInput>;
