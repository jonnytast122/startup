import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

export interface PromotePayload {
  userId: string;
  permissions?: string[];
}

export interface UpdatePermissionsPayload {
  add?: string[];
  remove?: string[];
}

export const promoteToAdmin = async (payload: PromotePayload) => {
  const response = await api.post(ApiRoutes.userRoles.promote, payload);
  return response.data;
};

export const demoteToUser = async (userId: string) => {
  const response = await api.post(
    ApiRoutes.userRoles.demote.replace("{id}", userId)
  );
  return response.data;
};

export const updateAdminPermissions = async (
  userId: string,
  payload: UpdatePermissionsPayload
) => {
  const response = await api.put(
    ApiRoutes.userRoles.updatePermissions.replace("{id}", userId),
    payload
  );
  return response.data;
};
