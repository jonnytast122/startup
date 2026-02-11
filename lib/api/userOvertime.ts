import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

export const requestOvertime = async (data) => {
  const response = await api.post(ApiRoutes.userOvertime.request, data);
  return response.data;
};

export const getMyRequests = async (params?: Record<string, any>) => {
  const response = await api.get(ApiRoutes.userOvertime.getRequests, {
    params,
  });
  return response.data;
};

export const getMyOvertimeTypes = async () => {
  const response = await api.get(ApiRoutes.userOvertime.myOvertimeTypes);
  return response.data;
};

export const acceptAssignedOvertime = async ({ id, message }) => {
  const response = await api.put(
    ApiRoutes.userOvertime.acceptAssigned.replace("{id}", id),
    { message }
  );
  return response.data;
};

export const rejectAssignedOvertime = async ({ id, message }) => {
  const response = await api.put(
    ApiRoutes.userOvertime.rejectAssigned.replace("{id}", id),
    { message }
  );
  return response.data;
};
