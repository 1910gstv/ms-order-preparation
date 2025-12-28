class OrderStatusUpdatedEvent {    
    eventName = 'order.preparation.updated'
    
    constructor({orderId, status, occuredAt}) {
        this.orderId = orderId
        this.status = status
        this.occuredAt = occuredAt || new Date()
    }
}

module.exports = OrderStatusUpdatedEvent