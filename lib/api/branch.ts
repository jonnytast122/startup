import ApiRoutes from "@/constants/ApiRoutes"
import api from "../api"

export const fetchBranches = async () => {
  const response = await api.get(ApiRoutes.branch.get);
  if(response.status !== 200) throw new Error('Failed to fetch branches');
  return response.data;
}

export const updateBranch = async ({id, data} : {id: string, data:any}) => {
  const response = await api.put(
    ApiRoutes.branch.update.replace("{id}", id),
    data
  );
  if(response.status !== 200) throw new Error('Failed to fetch branches');
  return response.data;
}

export const addBranch = async (data:any) => {
  const response = await api.post(ApiRoutes.branch.create, data);
  if(response.status !== 201) throw new Error('Failed to add branch');
  return response.data;
}

export const deleteBranch = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.branch.delete.replace("{id}", id)
  );
  return response.data;
}