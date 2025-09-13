import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getAttendances = async () => {
    const response = await api.get(ApiRoutes.adminAttendance.getAttendances);
    return response.data
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

export const getEmployeeAttendance = async () => {
    const response = await api.get(ApiRoutes.adminAttendance.getEmployeeAttendance);
    return response.data
}