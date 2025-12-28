const OrderStatusUpdatedEvent = require("../../../domain/events/OrderStatusUpdatedEvent");

class StartOrderPreparationUseCase {
  constructor(orderRepository, eventPublisher) {
    this.orderRepository = orderRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute({orderId}){
    const order = await this.orderRepository.findByOrderId(orderId)

    if(!order){
        return {err: "Order not found"}
    }

    order.startPreparation();

    await this.orderRepository.update(order);

    const event = new OrderStatusUpdatedEvent({
        orderId: order.orderId,
        status: order.status
    })

    await this.eventPublisher.publish(event)

    return order;
  }
}

module.exports = StartOrderPreparationUseCase
