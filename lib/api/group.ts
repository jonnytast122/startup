import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

/**
 * Fetch groups for a specific company.
 * @param {string} companyId - The ID of the company
 * @returns {Promise} Axios response with group data
 */
export const fetchSections = async () => {
  const response = await api.get(ApiRoutes.section.get);
  return response.data;
};

/**
 * Add a new section.
 * @param {Object} data - The group data
 * @param {string} data.name - The name of the group
 * @param {string} data.companyId - The company ID
 * @returns {Promise} Axios response with the created group data
 */
export const addSection = async (data: { name: string; companyId: string }) => {
  const response = await api.post(ApiRoutes.section.create, data);
  return response.data;
};

/**
 * Add a new group to a section.
 * @param {string} sectionId - The ID of the section
 * @param {Object} data - The group data
 * @param {string} data.name - The name of the group
 * @returns {Promise} Axios response with the created group data
 */
export const addGroup = async (sectionId: string, data: { name: string }) => {
  const response = await api.post(
    ApiRoutes.group.create.replace("{sectionId}", sectionId),
    data
  );
  return response.data;
};
/**
 * Update an existing group.
 * @param {string} id - The ID of the group to update
 * @param {Object} data - The updated group data
 * @returns {Promise} Axios response with the updated group data
 */
export const updateSection = async (id: string, data: { name: string }) => {
  const response = await api.put(
    ApiRoutes.section.update.replace("{id}", id),
    data
  );
  return response.data;
};

/**
 * Delete a group.
 * @param {string} id - The ID of the group to delete
 * @returns {Promise} Axios response confirming deletion
 */
export const deleteSection = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.section.delete.replace("{id}", id)
  );
  return response.data;
};
