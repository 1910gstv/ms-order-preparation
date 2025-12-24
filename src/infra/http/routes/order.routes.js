const express = require("express");

const CreateOrderUseCase = require("../../../core/application/use-cases/CreateOrderService");
const UpdateOrderStatus = require("../../../core/application/use-cases/UpdateOrderStatus")
const OrderController = require("../../../adapters/driver/http/OrderController");
const PostgresOrderRepository = require("../../../adapters/driven/database/out/OrderRepositoryPostgres");
const { Pool } = require("pg");
const RabbitMQPublisher = require("../../message-broker/RabbitMQPublisher");
// const createRabbitChannel = require("../../config/rabbitmq");
const { getRabbitChannel } = require("../../message-broker/rabbitmqConnection");

module.exports = () => {
  const router = express.Router();

  // 🔌 Infra (detalhes técnicos)
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  const eventPublisher = new RabbitMQPublisher(getRabbitChannel);

  // 🔁 Adapter de saída
  const orderRepository = new PostgresOrderRepository(pool);

  // 🧠 Use case (core)
  const createOrderUseCase = new CreateOrderUseCase(orderRepository);
  const updateOrderStatus = new UpdateOrderStatus(orderRepository, eventPublisher);

  // 🎮 Controller (application)
  const orderController = new OrderController(createOrderUseCase,updateOrderStatus);

  // 📡 Endpoint HTTP
  router.post("/", (req, res) => {
    orderController.create(req, res);
  });

  router.patch("/update", (req, res) => {
    orderController.updateOrder(req, res);
  });

  return router;
};
