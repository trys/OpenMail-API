exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('subscribers').then(exists => {
      if (!exists) {
        return knex.schema.createTable('subscribers', table => {
          table.increments('id').primary();
          table.string('firstName');
          table.string('lastName');
          table.string('emailAddress');
          table.unique('emailAddress');
          table.timestamp('createdAt').defaultTo(knex.fn.now());
        });
      }
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('subscribers', table => {
      table.increments('id').primary();
      table.string('firstName');
      table.string('lastName');
      table.string('emailAddress');
      table.unique('emailAddress');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    }),
  ]);
};
