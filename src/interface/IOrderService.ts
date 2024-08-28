export interface IOrderService{
    // getOrderAnalytics(instructorId:string):Promise<Object[] | null>
    newPayment(data:string):any;
    createOrder(data:any):any;
}