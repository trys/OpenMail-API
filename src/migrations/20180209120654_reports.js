exports.up = function(knex, Promise) {
  knex.schema.hasTable('reports').then(exists => {
    if (!exists) {
      return knex.schema.createTable('reports', table => {
        table.increments('id').primary();
        table.string('status');
        table.string('opens');
        table.string('deliveries');
        table.string('rejects');
        table.string('bounces');
        table.string('complaints');
        table.string('clicks');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('reports', table => {
    table.increments('id').primary();
    table.string('status');
    table.string('opens');
    table.string('deliveries');
    table.string('rejects');
    table.string('bounces');
    table.string('complaints');
    table.string('clicks');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};
