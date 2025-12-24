const { PreparationStatus } = require("../enums/PreparationStatus");

class PreparationOrder {
  constructor({ orderId, items = [], status, startedAt, finishedAt }) {

    if(!orderId) throw new Error('orderId is required!')
    // if (!items || items.length === 0) {
    //     throw new Error('items are required.')
    // }

    this.orderId = orderId;
    this.items = items;
    this.status = status ?? PreparationStatus.PENDING
    this.startedAt = startedAt ?? null
    this.finishedAt = finishedAt ?? null
  }

  startPreparation() {
    if (this.status !== PreparationStatus.PENDING) {
      console.log("Order is not in pending");
    }

    this.status = PreparationStatus.IN_PROGRESS;
    this.startedAt = new Date();
  }

  finishPreparation() {
    if (this.status !== PreparationStatus.IN_PROGRESS) {
      console.log("Order is not in preparation");
    }

    this.status = PreparationStatus.DONE;
    this.finishedAt = new Date();
  }
}

module.exports = PreparationOrder;
