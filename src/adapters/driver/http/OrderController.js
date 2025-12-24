class OrderController {
    constructor(createOrderUseCase, updateOrderStatus){
        this.createOrderUseCase = createOrderUseCase
        this.updateOrderStatus = updateOrderStatus
    }

    async create(req,res) {
        const order = await this.createOrderUseCase.execute(req.body);
        res.status(201).json(order)
    }

    async updateOrder(req,res) {
        const updateOrder = await this.updateOrderStatus.execute(req.body)
        res.status(201).json(updateOrder)
    }
}

module.exports = OrderController;