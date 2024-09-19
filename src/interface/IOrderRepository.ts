import { RevenuePerOrder } from "./IRevenuePerOrder";

export interface IOrderRepository{
    createOrder(data:any):Promise<Object | null>;
    getOrderAnalytics(instructorId:string):Promise<Object[] | null>
    getRevenueAnalytics(instructorId?: string): Promise<Object[]>
    getTotalInstructorRevenueByCourse(courseId: string): Promise<number | null>
}