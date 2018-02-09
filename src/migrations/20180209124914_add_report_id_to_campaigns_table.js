exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('campaigns', table => {
      table.integer('reportId').unsigned();
      table
        .foreign('reportId')
        .references('id')
        .inTable('reports');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('campaigns', table => {
      table.dropForeign('repportId');
      table.dropColumn('reportId');
    }),
  ]);
};
