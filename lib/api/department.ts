import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// Define a Department interface
export interface Department {
  id?: string; // optional for creating new departments
  name: string;
  branch: string; // branch ID
  manager?: string; // optional manager ID
}

/**
 * Fetch departments for a specific company.
 * @param companyId - The ID of the company
 * @returns Promise resolving to an array of departments
 */
export const fetchCompanyDepartments = async (
  companyId: string
): Promise<Department[]> => {
  const endpoint = ApiRoutes.department.get.replace("{id}", companyId);
  const response = await api.get(endpoint);
  if (response.status !== 200) throw new Error("Failed to fetch departments");
  return response.data;
};

/**
 * Add a new department.
 * @param data - Department data
 * @returns Promise resolving to the created department
 */
export const addDepartment = async (data: Department): Promise<Department> => {
  const response = await api.post(ApiRoutes.department.create, data);
  if (response.status !== 201) throw new Error("Failed to add department");
  return response.data;
};

/**
 * Update an existing department.
 * @param id - The ID of the department
 * @param data - Partial department data to update
 * @returns Promise resolving to the updated department
 */
export const updateDepartment = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Department>; // use Partial for partial updates
}): Promise<Department> => {
  const response = await api.put(
    ApiRoutes.department.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update department");
  return response.data;
};

/**
 * Delete a department
 * @param id - The ID of the department
 * @returns Promise resolving to a success message or object
 */
export const deleteDepartment = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete(
    ApiRoutes.department.delete.replace("{id}", id)
  );
  return response.data;
};
