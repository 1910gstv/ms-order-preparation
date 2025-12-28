const { PreparationStatus } = require("../enums/PreparationStatus");

class PreparationOrder {
  constructor({ orderId, items = [], status, startedAt, finishedAt }) {

    if(!orderId) throw new Error('orderId is required!')

    this.orderId = orderId;
    this.status = status ?? PreparationStatus.PENDING
    this.startedAt = startedAt ?? null
    this.finishedAt = finishedAt ?? null
  }

  startPreparation() {
    if (this.status !== PreparationStatus.PENDING) {
      return "Order is not in pending";
    }

    this.status = PreparationStatus.IN_PROGRESS;
    this.startedAt = new Date();
    return null
  }

  finishPreparation() {
    if (this.status !== PreparationStatus.IN_PROGRESS) {
      return "Order is not in preparation";
    }

    this.status = PreparationStatus.DONE;
    this.finishedAt = new Date();
    return null
  }
}

module.exports = PreparationOrder;
