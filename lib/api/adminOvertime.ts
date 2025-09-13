import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getOvertime = async () => {
    const response = await api.get(ApiRoutes.adminOvertime.getOvertime);
    return response.data
}
    

export const responseOvertimeRequest = async () => {
    const response = await api.post(ApiRoutes.adminOvertime.responseOvertimeRequest);
    return response.data
}

export const getOvertimeByEmployee = async () => {
    const response = await api.get(ApiRoutes.adminOvertime.getOvertimeByEmployee);
    return response.data
}

export const createOvertime = async () => {
    const response = await api.post(ApiRoutes.adminOvertime.createOvertime);
    return response.data
}

export const getOvertimeRequests = async () => {
    const response = await api.get(ApiRoutes.adminOvertime.getOvertimeRequests);
    return response.data
}
