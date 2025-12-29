const StartOrderPreparationUseCase = require('../../../src/core/application/use-cases/StartOrderPreparationUseCase');
const OrderStatusUpdatedEvent = require("../../../src/domain/events/OrderStatusUpdatedEvent");

describe('StartOrderPreparationUseCase Unit Test', () => {
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

        useCase = new StartOrderPreparationUseCase(mockOrderRepository, mockEventPublisher);
        jest.clearAllMocks();
    });

    it('must initiate an order preparation successfully', async () => {
        const fakeOrder = {
            orderId: 'TEST1234',
            status: 'PENDING',
            startPreparation: jest.fn().mockReturnValue(null), 
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);
        mockOrderRepository.update.mockResolvedValue(true);

        const result = await useCase.execute({ orderId: 'TEST1234' });

        expect(mockOrderRepository.findByOrderId).toHaveBeenCalledWith('TEST1234');
        expect(fakeOrder.startPreparation).toHaveBeenCalled();
        expect(mockOrderRepository.update).toHaveBeenCalledWith(fakeOrder);
        expect(mockEventPublisher.publish).toHaveBeenCalledWith(expect.any(OrderStatusUpdatedEvent));
        expect(result).not.toHaveProperty('err');
    });

    it('should return error when order does not exist', async () => {
        mockOrderRepository.findByOrderId.mockResolvedValue(null);

        const result = await useCase.execute({ orderId: 'NON_EXISTENT' });

        expect(result).toHaveProperty('err', "Order not found");
        expect(mockOrderRepository.update).not.toHaveBeenCalled();
        expect(mockEventPublisher.publish).not.toHaveBeenCalled();
    });

    it('should return error when order status is not in pending', async () => {
        const fakeOrder = {
            orderId: 'TEST1234',
            status: 'IN_PROGRESS',
            startPreparation: jest.fn().mockReturnValue("Order is already in preparation"),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);

        const result = await useCase.execute({ orderId: 'TEST1234' });

        expect(fakeOrder.startPreparation).toHaveBeenCalled();
        expect(mockOrderRepository.update).not.toHaveBeenCalled();
        expect(mockEventPublisher.publish).not.toHaveBeenCalled();
        expect(result).toHaveProperty('err', "Order is already in preparation");
    });

    it('should throw an exception if repository update fails', async () => {
        const fakeOrder = {
            orderId: 'TEST1234',
            status: 'PENDING',
            startPreparation: jest.fn().mockReturnValue(null),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);
        mockOrderRepository.update.mockRejectedValue(new Error("Database connection fail"));

        await expect(useCase.execute({ orderId: 'TEST1234' }))
            .rejects
            .toThrow("Database connection fail");

        expect(mockEventPublisher.publish).not.toHaveBeenCalled();
    });

    it('should throw an exception if event publisher fails', async () => {
        const fakeOrder = {
            orderId: 'TEST1234',
            status: 'PENDING',
            startPreparation: jest.fn().mockReturnValue(null),
        };

        mockOrderRepository.findByOrderId.mockResolvedValue(fakeOrder);
        mockEventPublisher.publish.mockRejectedValue(new Error("Message broker is down"));

        await expect(useCase.execute({ orderId: 'TEST1234' }))
            .rejects
            .toThrow("Message broker is down");
            
    });
});