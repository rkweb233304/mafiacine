import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Web App URL for Google Sheets Data
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyRKK8EXjK9IYgypMBtcodDAhKT4GPRTZyq0KUdyLUOEm82cMD2ADYjUkjZINgVs5do/exec";

  app.get('/api/data', async (req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(WEB_APP_URL, {
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.warn('Google Apps Script fetch fallback:', error);
      // Fallback safely so front-end never crashes
      res.json({ movies: [], banner: [] });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();