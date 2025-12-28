const amqp = require('amqplib')

async function createRabbitChannel(){
    const connection = await amqp.connect(process.env.RABBITMQ_URL)
    const channel = await connection.createChannel()
    return channel
}

module.exports = createRabbitChannel