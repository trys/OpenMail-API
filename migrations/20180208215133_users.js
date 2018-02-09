exports.up = function(knex, Promise) {
  knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('emailAddress');
        table.string('password');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users', table => {
    table.increments('id').primary();
    table.string('emailAddress');
    table.string('password');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};
