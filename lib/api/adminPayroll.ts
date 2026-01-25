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

export const getDailyPayroll = async (date: string) => {
    const response = await api.get(ApiRoutes.adminPayroll.getDailyPayroll, {
        params: { date },
    });
    return response.data;
}

export const getDailyPayrollSummary = async (startDate: string, endDate: string) => {
    const response = await api.get(ApiRoutes.adminPayroll.getDailyPayrollSummary, {
        params: { startDate, endDate },
    });
    return response.data;
}

export const getCompanyPayrollDate = async () => {
    const response = await api.get(ApiRoutes.adminPayroll.getCompanyPayrollDate);
    return response.data;
}
