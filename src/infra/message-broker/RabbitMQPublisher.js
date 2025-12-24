const EventPublisher = require("../../core/application/ports/out/EventPublisher");

class RabbitMQPublisher extends EventPublisher {
  constructor(channel) {
    super();
    this.channel = channel;
    this.exchange = "orders.events";
  }

  async publish(event) {
    const realChannel = await this.channel(); 
    if (!realChannel) console.log("RabbitMQ Channel not available");

    const payload = Buffer.from(JSON.stringify(event));

    await realChannel.assertExchange(this.exchange, "topic", {
      durable: true,
    });

    realChannel.publish(this.exchange, event.eventName, payload);
    console.log(`[EVENT EMITTED] ${this.exchange} - ${event.eventName} - ${payload}`)
  }
}

module.exports = RabbitMQPublisher;
