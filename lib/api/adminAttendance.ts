import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getAttendances = async (companyId,startDate,endDate) => {
    const response = await api.get(ApiRoutes.adminAttendance.getAttendances.replace('{id}', companyId), { params: { startDate, endDate } });
    return response.data.data
}

export const getActivity = async () => {
    const response = await api.get(ApiRoutes.adminAttendance.getActivity);
    return response.data
}

export const addAttendances = async () => {
    const response = await api.post(ApiRoutes.adminAttendance.addAttendances);
    return response.data
}

export const getEmployeeLocation = async () => {
    const response = await api.get(ApiRoutes.adminAttendance.getEmployeeLocation);
    return response.data
}

export const getEmployeeAttendance = async (employeeId,startDate,endDate) => {
    const response = await api.get(ApiRoutes.adminAttendance.getEmployeeAttendance.replace('{id}', employeeId), { params: { startDate, endDate } });
    return response.data.data
}