exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('configuration').then(exists => {
      if (!exists) {
        return knex.schema.createTable('configuration', table => {
          table.increments('id').primary();
          table.string('configKey');
          table.unique('configKey');
          table.string('configValue');
        });
      }
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('configuration', table => {
      table.increments('id').primary();
      table.string('configKey');
      table.unique('configKey');
      table.string('configValue');
    }),
  ]);
};
