import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// types for request & response
interface GeoLocation {
  latitude: number;
  longitude: number;
}

interface ClockRequest {
  geoLocation: GeoLocation;
}


// API functions
export const clockIn = async (data: ClockRequest) => {
  const response = await api.post(ApiRoutes.userAttendance.clockIn, data);
  return response.data;
};

export const clockOut = async (data: ClockRequest) => {
  const response = await api.post(ApiRoutes.userAttendance.clockOut, data);
  return response.data;
};

export const getAttendances = async () => {
  const response = await api.get(ApiRoutes.userAttendance.getAttendances);
  return response.data.attendances;
};

export const getShift = async () => {
  const response = await api.get(ApiRoutes.userAttendance.getAttendances);
  return response.data.shift;
};

export const getTodayAttendances = async () => {
  const response = await api.get(ApiRoutes.userAttendance.getTodayAttendances);
  return response.data;
};

export const getTotalWorkedHours = async () => {
  const response = await api.get(ApiRoutes.userAttendance.getTotalWorkedHours);
  return response.data.totalWorkHours;
};

export const getSummary = async () => {
  const response = await api.get(ApiRoutes.userAttendance.getSummary);
  return response.data;
};
