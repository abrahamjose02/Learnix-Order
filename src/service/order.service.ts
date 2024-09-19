import { IOrderService } from "../interface/IOrderService";
import "dotenv/config";
import { IOrderRepository } from "../interface/IOrderRepository";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");






export class OrderService implements IOrderService {
  constructor(private repository: IOrderRepository) {}

  async newPayment(data: string): Promise<Object> {
    try {

      const totalAmount = parseInt(data);

      const customer = await stripe.customers.create({
        name: "Thomas Maliekal",
        email: "jennyrosen@example.com",
        address: {
          city: "palkkad",
          country: "US",
          state: "kerala",
          postal_code: "679336",
          line1: "123 Thomas ndjdnjd",
        },
      });
      const myPayment = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "inr",
        metadata: {
          company: "Learnix",
        },
        description: "Course purchase",
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
        shipping: {
          name: "Thomas Maliekal",
          address: {
            city: "palakkad",
            country: "US",
            state: "kerala",
            postal_code: "679336",
            line1: "123 Thomas ndjdnjd",
          },
        },
      });
      return { clientSecret: myPayment.client_secret };
    } catch (e: any) {
      throw new Error("Not Found");
    }
  }

  async createOrder(data: any) {
    try {
      const { amount } = data.payment_info;
  
      console.log('Received totalAmount:', amount); // Debug log
  
      // Validate and convert totalAmount
      const totalAmount = Number(amount) / 100;
  
      if (isNaN(totalAmount)) {
        throw new Error("Invalid totalAmount provided");
      }
  
      const instructorRevenue = totalAmount * 0.9;
      const adminRevenue = totalAmount * 0.1;
  
      // Ensure revenue values are numbers and not NaN
      if (isNaN(instructorRevenue) || isNaN(adminRevenue)) {
        throw new Error("Calculated revenue values are invalid");
      }
  
      const orderData = {
        ...data,
        instructorRevenue,
        adminRevenue
      };
  
      return await this.repository.createOrder(orderData);
    } catch (e: any) {
      console.error("Error in createOrder service:", e.message, e.stack);
      throw new Error(`Error in createOrder service: ${e.message}`);
    }
  }
  
  
  
async getOrderAnalytics(instructorId: string): Promise<Object[] | null> {
  const months: { month: string; value: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      month: date.toLocaleString("default", { month: "long" }),
      value: date.toISOString().slice(0, 7),
    });
  }

  const response = await this.repository.getOrderAnalytics(instructorId);
  const aggregatedData: Record<string, number> = {};
  if (response) {
    response.forEach(({ _id, count }: any) => {
      aggregatedData[_id] = count;
    });
  } else {
    return null;
  }

  const output: Object[] = months.map(({ month, value }) => ({
    month,
    count: aggregatedData[value] || 0,
  }));

  return output;
}
async getRevenueAnalytics(instructorId?: string): Promise<Object[]> {
    try {
      return this.repository.getRevenueAnalytics(instructorId);
    } catch (e:any) {
      throw new Error("Service Error in fetching revenue analytics");
    }
}

async getTotalInstructorRevenueByCourse(courseId: string): Promise<any> {
  try {
    const totalRevenue = await this.repository.getTotalInstructorRevenueByCourse(courseId);
    return totalRevenue
  } catch (e: any) {
    console.log("Service Error in fetching total instructor revenue:", e.message);
  }
}

}
