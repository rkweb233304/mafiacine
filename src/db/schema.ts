import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  posterUrl: text('poster_url').notNull(),
  videoUrl: text('video_url').notNull(),
  genre: text('genre').notNull(),
  rating: text('rating').notNull(),
  releaseYear: integer('release_year').notNull(),
  duration: text('duration').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  movieId: integer('movie_id').references(() => movies.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const watchHistory = pgTable('watch_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  movieId: integer('movie_id').references(() => movies.id).notNull(),
  progress: integer('progress').default(0), // progress in seconds
  lastWatchedAt: timestamp('last_watched_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  watchHistory: many(watchHistory),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  favorites: many(favorites),
  watchHistory: many(watchHistory),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  movie: one(movies, { fields: [favorites.movieId], references: [movies.id] }),
}));

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  user: one(users, { fields: [watchHistory.userId], references: [users.id] }),
  movie: one(movies, { fields: [watchHistory.movieId], references: [movies.id] }),
}));
