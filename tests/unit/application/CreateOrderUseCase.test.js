const CreateOrderService = require("../../../src/core/application/use-cases/CreateOrderService");
const Order = require("../../../src/domain/entities/PreparationOrder");

describe('CreateOrderService Unit Test', () => {
  let mockOrderRepository;
  let createOrderService;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn().mockResolvedValue(true)
    };
    createOrderService = new CreateOrderService(mockOrderRepository);
    jest.clearAllMocks();
  });

  it('deve criar um pedido com orderId e status fornecidos', async () => {
    const input = { orderId: 'PEDIDO-123', status: 'IN_PROGRESS' };

    const result = await createOrderService.execute(input);

    expect(mockOrderRepository.save).toHaveBeenCalled();
    expect(result.orderId).toBe('PEDIDO-123');
    expect(result.status).toBe('IN_PROGRESS');
  });

  it('deve definir status PENDING como padrão se nenhum for fornecido', async () => {
    const input = { orderId: 'UUID-GERADO' };
    const result = await createOrderService.execute(input);

    expect(result.status).toBe('PENDING');
  });

  it('deve gerar um UUID automaticamente se orderId não for fornecido', async () => {
    const result = await createOrderService.execute({ status: 'PENDING' });

    expect(result.orderId).toBeDefined();
    expect(result.orderId.length).toBeGreaterThan(10); 
  });

  it('deve funcionar corretamente mesmo sem passar argumentos', async () => {
    const result = await createOrderService.execute();

    expect(result.orderId).toBeDefined();
    expect(result.status).toBe('PENDING');
  });

  it('deve lançar erro se o repositório falhar', async () => {
    mockOrderRepository.save.mockRejectedValue(new Error('Erro de Banco de Dados'));

    await expect(createOrderService.execute({}))
      .rejects
      .toThrow('Erro de Banco de Dados');
  });
});