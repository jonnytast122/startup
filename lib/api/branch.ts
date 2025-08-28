import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

// Define the branch type
export interface Branch {
  id?: string; // optional for creating new branches
  name: string;
  companyId: string;
  // add any other fields your branch has
}

export const fetchBranches = async (): Promise<Branch[]> => {
  const response = await api.get(ApiRoutes.branch.get);
  if (response.status !== 200) throw new Error("Failed to fetch branches");
  return response.data;
};

export const updateBranch = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Branch>; // partial because you may update only some fields
}): Promise<Branch> => {
  const response = await api.put(
    ApiRoutes.branch.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update branch");
  return response.data;
};

export const addBranch = async (data: Branch): Promise<Branch> => {
  const response = await api.post(ApiRoutes.branch.create, data);
  if (response.status !== 201) throw new Error("Failed to add branch");
  return response.data;
};

export const deleteBranch = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete(
    ApiRoutes.branch.delete.replace("{id}", id)
  );
  return response.data;
};
