import { IOrderService } from "../interface/IOrderService";

export class OrderController {
    constructor(private service:IOrderService) {};

    createOrder = async (data: any) => {
        try {
            console.log('Creating order with data:', data);
          const response = await this.service.createOrder(data);
          return response;
        } catch (e: any) {
          // Log the detailed error message and stack trace
          console.error("Error in createOrder:", e.message, e.stack);
          throw new Error(`Error in createOrder: ${e.message}`);
        }
      }
      

    sendPublishKey = () =>{
        try {
            return {publishKey:process.env.STRIPE_PUBLISH_KEY}
        } catch (e:any) {
            console.log(e)
        }
    }


    newPayment = async(data:string) =>{
        try {
            return this.service.newPayment(data);
        } catch (e:any) {
            console.log(e);
        }
    }

    getOrderAnalytics = async(instructorId:string)=>{
        try {
            return this.service.getOrderAnalytics(instructorId)            
        } catch (e:any) {
            console.log(e)
        }
    }

    getRevenueAnalytics = async(instructorId?:string) =>{
        try {
            return await this.service.getRevenueAnalytics(instructorId);
        } catch (e:any) {
            console.log(e)
        }
    }

    getTotalInstructorRevenueByCourse = async (courseId: string) => {
        try {
          const totalRevenue = await this.service.getTotalInstructorRevenueByCourse(courseId);
          console.log(totalRevenue)
          return { courseId, totalInstructorRevenue: totalRevenue };
        } catch (e: any) {
          console.log(e)
        }
      };
}