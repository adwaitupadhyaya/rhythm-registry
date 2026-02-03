import { UserRole } from "../interfaces/auth.interfaces";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "../interfaces/user.interface";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isValidRole(value: unknown): value is UserRole {
  return (
    value === "super_admin" || value === "artist_manager" || value === "artist"
  );
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function validateCreateUser(
  body: unknown,
): asserts body is CreateUserRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.first_name)) throw new Error("First name required");
  if (!isNonEmptyString(b.last_name)) throw new Error("Last name required");
  if (!isNonEmptyString(b.email) || !isValidEmail(b.email)) {
    throw new Error("Invalid email format");
  }
  if (!isNonEmptyString(b.password) || !isStrongPassword(b.password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters",
    );
  }
  if (!isValidRole(b.role)) throw new Error("Invalid role");
  // Sanitize
  (body as CreateUserRequest).email = b.email.trim().toLowerCase();
  (body as CreateUserRequest).first_name = b.first_name.trim();
  (body as CreateUserRequest).last_name = b.last_name.trim();
}

export function validateUpdateUser(
  body: unknown,
): asserts body is UpdateUserRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const b = body as Record<string, unknown>;

  if (b.first_name !== undefined && !isNonEmptyString(b.first_name)) {
    throw new Error("Invalid first_name");
  }

  if (b.last_name !== undefined && !isNonEmptyString(b.last_name)) {
    throw new Error("Invalid last_name");
  }

  if (b.role !== undefined && !isValidRole(b.role)) {
    throw new Error("Invalid role");
  }

  if (b.is_active !== undefined && !isBoolean(b.is_active)) {
    throw new Error("Invalid is_active");
  }
}
