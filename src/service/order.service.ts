import { IOrderService } from "../interface/IOrderService";
import "dotenv/config";
import { IOrderRepository } from "../interface/IOrderRepository";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export class OrderService implements IOrderService {
  constructor(private repository: IOrderRepository) {}

  async newPayment(data: string): Promise<Object> {
    try {
      const customer = await stripe.customers.create({
        name: "Jenny Rosen",
        email: "jennyrosen@example.com",
        address: {
          city: "palkkad",
          country: "US",
          state: "kerala",
          postal_code: "679336",
          line1: "123 nabeel ndjdnjd",
        },
      });
      const myPayment = await stripe.paymentIntents.create({
        amount: parseInt(data),
        currency: "inr",
        metadata: {
          company: "Eduquest",
        },
        description: "Course purchase",
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
        shipping: {
          name: "Jenny Rosen",
          address: {
            city: "palakkad",
            country: "US",
            state: "kerala",
            postal_code: "679336",
            line1: "123 nabeel ndjdnjd",
          },
        },
      });
      return { clientSecret: myPayment.client_secret };
    } catch (e: any) {
      throw new Error("Not Found");
    }
  }

  createOrder(data: any) {
    try {
      return this.repository.createOrder(data);
    } catch (e: any) {
      throw new Error("Not Found");
}
}
}
