export interface IOrderService{
    newPayment(data:string):any;
    createOrder(data:any):any;
    getOrderAnalytics(instructorId:string):Promise<Object[] | null>
    getRevenueAnalytics(instructorId?: string): Promise<Object[]>
    getTotalInstructorRevenueByCourse(courseId: string): Promise<any>
}