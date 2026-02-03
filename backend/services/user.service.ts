import bcrypt from "bcrypt";
import {
  updateUserById,
  deleteUserById,
  createUser,
  findUserByEmail,
} from "../models/user.model";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "../interfaces/user.interface";

export async function createUserService(data: CreateUserRequest) {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  return createUser(
    data.first_name,
    data.last_name,
    data.email,
    passwordHash,
    data.role,
  );
}

export async function updateUserService(id: number, data: UpdateUserRequest) {
  const user = await updateUserById(id, data);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function deleteUserService(id: number) {
  const deleted = await deleteUserById(id);
  if (!deleted) {
    throw new Error("User not found");
  }
  return true;
}
