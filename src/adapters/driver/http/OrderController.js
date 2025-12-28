class OrderController {
    constructor(createOrderUseCase, startOrderPreparationUseCase, finishOrderPreparationUseCase){
        this.createOrderUseCase = createOrderUseCase
        this.startOrderPreparationUseCase = startOrderPreparationUseCase
        this.finishOrderPreparationUseCase = finishOrderPreparationUseCase
    }

    async create(req,res) {
        const order = await this.createOrderUseCase.execute(req.body);
        res.status(201).json(order)
    }

    async startOrderPreparation(req,res) {
        const updateOrder = await this.startOrderPreparationUseCase.execute(req.body)
        if(updateOrder.err){
            return res.status(404).json({message: updateOrder.err})
        }
        res.status(201).json(updateOrder)
    }

    async finishOrderPreparation(req,res) {
        const updateOrder = await this.finishOrderPreparationUseCase.execute(req.body)
        res.status(201).json(updateOrder)
    }
}

module.exports = OrderController;