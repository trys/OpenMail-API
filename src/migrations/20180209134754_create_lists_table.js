exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('lists').then(exists => {
      if (!exists) {
        return knex.schema.createTable('lists', table => {
          table.increments('id').primary();
          table.string('listName');
          table.string('subscriberCount');
        });
      }
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('lists', table => {
      table.increments('id').primary();
      table.string('listName');
      table.string('subscriberCount');
    }),
  ]);
};
