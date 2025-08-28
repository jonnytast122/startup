import api from '../api';
import ApiRoutes from '@/constants/ApiRoutes';

export const fetchoverTime = async () => {
  const response = await api.get(ApiRoutes.overTimeSetting.getOverTimeType);
  return response.data;
};

export const createOvertimeType = async (data) => {
  try {
    const response = await api.post(ApiRoutes.overTimeSetting.createOvertimeType, data);
    if (response.status !== 201) throw new Error('Failed to create overtime type');
    return response.data;
  } catch (error) {
    console.error('Failed to create overtime type:', error);
    throw error;
  }
};

export const fetchCompanyOverTimeSetting = async (companyId: string) => {
  const endpoint = ApiRoutes.overTimeSetting.get.replace('{companyId}', companyId);
  const response = await api.get(endpoint);
  return response.data;
};

export const createOvertimeSetting = async (data) => {
  try {
    const response = await api.post(ApiRoutes.overTimeSetting.create, data);
    if (response.status !== 201) throw new Error('Failed to create overtime setting');
    return response.data;
  } catch (error) {
    console.error('Failed to create overtime setting:', error);
    throw error;
  }
};

export const updateOvertimeSetting = async ({ id, data }) => {
  try {
    const response = await api.put(ApiRoutes.overTimeSetting.update.replace('{id}', id), data);
    if (response.status !== 200) throw new Error('Failed to update overtime setting');
    return response.data;
  } catch (error) {
    console.error('Failed to update overtime setting:', error);
    throw error;
  }
};

export const deleteOvertimeSetting = async (id: string) => {
  const response = await api.delete(ApiRoutes.overTimeSetting.delete.replace('{id}', id));
  return response.data;
};

// ========== Leave Policy ==========

export const fetchCompanyLeavePolicy = async (companyId: string) => {
  const endpoint = ApiRoutes.leavePolicies.get.replace('{companyId}', companyId);
  const response = await api.get(endpoint);
  return response.data;
};

export const createLeavePolicy = async (data) => {
  try {
    const response = await api.post(ApiRoutes.leavePolicies.create, data);
    if (response.status !== 201) throw new Error('Failed to create leave policy');
    return response.data;
  } catch (error) {
    console.error('Failed to create leave policy:', error);
    throw error;
  }
};

export const updateLeavePolicy = async ({ id, data }) => {
  try {
    const response = await api.put(ApiRoutes.leavePolicies.update.replace('{id}', id), data);
    if (response.status !== 200) throw new Error('Failed to update leave policy');
    return response.data;
  } catch (error) {
    console.error('Failed to update leave policy:', error);
    throw error;
  }
};

export const deleteLeavePolicy = async (id: string) => {
  try {
    const response = await api.delete(ApiRoutes.leavePolicies.delete.replace('{id}', id));
    return response.data;
  } catch (error) {
    console.error('Failed to delete leave policy:', error);
    throw error;
  }
};
