import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

type BranchPayload = Record<string, unknown>;

export const fetchBranches = async () => {
  const response = await api.get(ApiRoutes.branch.get);
  if (response.status !== 200) throw new Error("Failed to fetch branches");
  return response.data;
};

export const updateBranch = async ({
  id,
  data,
}: {
  id: string;
  data: BranchPayload;
}) => {
  const response = await api.put(
    ApiRoutes.branch.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update branch");
  return response.data;
};

export const fetchDepartmentsByBranch = async (branchId: string) => {
  const response = await api.get(
    ApiRoutes.branch.getDepartmentsByBranch.replace("{id}", branchId)
  );
  if (response.status !== 200)
    throw new Error("Failed to fetch departments for branch");
  return response.data;
};

export const addBranch = async (data: BranchPayload) => {
  const response = await api.post(ApiRoutes.branch.create, data);
  if (response.status !== 201) throw new Error("Failed to add branch");
  return response.data;
};

export const deleteBranch = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.branch.delete.replace("{id}", id)
  );
  return response.data;
};


