const OrderStatusUpdatedEvent = require('../../../domain/events/OrderStatusUpdatedEvent')

class UpdateOrderStatus {
  constructor(orderRepository, eventPublisher) {
    this.orderRepository = orderRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute({ orderId, status }) {
    const order = await this.orderRepository.findByOrderId(orderId)

    if(!order){}

    switch(status) {
        case 'START': 
            order.startPreparation()
            break
        
        case 'FINISH':
            order.finishPreparation()
            break

        default:
            console.log('Invalid Action')
    }

    await this.orderRepository.update(order);

    const event = new OrderStatusUpdatedEvent({
        orderId: order.orderId,
        status: order.status
    })

    await this.eventPublisher.publish(event)

    return order;

  }
}

module.exports = UpdateOrderStatus;
