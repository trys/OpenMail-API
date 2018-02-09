exports.up = function(knex, Promise) {
  knex.schema.hasTable('campaigns').then(exists => {
    if (!exists) {
      return knex.schema.createTable('campaigns', table => {
        table.increments('id').primary();
        table.string('subject');
        table.bigInteger('listId');
        table.string('htmlContent');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('campaigns', table => {
    table.increments('id').primary();
    table.string('subject');
    table.bigInteger('listId');
    table.string('htmlContent');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};
