import express from 'express';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { movies, users, favorites, watchHistory } from './src/db/schema.ts';
import { eq, and } from 'drizzle-orm';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import * as dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // User registration / sync
  const getOrCreateUser = async (uid: string, email: string, displayName?: string, photoURL?: string) => {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) return existing[0];

    const [newUser] = await db.insert(users).values({
      uid,
      email,
      displayName,
      photoURL,
    }).returning();
    return newUser;
  };

  // API Routes
  app.get('/api/movies', async (req, res) => {
    try {
      const allMovies = await db.select().from(movies);
      res.json(allMovies);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  });

  app.get('/api/movies/:id', async (req, res) => {
    try {
      const movie = await db.select().from(movies).where(eq(movies.id, parseInt(req.params.id))).limit(1);
      if (movie.length === 0) return res.status(404).json({ error: 'Movie not found' });
      res.json(movie[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  });

  app.post('/api/user/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await getOrCreateUser(req.user!.uid, req.user!.email!, req.user!.name, req.user!.picture);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to sync user' });
    }
  });

  app.get('/api/favorites', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await getOrCreateUser(req.user!.uid, req.user!.email!);
      const userFavorites = await db.select({
        movie: movies
      }).from(favorites)
        .innerJoin(movies, eq(favorites.movieId, movies.id))
        .where(eq(favorites.userId, user.id));
      res.json(userFavorites.map(f => f.movie));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  });

  app.post('/api/favorites/:movieId', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await getOrCreateUser(req.user!.uid, req.user!.email!);
      const movieId = parseInt(req.params.movieId);
      
      const existing = await db.select().from(favorites).where(
        and(eq(favorites.userId, user.id), eq(favorites.movieId, movieId))
      ).limit(1);

      if (existing.length > 0) {
        await db.delete(favorites).where(
          and(eq(favorites.userId, user.id), eq(favorites.movieId, movieId))
        );
        return res.json({ favorited: false });
      } else {
        await db.insert(favorites).values({ userId: user.id, movieId });
        return res.json({ favorited: true });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle favorite' });
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
