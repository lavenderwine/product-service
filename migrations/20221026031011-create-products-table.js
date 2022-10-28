'use strict';
const { dataType } = require('db-migrate-shared');
var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('products', {
    columns: {
      id: { type: dataType.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: dataType.STRING, length: 200, notNull: true },
      price: { type: dataType.DECIMAL },
      description: { type: dataType.TEXT },
      imageUrl: { type: dataType.STRING },
      created_at: { type: dataType.TIMESTAMP, notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
      updated_at: { type: dataType.TIMESTAMP, notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
      deleted_at: { type: dataType.TIMESTAMP }
    },
    ifNotExists: true
  });
};

exports.down = function (db) {
  return db.dropTable('products', { ifNotExists: true });
};

exports._meta = {
  "version": 1
};
