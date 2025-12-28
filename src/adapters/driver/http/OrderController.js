class OrderController {
    constructor(createOrderUseCase, startOrderPreparationUseCase, finishOrderPreparationUseCase, getAllOrdersByStatusUseCase) {
        this.createOrderUseCase = createOrderUseCase;
        this.startOrderPreparationUseCase = startOrderPreparationUseCase;
        this.finishOrderPreparationUseCase = finishOrderPreparationUseCase;
        this.getAllOrdersByStatusUseCase = getAllOrdersByStatusUseCase;
    }

    async create(req, res) {
        try {
            const order = await this.createOrderUseCase.execute(req.body);
            return res.status(201).json(order);
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            return res.status(400).json({ message: "Erro ao processar criação de pedido", details: error.message });
        }
    }

    async startOrderPreparation(req, res) {
        try {
            const updateOrder = await this.startOrderPreparationUseCase.execute(req.body);
            
            if (updateOrder && updateOrder.err) {
                return res.status(404).json({ message: updateOrder.err });
            }

            return res.status(200).json(updateOrder); // Use 200 para atualizações bem-sucedidas
        } catch (error) {
            console.error("Erro ao iniciar preparação:", error);
            return res.status(500).json({ message: "Erro interno ao iniciar preparação" });
        }
    }

    async finishOrderPreparation(req, res) {
        try {
            const updateOrder = await this.finishOrderPreparationUseCase.execute(req.body);
            
            if (updateOrder && updateOrder.err) {
                return res.status(404).json({ message: updateOrder.err });
            }

            return res.status(200).json(updateOrder);
        } catch (error) {
            console.error("Erro ao finalizar preparação:", error);
            return res.status(500).json({ message: "Erro interno ao finalizar preparação" });
        }
    }

    async getOrdersByStatus(req, res) {
        try {
            const { status } = req.params;
            const orders = await this.getAllOrdersByStatusUseCase.execute(status);
            return res.status(200).json(orders || []);
        } catch (error) {
            console.error("Erro ao buscar pedidos por status:", error);
            return res.status(500).json({ message: "Erro ao listar pedidos" });
        }
    }
}

module.exports = OrderController;