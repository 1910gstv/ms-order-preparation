/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("orders", {
     id: 'id',

    order_id: {
      type: 'uuid',
      notNull: true,
      unique: true
    },

    status: {
      type: 'varchar(30)',
      notNull: true
    },

    started_at: {
      type: 'timestamptz',
      notNull: false
    },

    finished_at: {
      type: 'timestamptz',
      notNull: false
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("orders");
};
