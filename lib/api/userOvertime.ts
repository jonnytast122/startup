import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

export const requestOvertime = async (data) => {
  const response = await api.post(ApiRoutes.userOvertime.request, data);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get(ApiRoutes.userOvertime.getRequests);
  return response.data;
};


export const getMyOvertimeTypes = async () => {
  const response = await api.get(ApiRoutes.userOvertime.myOvertimeTypes);
  return response.data;
};
