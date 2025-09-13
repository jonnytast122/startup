import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getPayroll = async () => {
    const response = await api.get(ApiRoutes.adminPayroll.getPayroll);
    return response.data
}
    

export const getPayrollByEmployee = async () => {
    const response = await api.get(ApiRoutes.adminPayroll.getPayrollByEmployee);
    return response.data
}