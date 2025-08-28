import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";
import { User } from "./user";

// Define Section and Group interfaces
export interface Section {
  id?: string;
  name: string;
  companyId?: string; // optional if not required in some endpoints
}

export interface Group {
  id?: string;
  name: string;
  sectionId?: string; // optional if not required in some endpoints
  members?: string[]; // optional array of user IDs
}

/**
 * Fetch all sections.
 * @returns Promise resolving to an array of sections
 */
export const fetchSections = async (): Promise<Section[]> => {
  const response = await api.get(ApiRoutes.section.get);
  if (response.status !== 200) throw new Error("Failed to fetch sections");
  return response.data;
};

/**
 * Fetch all users/members.
 * @returns Promise resolving to an array of users
 */
export const fetchMembers = async (): Promise<User[]> => {
  const response = await api.get(ApiRoutes.user.get);
  if (response.status !== 200) throw new Error("Failed to fetch members");
  return response.data;
};
/**
 * Fetch a single group by ID
 */
export const fetchGroup = async (groupId: string): Promise<Group> => {
  const response = await api.get(
    ApiRoutes.group.getId.replace("{id}", groupId)
  );
  if (response.status !== 200) throw new Error("Failed to fetch group");
  return response.data;
};

/**
 * Add a new section
 */
export const addSection = async (data: { name: string }): Promise<Section> => {
  const response = await api.post(ApiRoutes.section.create, data);
  if (response.status !== 201) throw new Error("Failed to create section");
  return response.data;
};

/**
 * Add a new group
 */
export const addGroup = async (data: Group): Promise<Group> => {
  const response = await api.post(ApiRoutes.group.create, data);
  if (response.status !== 201) throw new Error("Failed to create group");
  return response.data;
};

/**
 * Update an existing group
 */
export const updateGroup = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Group>;
}): Promise<Group> => {
  const response = await api.put(
    ApiRoutes.group.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update group");
  return response.data;
};

/**
 * Delete a group
 */
export const deleteGroup = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete(ApiRoutes.group.delete.replace("{id}", id));
  return response.data;
};

/**
 * Update a section
 */
export const updateSection = async (
  id: string,
  data: { name: string }
): Promise<Section> => {
  const response = await api.put(
    ApiRoutes.section.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update section");
  return response.data;
};

/**
 * Delete a section
 */
export const deleteSection = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete(
    ApiRoutes.section.delete.replace("{id}", id)
  );
  return response.data;
};
