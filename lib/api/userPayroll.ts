import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getMySummaryPayrolls = async () => {
    const response = await api.get(ApiRoutes.userPayroll.getMySummaryPayrolls);
    return response.data
}

export const getMyPayrolls = async () => {
    const response = await api.get(ApiRoutes.userPayroll.getMyPayrolls);
    return response.data
}

export const exportPayroll = async () => {
    const response = await api.get(ApiRoutes.userPayroll.exportPayroll);
    return response.data
}