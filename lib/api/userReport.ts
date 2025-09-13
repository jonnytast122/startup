import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getDailyAttendance = async () => {
  const response = await api.get(ApiRoutes.userReport.getDailyAttendance);
  return response.data;
}
  

export const getMonthlyCalendar = async () => {
  const response = await api.get(ApiRoutes.userReport.getMontlyCalendar);
  return response.data;
}

export const getEstimatePayroll =  async () => {
  const response = await api.get(ApiRoutes.userReport.getEstimatePayroll);
  return response.data
}

export const getUpcomingEvent = async () => {
    const response = await api.get(ApiRoutes.userReport.getUpcomintEvent);
    return response.data
}

export const getLeaveRate = async () => {
    const response = await api.get(ApiRoutes.userReport.getLeaveRate);
    return response.data
}

export const getWorkShiftRate = async () => {
    const response = await api.get(ApiRoutes.userReport.getWorkShiffRate);
    return response.data
}


