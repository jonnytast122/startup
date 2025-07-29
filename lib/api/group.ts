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
