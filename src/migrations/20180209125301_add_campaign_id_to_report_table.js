exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('reports', table => {
      table.integer('campaignId').unsigned();
      table
        .foreign('campaignId')
        .references('id')
        .inTable('campaigns');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('reports', table => {
      table.dropForeign('campaignId');
      table.dropColumn('campaignId');
    }),
  ]);
};
