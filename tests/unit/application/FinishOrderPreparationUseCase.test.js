const FinishOrderPreparationUseCase = require('../../../src/core/application/use-cases/FinishOrderPreparationUseCase');
const OrderStatusUpdatedEvent = require("../../../src/domain/events/OrderStatusUpdatedEvent");

describe('FinishOrderPreparationUseCase Unit Test', () => {
    let mockOrderRepository;
    let mockEventPublisher;
    let useCase;

    beforeEach(() => {
        mockOrderRepository = {
            findByOrderId: jest.fn(),
            update: jest.fn()
        };
        mockEventPublisher = {
            publish: jest.fn()
        };
        useCase = new FinishOrderPreparationUseCase(mockOrderRepository, mockEventPublisher);
        
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    it('should finish order preparation successfully', async () => {
        const fakeOrder = {
            orderId: 'ORDER-789',
            status: 'IN_PROGRESS',
            finishPreparation: jest.fn().mockReturnValue(null),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);

        const result = await useCase.execute({ orderId: 'ORDER-789' });

        expect(fakeOrder.finishPreparation).toHaveBeenCalled();
        expect(mockOrderRepository.update).toHaveBeenCalledWith(fakeOrder);
        expect(mockEventPublisher.publish).toHaveBeenCalledWith(expect.any(OrderStatusUpdatedEvent));
        expect(result).not.toHaveProperty('err');
    });

    it('should return error when order is not found', async () => {
        mockOrderRepository.findByOrderId.mockResolvedValue(null);

        const result = await useCase.execute({ orderId: 'UNKNOWN' });

        expect(result).toHaveProperty('err', 'Order not found');
        expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });

    it('should return error when order cannot be finished (e.g., status is PENDING)', async () => {
        const fakeOrder = {
            orderId: 'ORDER-789',
            status: 'PENDING',
            finishPreparation: jest.fn().mockReturnValue('Order is not in preparation'),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);

        const result = await useCase.execute({ orderId: 'ORDER-789' });

        expect(result).toHaveProperty('err', 'Order is not in preparation');
        expect(mockOrderRepository.update).not.toHaveBeenCalled();
        expect(mockEventPublisher.publish).not.toHaveBeenCalled();
    });

    it('should propagate error when repository update fails', async () => {
        const fakeOrder = {
            orderId: 'ORDER-789',
            status: 'IN_PROGRESS',
            finishPreparation: jest.fn().mockReturnValue(null),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);
        mockOrderRepository.update.mockRejectedValue(new Error('Database offline'));

        await expect(useCase.execute({ orderId: 'ORDER-789' }))
            .rejects
            .toThrow('Database offline');
    });

    it('should publish event with correct status after finishing', async () => {
        const fakeOrder = {
            orderId: 'ORDER-789',
            status: 'DONE', 
            finishPreparation: jest.fn().mockReturnValue(null),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);

        await useCase.execute({ orderId: 'ORDER-789' });

        const publishedEvent = mockEventPublisher.publish.mock.calls[0][0];
        expect(publishedEvent.status).toBe('DONE');
        expect(publishedEvent.orderId).toBe('ORDER-789');
    });
});