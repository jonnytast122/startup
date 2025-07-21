import api from '../api';
import ApiRoutes from '@/constants/ApiRoutes';

export const fetchPolicy = async () => {
    const response = await api.get(ApiRoutes.policy.getOverTimeType);
    return response.data;
};

export const fetchOverTimeSetting = async () => {
    const response = await api.get(ApiRoutes.policy.getOverTimeSetting);
    return response.data;
};
