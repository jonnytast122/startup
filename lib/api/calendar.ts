import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

// Generic safe object type
type CalendarPayload = Record<string, unknown>;

export const fetchCalendar = async () => {
  const response = await api.get(ApiRoutes.calendar.get);
  return response.data;
};

export const addCalendar = async (data: CalendarPayload) => {
  const response = await api.post(ApiRoutes.calendar.create, data);
  return response.data;
};

export const updateCalendar = async ({
  id,
  data,
}: {
  id: string;
  data: CalendarPayload;
}) => {
  const response = await api.put(
    ApiRoutes.calendar.update.replace("{id}", id),
    data
  );
  return response.data;
};

export const deleteCalendar = async (id: string) => {
  const response = await api.delete(
    ApiRoutes.calendar.delete.replace("{id}", id)
  );
  return response.data;
};
