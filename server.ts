import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import chatHandler from './api/chat.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Gemini AI Chat endpoint (delegates to api/chat.js serverless handler)
  app.all('/api/chat', (req: Request, res: Response) => {
    return chatHandler(req, res);
  });

  // Backward compatibility alias for /api/gemini/tutor
  app.all('/api/gemini/tutor', (req: Request, res: Response) => {
    return chatHandler(req, res);
  });

  // Check Gemini API status
  app.get('/api/gemini/status', (_req: Request, res: Response) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({ available: hasKey });
  });

  // Production vs Dev mode with Vite
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Edu 3D Geometry Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
