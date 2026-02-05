import { http } from './http';
import type { User, CreateUserRequest, UpdateUserRequest, PaginationParams } from '@/types';

class UserService {
  async getAll(params: PaginationParams): Promise<User[]> {
    const queryParams = new URLSearchParams({
      limit: params.limit.toString(),
      offset: params.offset.toString(),
    });

    return http.get<User[]>(`/api/users?${queryParams}`);
  }

  async create(data: CreateUserRequest): Promise<User> {
    return http.post<User>('/api/users', data);
  }

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    return http.put<User>(`/api/users/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return http.delete(`/api/users/${id}`);
  }
}

export const userService = new UserService();
