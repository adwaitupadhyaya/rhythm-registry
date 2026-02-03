import { findUserByEmail, createUser } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export async function registerUser(
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  role: string,
) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(
    first_name,
    last_name,
    email,
    passwordHash,
    role,
  );

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await comparePassword(password, user.password_hash);

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.first_name + " " + user.last_name,
      email: user.email,
      role: user.role,
    },
  };
}
