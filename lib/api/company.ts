import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

/**
 * Fetch company data from the backend.
 * @returns {Promise} Axios response with company data
 */
export const fetchCompany = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get(ApiRoutes.company.get, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyCompany = async () => {
  const response = await api.get(ApiRoutes.company.getMyCompany);
  return response.data;
};

export const getEmployee = async (id: string) => {
  const response = await api.get(
    ApiRoutes.company.getEmployee.replace("{id}", id)
  );
  return response.data;
};

// Safe replacement for 'any'
type CompanyPayload = Record<string, unknown>;

export const updateCompany = async ({
  id,
  data,
}: {
  id: string;
  data: CompanyPayload;
}) => {
  const response = await api.put(
    ApiRoutes.company.update.replace("{id}", id),
    data
  );
  return response.data;
};
