import { UserRole } from '../interfaces/auth.interfaces';
import { CreateUserRequest, UpdateUserRequest } from '../interfaces/user.interface';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isValidRole(value: unknown): value is UserRole {
  return value === 'super_admin' || value === 'artist_manager' || value === 'artist';
}

export function validateCreateUser(
  body: unknown
): asserts body is CreateUserRequest {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.first_name)) throw new Error('First name required');
  if (!isNonEmptyString(b.last_name)) throw new Error('Last name required');
  if (!isNonEmptyString(b.email)) throw new Error('Email required');
  if (!isNonEmptyString(b.password)) throw new Error('Password required');
  if (!isValidRole(b.role)) throw new Error('Invalid role');
}

export function validateUpdateUser(
  body: unknown
): asserts body is UpdateUserRequest {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  if (b.first_name !== undefined && !isNonEmptyString(b.first_name)) {
    throw new Error('Invalid first_name');
  }

  if (b.last_name !== undefined && !isNonEmptyString(b.last_name)) {
    throw new Error('Invalid last_name');
  }

  if (b.role !== undefined && !isValidRole(b.role)) {
    throw new Error('Invalid role');
  }

  if (b.is_active !== undefined && !isBoolean(b.is_active)) {
    throw new Error('Invalid is_active');
  }
}
