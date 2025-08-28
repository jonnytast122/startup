import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const addPosition = async (data:any) => {
  const response = await api.post(ApiRoutes.position.create, data);
  return response.data;
}

export const fetchPositions = async () => {
  const response = await api.get(`${ApiRoutes.position.get}/filter`);
  if(response.status !== 200) throw new Error('Failed to fetch positions');
  return response.data;
}

export const deletePosition = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.position.delete.replace("{id}", id)
  );
  return response.data;
}

export const updatePosition = async ({id, data}: {id: string, data: any}) => {
  const response = await api.put(
    ApiRoutes.position.update.replace("{id}", id),
    data
  );
  return response.data;
}