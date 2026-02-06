import bcrypt from "bcrypt";
import {
  updateUserById,
  deleteUserById,
  createUser,
  findUserByEmail,
  createUserTx,
} from "../models/user.model";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "../interfaces/user.interface";
import { withTransaction } from "../db/transaction";
import { insertArtistTx } from "../models/artist.model";

export async function createUserService(data: CreateUserRequest) {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  return withTransaction(async (client) => {
    const user = await createUserTx(client, {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: passwordHash,
      role: data.role,
    });

    if (user.role === "artist") {
      await insertArtistTx(client, {
        name: `${user.first_name} ${user.last_name}`,
        user_id: user.id,
      });
    }

    return user;
  });
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
