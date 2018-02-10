exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('subscribers', table => {
      table.integer('listId').unsigned();
      table
        .foreign('listId')
        .references('id')
        .inTable('lists');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('subscribers', table => {
      table.dropForeign('listId');
      table.dropColumn('listId');
    }),
  ]);
};
