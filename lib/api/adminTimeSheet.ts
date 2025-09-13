import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getTimeSheet = async () => {
    const response = await api.get(ApiRoutes.adminTimeSheet.getTimeSheet);
    return response.data
}

export const getTimeSheetInsight = async () => {
    const response = await api.get(ApiRoutes.adminTimeSheet.getTimeSheetInsight);
    return response.data
}