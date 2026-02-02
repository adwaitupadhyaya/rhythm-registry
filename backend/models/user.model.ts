import { query } from '../db/pool';
import { User } from '../interfaces/user.interface';

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
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

export async function findAllUsers(): Promise<User[]> {
  const result = await query<User>(
    `SELECT id, first_name, last_name, email, role FROM users`
  );
  return result.rows;
}