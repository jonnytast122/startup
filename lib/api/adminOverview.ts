import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getDailyAttendance = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getDailyAttendance);
    return response.data
}
    

export const getMonthlyCalendar = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getMontlyCalendar);
    return response.data
}


export const getDailyOvertime = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getDailyOvertime);
    return response.data
}


export const getEstimatePayroll = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getEstimatePayroll);
    return response.data
}


export const getUpcomingEvent = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getUpcomintEvent);
    return response.data
}


export const getLeaveRate = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getLeaveRate);
    return response.data
}


export const getWorkShiftRate = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getWorkShiffRate);
    return response.data
}


export const getCompanyOverview = async () => {
    const response = await api.get(ApiRoutes.adminOverview.getCompanyOverview);
    return response.data
}
