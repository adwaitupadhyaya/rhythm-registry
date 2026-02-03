import { query } from '../db/pool';
import { UserRole } from '../interfaces/auth.interfaces';
import { User, UserRow } from '../interfaces/user.interface';

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function findUsers(
  limit: number,
  offset: number
): Promise<UserRow[]> {
  const result = await query<UserRow>(
    `SELECT id, first_name, last_name, email, role, is_active, created_at
     FROM users
     ORDER BY id
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
}

export async function createUser(
  first_name: string,
  last_name: string,
  email: string,
  passwordHash: string,
  role: string
): Promise<User> {
  const result = await query<User>(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, email, role`,
    [first_name,last_name, email, passwordHash, role]
  );

  return result.rows[0];
}

export async function getAllUsers(): Promise<User[]> {
  const result = await query<User>(
    `SELECT id, first_name, last_name, email, role FROM users`
  );
  return result.rows;
}

export async function updateUserById(
  id: number,
  fields: Partial<{
    first_name: string;
    last_name: string;
    role: UserRole;
    is_active: boolean;
  }>
): Promise<UserRow | null> {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map(
    (key, index) => `${key} = $${index + 1}`
  );

  const values = Object.values(fields);

  const result = await query<UserRow>(
    `UPDATE users SET ${updates.join(', ')}
     WHERE id = $${keys.length + 1}
     RETURNING id, first_name, last_name, email, role, is_active, created_at`,
    [...values, id]
  );

  return result.rows[0] ?? null;
}

export async function deleteUserById(id: number): Promise<boolean> {
  const result = await query(
    `DELETE FROM users WHERE id = $1`,
    [id]
  );

  return result.rowCount === 1;
}