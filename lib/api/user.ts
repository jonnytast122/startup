import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const fetchMembers = async () => {
  const response = await api.get(ApiRoutes.user.get);
  return response.data;
};