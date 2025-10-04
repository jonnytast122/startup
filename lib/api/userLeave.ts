import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";


export const getMyPolicies = async () => {
  const response = await api.get(ApiRoutes.userLeave.myPolicies);
  return response.data.policies;
};

export const getMyBalance = async (id) => {
  const response = await api.get(ApiRoutes.userLeave.myBalance.replace("{id}", id));
  return response.data.policies;
};

export const requestLeave = async (data) => {
  const response = await api.post(ApiRoutes.userLeave.request, data);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get(ApiRoutes.userLeave.getRequests);
  return response.data.data;
};

