import { create } from "domain";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1";

const ApiRoutes = {
  auth: {
    sendOTP: `${BASE_URL}/auth/send-login-verification-phone`,
    login: `${BASE_URL}/auth/login`,
  },
  company: {
    create: `${BASE_URL}/companies`,
    get: `${BASE_URL}/companies`,
    getMyCompany: `${BASE_URL}/companies/my-company`,
    update: `${BASE_URL}/companies/{id}`,
    delete: `${BASE_URL}/companies/{id}`,
  },
  branch: {
    create: `${BASE_URL}/branches`,
    get: `${BASE_URL}/branches`,
    update: `${BASE_URL}/branches/{id}`,
    delete: `${BASE_URL}/branches/{id}`,
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
  position: {
    create: `${BASE_URL}/jobs`,
    get: `${BASE_URL}/jobs`,
    update: `${BASE_URL}/jobs/{id}`,
    delete: `${BASE_URL}/jobs/{id}`,
  },

  group: {
    create: `${BASE_URL}/groups`,
    get: `${BASE_URL}/groups`,
    getId: `${BASE_URL}/groups/{id}`,
    update: `${BASE_URL}/groups/{id}`,
    delete: `${BASE_URL}/groups/{id}`,
  },
  section: {
    create: `${BASE_URL}/group-sections`,
    get: `${BASE_URL}/group-sections`,
    update: `${BASE_URL}/group-sections/{id}`,
    delete: `${BASE_URL}/group-sections/{id}`,
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
  },
  user: {
    get: `${BASE_URL}/users/filter`,
    getMyDetails: `${BASE_URL}/users/my-detail`,
    create: `${BASE_URL}/users`,
    update: `${BASE_URL}/user/{id}`,
    delete: `${BASE_URL}/user/{id}`,
    getById: `${BASE_URL}/user/{id}`,
    search: `${BASE_URL}/users/search`,
  },

  userAttendance: {
    clockIn: `${BASE_URL}/attendance/clock-in`,
    clockOut: `${BASE_URL}/attendance/clock-out`,
    getAttendances: `${BASE_URL}/attendance/me`,
    getTodayAttendances: `${BASE_URL}/attendance/me/today`,
    getTotalWorkedHours: `${BASE_URL}/attendance/me/total-work-hours`,
    getSummary: `${BASE_URL}/attendance/me/summary`,
  },
};

export default ApiRoutes;
