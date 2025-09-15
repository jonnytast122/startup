import { getSummary } from "@/lib/api/userAttendance";

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
  workShift: {
    create: `${BASE_URL}/shifts`,
    get: `${BASE_URL}/shifts/company`,
    update: `${BASE_URL}/shifts/{id}`,
    delete: `${BASE_URL}/shifts/{id}`,
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
  calendar: {
    get: `${BASE_URL}/calendars/all`,
    create: `${BASE_URL}/calendars`,
    update: `${BASE_URL}/calendars/{id}`,
    delete: `${BASE_URL}/calendars/{id}`,
  },

  userAttendance: {
    clockIn: `${BASE_URL}/attendance/clock-in`,
    clockOut: `${BASE_URL}/attendance/clock-out`,
    getAttendances: `${BASE_URL}/attendance/me`,
    getTodayAttendances: `${BASE_URL}/attendance/me/today`,
    getTotalWorkedHours: `${BASE_URL}/attendance/me/total-work-hours`,
    getSummary: `${BASE_URL}/attendance/me/summary`,
  },

  userLeave: {
    myPolicies: `${BASE_URL}/leaves/my-leave-policies`,
    request: `${BASE_URL}/leaves/request`,
    getRequests: `${BASE_URL}/leaves/my-requests`,
  },

  userOvertime: {
    myOvertimeTypes: `${BASE_URL}/overtime-settings/me`,
    request: `${BASE_URL}/overtime-requests`,
    getRequests: `${BASE_URL}/overtime-requests/me`,
  },


  //============== Thing Yet To Implement ===================

  userPayroll: {
    getMySummaryPayrolls: `${BASE_URL}/payroll/me/summary`,
    getMyPayrolls: `${BASE_URL}/payroll/me`,
    exportPayroll: `${BASE_URL}/payroll/me/export`,
  },

  userReport: {
    getDailyAttendance: `${BASE_URL}/dashboard/me/daily-attendance`,
    getMontlyCalendar: `${BASE_URL}/dashboard/me/calendar`,
    getEstimatePayroll: `${BASE_URL}/dashboard/me/estimate-payroll`,
    getUpcomintEvent: `${BASE_URL}/dashboard/me/upcoming-event`,
    getLeaveRate: `${BASE_URL}/dashboard/me/leave-rate`,
    getWorkShiffRate: `${BASE_URL}/dashboard/me/work-shift-rate`,
  },


  adminOverview: {
    getDailyAttendance: `${BASE_URL}/dashboard/daily-attendance`,
    getMontlyCalendar: `${BASE_URL}/dashboard/calendar`,
    getDailyOvertime: `${BASE_URL}/dashbaord/leave-overview`,
    getEstimatePayroll: `${BASE_URL}/dashboard/estimate-payroll`,
    getUpcomintEvent: `${BASE_URL}/dashboard/upcoming-event`,
    getLeaveRate: `${BASE_URL}/dashboard/leave-rate`,
    getWorkShiffRate: `${BASE_URL}/dashboard/work-shift-rate`,
    getCompanyOverview: `${BASE_URL}/dashboard/company-overview`,
  },

  adminAttendance: {
    getAttendances: `${BASE_URL}/attendance`,
    getActivity: `${BASE_URL}/attendance/activity`,
    addAttendances: `${BASE_URL}/attendance`,
    getEmployeeLocation: `${BASE_URL}/attendance/employee-location`,
    getEmployeeAttendance: `${BASE_URL}/attendance/employee/{id}`,
  },

  adminTimeSheet: {
    getTimeSheet: `${BASE_URL}/attendance/time-sheet`,
    getTimeSheetInsight: `${BASE_URL}/attendance/time-sheet-insight`
  },

  adminLeave: {
    getLeave: `${BASE_URL}/leaves`,
    getLeaveRequest: `${BASE_URL}/leaves/requests`,
    createLeave: `${BASE_URL}/leaves/request`,
    responseLeaveRequest: `${BASE_URL}/leaves/response`,
    getLeaveByEmployee: `${BASE_URL}/leaves/employee/{id}`,
  },

  adminOvertime: {
    getOvertime: `${BASE_URL}/overtime-requests`,
    responseOvertimeRequest: `${BASE_URL}/overtime-requests/response`,
    getOvertimeByEmployee: `${BASE_URL}/overtime-requests/employee/{id}`,
    createOvertime: `${BASE_URL}/overtime-requests`,
    getOvertimeRequests: `${BASE_URL}/overtime-requests/requests`,
  },

  adminPayroll: {
    getPayroll: `${BASE_URL}/payrolls`,
    getPayrollByEmployee: `${BASE_URL}/payrolls/employee/{id}`
  }
};

export default ApiRoutes;
