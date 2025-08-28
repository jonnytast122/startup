import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// Define the Company interface
export interface Company {
  id?: string; // optional for creating new company data
  name: string;
  address?: string;
  phoneNumber?: string;
  // add any other fields your company has
}

/**
 * Fetch company data from the backend.
 * @returns {Promise<Company[]>} Axios response with company data
 */
export const fetchCompany = async (): Promise<Company[]> => {
  const response = await api.get(ApiRoutes.company.get);
  if (response.status !== 200) throw new Error("Failed to fetch company data");
  return response.data;
};

/**
 * Update a company
 * @param id - Company ID
 * @param data - Partial company data to update
 * @returns {Promise<Company>} Updated company data
 */
export const updateCompany = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Company>; // Partial allows updating only some fields
}): Promise<Company> => {
  const response = await api.put(
    ApiRoutes.company.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update company");
  return response.data;
};
