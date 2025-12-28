const amqp = require("amqplib");

let channel = null;

async function getRabbitChannel() {
  if (channel) return channel;

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log("🐰 RabbitMQ conectado com sucesso");

    return channel;
  } catch (error) {
    console.error("❌ Erro ao conectar no RabbitMQ:", error.message);
    return null;
  }
}

module.exports = { getRabbitChannel };
