import ApiRoutes from "@/constants/ApiRoutes";
import api from "../api";

export const getDailyAttendance = async (id: string) => {
    const response = await api.get(ApiRoutes.adminOverview.getDailyAttendance.replace("{id}",id));
    return response.data
}
    

export const getMonthlyCalendar = async ({id,month,year}: {id:string,month:number,year:number}) => {
    const response = await api.get(ApiRoutes.adminOverview.getMontlyCalendar.replace("{id}",id),{
        params: {
            month,
            year
        }
    });
    return response.data
}


export const getDailyOvertime = async ({id,startDate,endDate}: {id:string,startDate:string,endDate:string}) => {
    const response = await api.get(ApiRoutes.adminOverview.getDailyOvertime.replace("{id}",id),{
        params: {
            startDate,
            endDate
        }
    });
    return response.data
}


export const getEstimatePayroll = async ({id,startDate,endDate}: {id:string,startDate:string,endDate:string}) => {
    const response = await api.get(ApiRoutes.adminOverview.getEstimatePayroll.replace("{id}",id),{
        params: {
            startDate,
            endDate
        }
    });
    return response.data
}


export const getUpcomingEvent = async ({id,startDate,endDate}: {id:string,startDate:string,endDate:string}) => {
    const response = await api.get(ApiRoutes.adminOverview.getUpcomintEvent.replace("{id}",id),{
        params: {
            startDate,
            endDate
        }
    });
    return response.data
}


export const getLeaveRate = async ({id,startDate,endDate}: {id:string,startDate:string,endDate:string}) => {
    const response = await api.get(ApiRoutes.adminOverview.getLeaveRate.replace("{id}",id),{
        params: {
            startDate,
            endDate
        }
    });
    return response.data
}


export const getWorkShiftRate = async ({id,startDate,endDate}: {id:string,startDate:string,endDate:string}) => {
    const response = await api.get(ApiRoutes.adminOverview.getWorkShiffRate.replace("{id}",id),{
        params: {
            startDate,
            endDate
        }
    });
    return response.data
}


export const getCompanyOverview = async (id: string) => {
    const response = await api.get(ApiRoutes.adminOverview.getCompanyOverview.replace("{id}",id));
    return response.data
}
