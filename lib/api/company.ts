import api from '../api';
import ApiRoutes from '@/constants/ApiRoutes';

/**
 * Fetch company data from the backend.
 * @returns {Promise} Axios response with company data
 */
export const fetchCompany = async () => {
    const response = await api.get(ApiRoutes.company.get);
    return response.data;
};
