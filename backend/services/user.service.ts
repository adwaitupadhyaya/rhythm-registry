import bcrypt from 'bcrypt';
import { updateUserById, deleteUserById, createUser } from '../models/user.model';
import { CreateUserRequest, UpdateUserRequest } from '../interfaces/user.interface';

export async function createUserService(data: CreateUserRequest) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return createUser(
    data.first_name,
    data.last_name,
    data.email,
    passwordHash,
    data.role
  );
}

export async function updateUserService(
  id: number,
  data: UpdateUserRequest
) {
  return updateUserById(id, data);
}

export async function deleteUserService(id: number) {
  return deleteUserById(id);
}
