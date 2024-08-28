import { IOrderRepository } from "../interface/IOrderRepository";
import OrderModel from "../modal/order.schema";

export class OrderRepository implements IOrderRepository {

  async createOrder(data: any): Promise<object | null> {
    try {
      const course = await OrderModel.create(data);
      return { success: true };
    } catch (e: any) {
      throw new Error("DB Error");
}
}
}