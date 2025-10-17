import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// Safe generic object type (instead of `any`)
type GroupPayload = Record<string, unknown>;

/**
 * Fetch all sections.
 * @returns {Promise<unknown>} Axios response with section data
 */
export const fetchSections = async (): Promise<unknown> => {
	const response = await api.get(ApiRoutes.section.get);
	return response.data;
};

export const fetchMembers = async (
	filters: {
		branches?: string[];
		departments?: string[];
		page?: number;
		limit?: number;
		sortBy?: string;
	} = {}
) => {
	const params = new URLSearchParams();

	filters.branches?.forEach((b) => params.append("branch", b));
	filters.departments?.forEach((d) => params.append("department", d));

	if (filters.page) params.append("page", filters.page.toString());
	if (filters.limit) params.append("limit", filters.limit.toString());
	if (filters.sortBy) params.append("sortBy", filters.sortBy);

	const url = `${ApiRoutes.user.get}?${params.toString()}`;
	const response = await api.get(url);
	return response.data;
};

export const fetchGroup = async (groupId: string): Promise<unknown> => {
	const response = await api.get(
		ApiRoutes.group.getId.replace("{id}", groupId)
	);
	return response.data;
};

/**
 * Add a new section.
 * @param {Object} data - The section data
 * @param {string} data.name - The name of the section
 * @returns {Promise<unknown>} Axios response with the created section data
 */
export const addSection = async (data: { name: string }) => {
	const response = await api.post(ApiRoutes.section.create, data);
	return response.data;
};

/**
 * Add a new group.
 * @param {Object} data - The group data
 * @returns {Promise<unknown>} Axios response with the created group data
 */
export const addGroup = async (data: GroupPayload) => {
	const response = await api.post(ApiRoutes.group.create, data);
	if (response.status !== 201) throw new Error("Failed to create group");
	return response.data;
};

/**
 * Update a group.
 * @param {string} id - The ID of the group
 * @param {Object} data - The updated group data
 * @returns {Promise<unknown>} Axios response with updated group data
 */
export const updateGroup = async ({
	id,
	data,
}: {
	id: string;
	data: GroupPayload;
}) => {
	const response = await api.put(
		ApiRoutes.group.update.replace("{id}", id),
		data
	);
	return response.data;
};

export const deleteGroup = async (id: string) => {
	const response = await api.delete(ApiRoutes.group.delete.replace("{id}", id));
	return response.data;
};

/**
 * Update an existing section.
 * @param {string} id - The ID of the section
 * @param {Object} data - The updated section data
 * @returns {Promise<unknown>} Axios response with updated section data
 */
export const updateSection = async (id: string, data: { name: string }) => {
	const response = await api.put(
		ApiRoutes.section.update.replace("{id}", id),
		data
	);
	return response.data;
};

/**
 * Delete a section.
 * @param {string} id - The ID of the section
 * @returns {Promise<unknown>} Axios response confirming deletion
 */
export const deleteSection = async (id: string) => {
	const response = await api.delete(
		ApiRoutes.section.delete.replace("{id}", id)
	);
	return response.data;
};
