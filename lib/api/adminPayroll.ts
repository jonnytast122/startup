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

export const createCompanyPayrollDate = async (payload: {
    startDay: number;
    taxExchangeRate?: number;
    nssfExchangeRate?: number;
}) => {
    const response = await api.post(
        ApiRoutes.adminPayroll.createCompanyPayrollDate,
        payload
    );
    return response.data;
}

export const finalizePayrollSummary = async (payload: {
    startDate: string;
    endDate: string;
    taxExchangeRate?: number;
    nssfExchangeRate?: number;
}) => {
    const response = await api.post(
        ApiRoutes.adminPayroll.finalizePayrollSummary,
        payload
    );
    return response.data;
}
