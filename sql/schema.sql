-- Custom ENUM types
CREATE TYPE gender_type AS ENUM ('m', 'f', 'o');
CREATE TYPE music_genre AS ENUM ('rnb', 'country', 'classic', 'rock', 'jazz', 'pop', 'hiphop');
CREATE TYPE user_role AS ENUM ('super_admin', 'artist_manager','artist');

-- ==============================
-- USERS TABLE
-- ==============================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  gender TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'artist',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- ARTIST TABLE
-- ==============================

CREATE TABLE artist (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  address TEXT,
  first_release_year INTEGER,
  no_of_albums_released INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- MUSIC TABLE
-- ==============================

CREATE TABLE music (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artist(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  album_name TEXT,
  genre TEXT,
  release_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- INDEXES (performance)
-- ==============================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_music_artist_id ON music(artist_id);
