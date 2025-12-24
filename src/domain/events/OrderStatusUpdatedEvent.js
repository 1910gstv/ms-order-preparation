class OrderStatusUpdatedEvent {
    constructor({orderId, status, occuredAt}) {
        this.eventName = 'order.preparation.updated'
        this.orderId = orderId
        this.status = status
        this.occuredAt = occuredAt || new Date()
    }
}

module.exports = OrderStatusUpdatedEvent