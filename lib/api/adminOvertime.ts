import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getOvertime = async (params) => {
  const response = await api.get(ApiRoutes.adminOvertime.getOvertime, {
    params: params,
  });
  return response.data;
};

export const approveOvertime = async ({ id, message }) => {
  const response = await api.put(
    ApiRoutes.adminOvertime.approveOvertime.replace("{id}", id),
    { message }
  );
  return response.data;
};

export const rejectOvertime = async ({ id, message }) => {
  const response = await api.put(
    ApiRoutes.adminOvertime.rejectOvertime.replace("{id}", id),
    { message }
  );
  return response.data;
};

export const getOvertimeByEmployee = async ({ id, startDate, endDate }) => {
  const response = await api.get(
    ApiRoutes.adminOvertime.getOvertimeByEmployee.replace("{id}", id),
    {
      params:
        startDate && endDate
          ? {
              startDate,
              endDate,
            }
          : undefined,
    },
  );
  return response.data;
};

export const createOvertimeForEmployee = async ({employeeList, data}) => {
  const response = await api.post(ApiRoutes.adminOvertime.createOvertimeForEmployee,{
    employeeList, data
  });
  return response.data;
};

export const getOvertimeRequests = async () => {
  const response = await api.get(ApiRoutes.adminOvertime.getOvertimeRequests);
  return response.data;
};
