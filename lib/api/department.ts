import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

/**
 * Fetch departments for a specific company.
 * @param {string} companyId - The ID of the company
 * @returns {Promise} Axios response with department data
 */
export const fetchCompanyDepartments = async (
  companyId: string
): Promise<any> => {
  const endpoint = ApiRoutes.department.get.replace("{id}", companyId);
  const response = await api.get(endpoint);
  return response.data;
};

/**
 * Add a new department.
 * @param {Object} data - The department data
 * @param {string} data.name - The name of the department
 * @param {string} data.branch - The branch ID
 * @param {string} [data.manager] - Optional manager ID
 * @returns {Promise} Axios response with the created department data
 */

export const addDepartment = async (data: {
  name: string;
  branch: string;
  manager?: string;
}) => {
  const response = await api.post(ApiRoutes.department.create, data);
  return response.data;
};

/**
 * Update an existing department.
 * @param {string} id - The ID of the department to update
 * @param {Object} data - The updated department data
 * @returns {Promise} Axios response with the updated department data
 */
export const deleteDepartment = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.department.delete.replace("{id}", id)
  );
  return response.data;
};
