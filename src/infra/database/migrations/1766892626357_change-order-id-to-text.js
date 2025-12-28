/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.alterColumn("orders", "order_id", {
    type: 'varchar(255)',
    // O Postgres precisa converter o UUID antigo para string
    using: 'order_id::varchar(255)' 
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.alterColumn("orders", "order_id", {
    type: 'uuid',
    using: 'order_id::uuid'
  });
};