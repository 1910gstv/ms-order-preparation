const OrderRepository = require("../../../../core/application/ports/out/OrderRepository");
const PreparationOrder = require("../../../../domain/entities/PreparationOrder");

class OrderRepositoryMySQL extends OrderRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(order) {
    const query = `
            INSERT INTO orders (
                order_id,
                status,
                started_at,
                finished_at
            ) VALUES ($1, $2, $3, $4)
        `;

    const result = await this.pool.query(query, [
      order.orderId,
      order.status,
      order.startedAt,
      order.finishedAt,
    ]);

    return result;
  }

  async update(order) {
    const query = `
            UPDATE orders 
            SET
                status = $1,
                started_at = $2,
                finished_at = $3
            WHERE order_id = $4

        `;

    const result = await this.pool.query(query, [
      order.status,
      order.startedAt,
      order.finishedAt,
      order.orderId,
    ]);

    return result.rowCount;
  }

  async findByOrderId(orderId) {
    const query = `
        SELECT *
        FROM orders
        WHERE order_id = $1
    `;

    const { rows } = await this.pool.query(query, [orderId]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return new PreparationOrder({
      orderId: row.order_id,
      status: row.status,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
    });
  }

  async findByStatus(status) {
    
    const query = `
        select *
        from orders
        where status ilike $1
    `;
    
    const { rows } = await this.pool.query(query, [status]);
    console.log(rows)

    if (rows.length === 0) {
      return [];
    }

    return rows.map(row => {
      return new PreparationOrder({
        orderId: row.order_id,
        status: row.status,
        startedAt: row.started_at,
        finishedAt: row.finished_at,
      });
    });
  }
}

module.exports = OrderRepositoryMySQL;
