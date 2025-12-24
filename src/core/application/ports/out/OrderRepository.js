 class OrderRepository{
    async save(order){}
    async update(orderId, status){}
    async findByOrderId(orderId){ /* document why this async method 'findByOrderId' is empty */ }
}

module.exports = OrderRepository