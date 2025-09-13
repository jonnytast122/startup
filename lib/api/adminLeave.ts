import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getLeave = async () => {
    const response = await api.get(ApiRoutes.adminLeave.getLeave);
    return response.data
}
    

export const getLeaveRequest = async () => {
    const response = await api.get(ApiRoutes.adminLeave.getLeaveRequest);
    return response.data
}

export const createLeave = async () => {
    const response = await api.post(ApiRoutes.adminLeave.createLeave);
    return response.data
}

export const responseLeaveRequest = async () => {
    const response = await api.post(ApiRoutes.adminLeave.responseLeaveRequest);
    return response.data
}

export const getLeaveByEmployee = async () => {
    const response = await api.get(ApiRoutes.adminLeave.getLeaveByEmployee);
    return response.data
}