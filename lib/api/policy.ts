import api from "../api";
import ApiRoutes from "@/constants/ApiRoutes";

// ================= Overtime =================
export interface OvertimeType {
  id?: string;
  name: string;
  rate: number;
  description?: string;
}

export interface OvertimeSetting {
  id?: string;
  companyId: string;
  typeId: string;
  maxHours: number;
  isActive?: boolean;
}

// Fetch all overtime types
export const fetchoverTime = async (): Promise<OvertimeType[]> => {
  const response = await api.get<OvertimeType[]>(
    ApiRoutes.overTimeSetting.getOverTimeType
  );
  return response.data;
};

// Create a new overtime type
export const createOvertimeType = async (
  data: OvertimeType
): Promise<OvertimeType> => {
  const response = await api.post<OvertimeType>(
    ApiRoutes.overTimeSetting.createOvertimeType,
    data
  );
  if (response.status !== 201)
    throw new Error("Failed to create overtime type");
  return response.data;
};

// Fetch company overtime settings
export const fetchCompanyOverTimeSetting = async (
  companyId: string
): Promise<OvertimeSetting[]> => {
  const endpoint = ApiRoutes.overTimeSetting.get.replace(
    "{companyId}",
    companyId
  );
  const response = await api.get<OvertimeSetting[]>(endpoint);
  return response.data;
};

// Create overtime setting
export const createOvertimeSetting = async (
  data: OvertimeSetting
): Promise<OvertimeSetting> => {
  const response = await api.post<OvertimeSetting>(
    ApiRoutes.overTimeSetting.create,
    data
  );
  if (response.status !== 201)
    throw new Error("Failed to create overtime setting");
  return response.data;
};

// Update overtime setting
export const updateOvertimeSetting = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<OvertimeSetting>;
}): Promise<OvertimeSetting> => {
  const response = await api.put<OvertimeSetting>(
    ApiRoutes.overTimeSetting.update.replace("{id}", id),
    data
  );
  if (response.status !== 200)
    throw new Error("Failed to update overtime setting");
  return response.data;
};

// Delete overtime setting
export const deleteOvertimeSetting = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete<{ success: boolean; message?: string }>(
    ApiRoutes.overTimeSetting.delete.replace("{id}", id)
  );
  return response.data;
};

// ================= Leave Policy =================
export interface LeavePolicy {
  id?: string;
  companyId: string;
  name: string;
  maxDays: number;
  isPaid?: boolean;
}

// Fetch leave policies for a company
export const fetchCompanyLeavePolicy = async (
  companyId: string
): Promise<LeavePolicy[]> => {
  const endpoint = ApiRoutes.leavePolicies.get.replace(
    "{companyId}",
    companyId
  );
  const response = await api.get<LeavePolicy[]>(endpoint);
  return response.data;
};

// Create leave policy
export const createLeavePolicy = async (
  data: LeavePolicy
): Promise<LeavePolicy> => {
  const response = await api.post<LeavePolicy>(
    ApiRoutes.leavePolicies.create,
    data
  );
  if (response.status !== 201) throw new Error("Failed to create leave policy");
  return response.data;
};

// Update leave policy
export const updateLeavePolicy = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<LeavePolicy>;
}): Promise<LeavePolicy> => {
  const response = await api.put<LeavePolicy>(
    ApiRoutes.leavePolicies.update.replace("{id}", id),
    data
  );
  if (response.status !== 200) throw new Error("Failed to update leave policy");
  return response.data;
};

// Delete leave policy
export const deleteLeavePolicy = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete<{ success: boolean; message?: string }>(
    ApiRoutes.leavePolicies.delete.replace("{id}", id)
  );
  return response.data;
};
