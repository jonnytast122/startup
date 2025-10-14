import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const fetchWorkShift = async (id: string) => {
  const response = await api.get(`${ApiRoutes.workShift.get}/${id}`);
  if (response.status !== 200) throw new Error("Failed to fetch branches");
  return response.data;
};

export const createWorkShift = async (data: any) => {
  const response = await api.post(ApiRoutes.workShift.create, data);
  if (response.status !== 201) throw new Error("Failed to add work shift");
  return response.data;
};

export const updateWorkShift = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  const response = await api.put(
    ApiRoutes.workShift.update.replace("{id}", id),
    data
  );
  return response.data;
};

export const deleteWorkShift = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.workShift.delete.replace("{id}", id)
  );
  return response.data;
};
