
class GetAllOrdersByStatusUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(status){
    const order = await this.orderRepository.findByStatus(status)

    if(!order){
        return {err: "Order not found"}
    }

    return order;
  }
}

module.exports = GetAllOrdersByStatusUseCase
