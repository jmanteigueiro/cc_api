const pteidlib = require('./pteidlib');

module.exports = function(app, db) {
  pteidlib(app, db);
  // Other route groups could go here, in the future
};