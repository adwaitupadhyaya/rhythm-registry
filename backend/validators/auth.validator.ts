import { LoginRequest, RegisterRequest, UserRole } from "../interfaces/auth.interfaces";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidRole(value: unknown): value is UserRole {
  return value === 'super_admin' ||
         value === 'artist_manager' ||
         value === 'artist';
}

export function validateRegisterRequest(
  body: unknown
): asserts body is RegisterRequest {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be an object');
  }

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.first_name)) {
    throw new Error('First name is required');
  }

  if (!isNonEmptyString(b.last_name)) {
    throw new Error('Last name is required');
  }

  if (!isNonEmptyString(b.email)) {
    throw new Error('Email is required');
  }

  if (!b.email.includes('@')) {
    throw new Error('Please provide a valid email address');
  }

  if (!isNonEmptyString(b.password)) {
    throw new Error('Password is required');
  }

  if (b.password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  if (b.role !== undefined && !isValidRole(b.role)) {
    throw new Error('Invalid user role');
  }
}

export function validateLoginRequest(
  body: unknown
): asserts body is LoginRequest {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Request body must be an object');
  }

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.email)) {
    throw new Error('Email is required to login');
  }

  if (!isNonEmptyString(b.password)) {
    throw new Error('Password is required to login');
  }
}
