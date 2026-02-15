import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getLeave = async (params) => {
  const response = await api.get(ApiRoutes.adminLeave.getLeave, { params });
  return response.data;
};

export const getLeaveRequest = async () => {
  const response = await api.get(ApiRoutes.adminLeave.getLeaveRequest);
  return response.data;
};

export const createLeave = async () => {
  const response = await api.post(ApiRoutes.adminLeave.createLeave);
  return response.data;
};

export const approveLeave = async ({ id, message }) => {
  const response = await api.put(
    ApiRoutes.adminLeave.approveLeave.replace("{id}", id),
    { message }
  );
  return response.data;
};

export const rejectLeave = async ({ id, message }) => {
  const response = await api.put(
    ApiRoutes.adminLeave.rejectLeave.replace("{id}", id),
    { message }
  );
  return response.data;
};

export const getLeaveByEmployee = async () => {
  const response = await api.get(ApiRoutes.adminLeave.getLeaveByEmployee);
  return response.data;
};

export const createLeaveForEmployee = async ({employeeList,data}) => {
  const response = await api.post(ApiRoutes.adminLeave.createLeaveForEmployee,{employeeList,data})
  return response.data;
}
