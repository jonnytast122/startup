import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getDailyAttendance = async ({startDate,endDate}: {startDate: string, endDate: string}) => {
  const response = await api.get(ApiRoutes.userReport.getDailyAttendance, {
    params: {
      startDate, endDate
    }
  });
  return response.data;
}
  

export const getMonthlyCalendar = async ({month,year}: {month: string, year: string}) => {
  const response = await api.get(ApiRoutes.userReport.getMontlyCalendar, {
    params: {
      month, year
    }
  });
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


