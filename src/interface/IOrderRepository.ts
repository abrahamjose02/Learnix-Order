export interface IOrderRepository{
    // getOrderAnalytics(instructorId:string):Promise<Object[] | null>
    createOrder(data:any):Promise<Object | null>;
}