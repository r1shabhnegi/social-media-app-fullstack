import { allowedOrigin } from './allowedOrigins';

export const corsOptions = {
  origin: (origin: any, fallback: any) => {
    if (allowedOrigin.indexOf(origin) !== -1) {
      fallback(null, true);
    } else {
      fallback(new Error('Not allowed by the CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
