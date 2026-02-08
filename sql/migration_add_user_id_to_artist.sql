-- Migration: Add user_id column to artist table
-- This migration adds the user_id foreign key column to track which user owns each artist profile

-- Step 1: Add the user_id column if it doesn't exist
ALTER TABLE artist ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Step 2: Create an index on user_id for faster lookups
CREATE INDEX idx_artist_user_id ON artist(user_id);

-- Step 3: UPDATE EXISTING ARTISTS (adjust as needed based on your data)
-- Example: Associate Arjit Singh (artist_id=1) with user_id=3
-- UPDATE artist SET user_id = 3 WHERE id = 1;

-- After you've run steps 1-2, identify which users should own which artists and run the UPDATE statements
-- You can query existing data to help:
-- SELECT id, name FROM artist;
-- SELECT id, first_name, last_name, role FROM users;
