-- MafiaCine Database Schema (Supabase Compatible)

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE, -- Firebase Authentication ID
    email TEXT NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Movies Table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    video_url TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    duration TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites Table (Join Table for User-Movie Relationship)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Watch History Table
CREATE TABLE watch_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0, -- Progress in seconds
    last_watched_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
