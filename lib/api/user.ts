import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// Define User interface
export interface User {
  id?: string; // optional for creation
  name: string;
  email: string;
  companyId: string;
  role?: string; // optional if you have roles
  phoneNumber?: string;
}

/**
 * Fetch all users
 */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get(ApiRoutes.user.get);
  if (response.status !== 200) throw new Error("Failed to fetch users");
  return response.data;
};

/**
 * Add a new user
 */
export const addUser = async (data: User): Promise<User> => {
  const response = await api.post(ApiRoutes.user.create, data);
  if (response.status !== 201) throw new Error("Failed to add user");
  return response.data;
};

/**
 * Update an existing user
 */
export const updateUser = async (
  id: string,
  data: Partial<Pick<User, "name" | "email">>
): Promise<User> => {
  const response = await api.put(
    ApiRoutes.user.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update user");
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(ApiRoutes.user.delete.replace("{id}", id));
  return response.data;
};

/**
 * Fetch members (same as users)
 */
export const fetchMembers = async (): Promise<User[]> => {
  return fetchUsers(); // reuse fetchUsers
};
