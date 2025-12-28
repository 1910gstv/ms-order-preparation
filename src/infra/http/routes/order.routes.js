const express = require("express");

const CreateOrderUseCase = require("../../../core/application/use-cases/CreateOrderService");
const OrderController = require("../../../adapters/driver/http/OrderController");
const PostgresOrderRepository = require("../../../adapters/driven/database/out/OrderRepositoryPostgres");
const { Pool } = require("pg");
const RabbitMQPublisher = require("../../message-broker/RabbitMQPublisher");
const { getRabbitChannel } = require("../../message-broker/rabbitmqConnection");
const StartOrderPreparationUseCase = require("../../../core/application/use-cases/StartOrderPreparationUseCase");
const FinishOrderPreparationUseCase = require("../../../core/application/use-cases/FinishOrderPreparationUseCase");
const GetAllOrdersByStatusUseCase = require("../../../core/application/use-cases/GetAllOrdersByStatusUseCase");

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
  const startOrderPreparationUseCase = new StartOrderPreparationUseCase(orderRepository, eventPublisher);
  const finishOrderPreparationUseCase = new FinishOrderPreparationUseCase(orderRepository, eventPublisher);
  const getAllOrdersByStatusUseCase = new GetAllOrdersByStatusUseCase(orderRepository)

  // 🎮 Controller (application)
  const orderController = new OrderController(createOrderUseCase,startOrderPreparationUseCase,finishOrderPreparationUseCase,getAllOrdersByStatusUseCase);

  // 📡 Endpoint HTTP
  router.post("/", (req, res) => {
    orderController.create(req, res);
  });

  router.post("/start", (req, res) => {
    orderController.startOrderPreparation(req, res);
  });
  router.post("/finish", (req, res) => {
    orderController.finishOrderPreparation(req, res);
  });

  router.get("/get/status/:status",(req,res) => {
    orderController.getOrdersByStatus(req,res)
  })

  return router;
};
