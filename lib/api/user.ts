import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

export const fetchUsers = async () => {
  const response = await api.get(ApiRoutes.user.get);
  return response.data;
};

export const getMyDetails = async () => {
  const response = await api.get(ApiRoutes.user.getMyDetails);
  return response.data;
};
export const addUser = async (data: {
  name: string;
  email: string;
  companyId: string;
}) => {
  const response = await api.post(ApiRoutes.user.create, data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: { name: string; email: string }
) => {
  const response = await api.put(
    ApiRoutes.user.update.replace("{id}", id),
    data
  );
  return response.data;
};
export const deleteUser = async (id: string) => {
  const response = await api.delete(ApiRoutes.user.delete.replace("{id}", id));
  return response.data;
};

export const fetchMembers = async () => {
  const response = await api.get(ApiRoutes.user.get);
  return response.data;
};
