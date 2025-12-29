const GetAllOrdersByStatusUseCase = require('../../../src/core/application/use-cases/GetAllOrdersByStatusUseCase');

describe('GetAllOrdersByStatusUseCase Unit Test', () => {
    let mockOrderRepository;
    let useCase;

    beforeEach(() => {
        mockOrderRepository = {
            findByStatus: jest.fn()
        };
        useCase = new GetAllOrdersByStatusUseCase(mockOrderRepository);
        jest.clearAllMocks();
    });

    it('should return a list of orders when orders exist for the given status', async () => {
        const fakeOrders = [
            { orderId: 'ORD-1', status: 'PENDING' },
            { orderId: 'ORD-2', status: 'PENDING' }
        ];

        mockOrderRepository.findByStatus.mockResolvedValue(fakeOrders);

        const result = await useCase.execute('PENDING');

        expect(mockOrderRepository.findByStatus).toHaveBeenCalledWith('PENDING');
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0].orderId).toBe('ORD-1');
    });

    it('should return error when repository returns null', async () => {
        mockOrderRepository.findByStatus.mockResolvedValue(null);

        const result = await useCase.execute('IN_PROGRESS');

        expect(result).toHaveProperty('err', 'Order not found');
    });

    it('should return error when repository returns an empty array', async () => {
        mockOrderRepository.findByStatus.mockResolvedValue(null);

        const result = await useCase.execute('DONE');

        expect(result).toHaveProperty('err', 'Order not found');
    });

    it('should throw an exception if repository fails', async () => {
        mockOrderRepository.findByStatus.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute('PENDING'))
            .rejects
            .toThrow('Database error');
    });
});