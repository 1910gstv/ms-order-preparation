const PreparationOrder = require('../../../src/domain/entities/PreparationOrder');
const { PreparationStatus } = require('../../../src/domain/enums/PreparationStatus');

describe('PreparationOrder Entity', () => {

  it('should throw an error if orderId is not provided', () => {
    expect(() => {
      new PreparationOrder({ status: PreparationStatus.PENDING });
    }).toThrow('orderId is required!');
  });

  it('should create an order with default values', () => {
    const order = new PreparationOrder({ orderId: '123' });

    expect(order.orderId).toBe('123');
    expect(order.status).toBe(PreparationStatus.PENDING);
    expect(order.startedAt).toBeNull();
    expect(order.finishedAt).toBeNull();
  });

  it('should start preparation successfully when status is PENDING', () => {
    const order = new PreparationOrder({ 
      orderId: '123', 
      status: PreparationStatus.PENDING 
    });

    const result = order.startPreparation();

    expect(result).toBeNull();
    expect(order.status).toBe(PreparationStatus.IN_PROGRESS);
    expect(order.startedAt).toBeInstanceOf(Date);
  });

  it('should return error when starting preparation and status is not PENDING', () => {
    const order = new PreparationOrder({ 
      orderId: '123', 
      status: PreparationStatus.IN_PROGRESS 
    });

    const result = order.startPreparation();

    expect(result).toBe("Order is not in pending");
    expect(order.status).toBe(PreparationStatus.IN_PROGRESS);
  });

  it('should finish preparation successfully when status is IN_PROGRESS', () => {
    const order = new PreparationOrder({ 
      orderId: '123', 
      status: PreparationStatus.IN_PROGRESS 
    });

    const result = order.finishPreparation();

    expect(result).toBeNull();
    expect(order.status).toBe(PreparationStatus.DONE);
    expect(order.finishedAt).toBeInstanceOf(Date);
  });

  it('should return error when finishing preparation and status is not IN_PROGRESS', () => {
    const order = new PreparationOrder({ 
      orderId: '123', 
      status: PreparationStatus.PENDING 
    });

    const result = order.finishPreparation();

    expect(result).toBe("Order is not in preparation");
    expect(order.status).toBe(PreparationStatus.PENDING);
  });

  it('should preserve provided dates in constructor', () => {
    const startedAt = new Date('2023-01-01');
    const finishedAt = new Date('2023-01-02');
    
    const order = new PreparationOrder({ 
      orderId: '123', 
      status: PreparationStatus.DONE,
      startedAt,
      finishedAt
    });

    expect(order.startedAt).toEqual(startedAt);
    expect(order.finishedAt).toEqual(finishedAt);
  });

});