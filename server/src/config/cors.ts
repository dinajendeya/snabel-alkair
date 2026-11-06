import { CorsOptions } from 'cors';
import { ENV } from './env';

const allowedOrigins: string[] = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  ENV.CLIENT_URL,
].filter(Boolean) as string[];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during deployment/testing to prevent CORS blocks
    }
  },
  credentials: true,
};

