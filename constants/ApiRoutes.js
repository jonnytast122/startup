const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1";

const ApiRoutes = {
  auth: {
    sendOTP: `${BASE_URL}/auth/send-login-verification-phone`,
    login: `${BASE_URL}/auth/login`,
  },
  company: {
    create: `${BASE_URL}/companies`,
    get: `${BASE_URL}/companies`,
    update: `${BASE_URL}/company/{id}`,
    delete: `${BASE_URL}/company/delete`,
  },
  branch: {
    create: `${BASE_URL}/branches`,
    get: `${BASE_URL}/branches`,
    update: `${BASE_URL}/branch/{id}`,
    delete: `${BASE_URL}/branch/delete`,
  },
  department: {
    create: `${BASE_URL}/departments`,
    get: `${BASE_URL}/departments/{id}/departments`,
    update: `${BASE_URL}/departments/{id}`,
    delete: `${BASE_URL}/departments/{id}`,
  },
  title: {
    create: `${BASE_URL}/titles`,
    get: `${BASE_URL}/title/get`,
    update: `${BASE_URL}/title/{id}`,
    delete: `${BASE_URL}/title/delete`,
  },

  group: {
    create: `${BASE_URL}/groups`,
    get: `${BASE_URL}/groups`,
    update: `${BASE_URL}/group/{id}`,
    delete: `${BASE_URL}/group/delete`,
  },
  section: {
    create: `${BASE_URL}/group-sections`,
    get: `${BASE_URL}/group-sections`,
    update: `${BASE_URL}/section/{id}`,
    delete: `${BASE_URL}/section/delete`,
  },

  overTimeSetting: {
    getOverTimeType: `${BASE_URL}/overtime-types`,
    createOvertimeType: `${BASE_URL}/overtime-types`,
    get: `${BASE_URL}/overtime-settings/company/{companyId}`,
    create: `${BASE_URL}/overtime-settings`,
    update: `${BASE_URL}/overtime-settings/{id}`,
    delete: `${BASE_URL}/overtime-settings/{id}`,
  },
  leavePolicies: {
    get: `${BASE_URL}/leave-policies/company/{companyId}`,
    create: `${BASE_URL}/leave-policies`,
    update: `${BASE_URL}/leave-policies/{id}`,
    delete: `${BASE_URL}/leave-policies/{id}`,
  }


};

export default ApiRoutes;
