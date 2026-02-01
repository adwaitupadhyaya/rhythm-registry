import { LoginRequest, RegisterRequest } from "../interfaces/auth.interfaces";

function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateRegisterRequest(
  body: any
): asserts body is RegisterRequest {
  if (!isNonEmptyString(body.first_name)) throw new Error('First name is required');
  if (!isNonEmptyString(body.last_name)) throw new Error('Last name is required');
  
  if (!isNonEmptyString(body.email)) {
    throw new Error('Email is required');
  } else if (!body.email.includes('@')) {
    throw new Error('Please provide a valid email address');
  }

  if (!isNonEmptyString(body.password)) {
    throw new Error('Password is required');
  } else if (body.password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  if (body.role) {
    const validRoles = ['super_admin', 'artist_manager', 'artist'];
    if (!validRoles.includes(body.role)) {
      throw new Error(`Invalid user role. Must be one of: ${validRoles.join(', ')}`);
    }
  }
}

export function validateLoginRequest(
  body: any
): asserts body is LoginRequest {
  if (!isNonEmptyString(body.email)) throw new Error('Email is required to login');
  if (!isNonEmptyString(body.password)) throw new Error('Password is required to login');
}