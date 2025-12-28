const Order = require("../../../domain/entities/PreparationOrder");

class CreateOrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute({ orderId, status }={}) {
    let finalOrderId = orderId || crypto.randomUUID()
    const order = new Order({ orderId: finalOrderId, status: status || 'PENDING' });

    await this.orderRepository.save(order);

    return order;
  }
}

module.exports = CreateOrderService;
