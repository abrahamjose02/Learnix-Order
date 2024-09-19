import { OrderRepository } from "../repository/order.repository";
import { OrderService } from "../service/order.service";
import { OrderController } from "../controller/order.controller";
import rabbitClient from "./client";

const orderRepository = new OrderRepository();
const service = new OrderService(orderRepository);
const controller = new OrderController(service);

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log("The operation is", operation, data);

    switch (operation) {
      case "stripe-publishkey":
        response = await controller.sendPublishKey.bind(controller)();
        break;

      case "payment-intent":
        response = await controller.newPayment.bind(controller)(data);
        break;

      case "create-order":
        response = await controller.createOrder.bind(controller)(data);
        break;

      case "order-analytics":
        response = await controller.getOrderAnalytics.bind(controller)(data.instructorId);
        break;

      case "revenue-analytics":
        response = await controller.getRevenueAnalytics.bind(controller)(data.instructorId ||null);
        break;

      case "instructor-revenue-analytics":
        response = await controller.getTotalInstructorRevenueByCourse.bind(controller)(data.courseId);
        break;

      default:
        response = "Request-key not found";
        break;
    }

    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}