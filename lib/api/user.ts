import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// Define User type for clarity
export interface User {
  id?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  company?: string;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch all users.
 */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(ApiRoutes.user.get);
  return response.data;
};

/**
 * Fetch the authenticated user's details.
 */
export const getMyDetails = async (): Promise<User> => {
  const response = await api.get<User>(ApiRoutes.user.getMyDetails);
  return response.data;
};

/**
 * Fetch a specific user by ID.
 * @param {string} id - User ID
 */
export const fetchUser = async (id: string): Promise<User> => {
  const response = await api.get<User>(
    ApiRoutes.user.getById.replace("{id}", id)
  );
  return response.data;
};

/**
 * Add a new user.
 * @param {User} data - New user data
 */
export const addUsers = async (data: User): Promise<User> => {
  const response = await api.post<User>(ApiRoutes.user.create, data);
  return response.data;
};

/**
 * Update an existing user.
 * @param {string} id - User ID
 * @param {Partial<User>} data - Fields to update
 */
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const response = await api.put<User>(
    ApiRoutes.user.update.replace("{id}", id),
    data
  );
  return response.data;
};

/**
 * Delete a user.
 * @param {string} id - User ID
 */
export const deleteUser = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete<{ success: boolean; message?: string }>(
    ApiRoutes.user.delete.replace("{id}", id)
  );
  return response.data;
};

/**
 * Fetch all members (same as fetchUsers, kept for clarity or future distinction).
 */
export const fetchMembers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(ApiRoutes.user.get);
  return response.data;
};
