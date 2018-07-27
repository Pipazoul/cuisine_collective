'use strict';

// Used to disable some boot script (like ACL)
global.MIGRATING = true;

const path = require('path');
const async = require('async');
const fs = require('fs');

const fileUtils = require('./util/FileUtils');

// Require server.js
const app = require(path.resolve(__dirname, './server'));
// Migrate or update ?
let migrate = true;
// Time
let startTime = null;

/**
 * Read script execution arguments
 */
function readScriptArguments() {
  // First argument must be `migrate` or `update`
  if (process.argv[2] === 'migrate') {
    migrate = true;
    console.log('----- STARTING MIGRATION -----');
  } else if (process.argv[2] === 'update') {
    migrate = false;
    console.log('----- STARTING UPDATE -----');
  } else {
    console.log('First argument must be `migrate` or `update`');
    process.exit(1);
  }
  startTime = Date.now();
}

/**
 * Boot app
 *
 * @param {function} cb
 */
function bootApp(cb) {
  app.boot(function(err) {
    if (err) {
      return cb(err, null);
    }
    return cb(null, null);
  });
}

/**
 * Run an sql script located in the config.json sqlScript.directory
 *
 * @param {string} filename
 * @param {function} cb
 */
function executeSqlScript(filename, cb) {
  // Path for sql scripts
  const sqlPath = path.join(__dirname, app.get('sqlScripts').directory);
  // Compute script path
  const scriptPath = path.format({
    dir: sqlPath,
    name: filename,
    ext: '.sql',
  });
  // Read script file
  const script = fs.readFileSync(scriptPath, 'utf8');
  // Execute script
  app.datasources.db.connector.execute(script, function(err) {
    if (err) {
      console.error('Error while executing script `%s`: %j', scriptPath, err);
      process.exit(1);
      return cb(err, null);
    }
    return cb(null, null);
  });
}

/**
 * Run a sql query on the schema defined in datasources.json file
 *
 * @param {string} query
 * @param {function} cb
 */
function executeQuery(query, cb) {
  const schema = app.datasources.db.settings.schema;
  app.datasources.db.connector.execute(query, [schema], function(err) {
    if (err) {
      console.error('Error while executing query `%s` on schema `%s`: %j', query, schema, err);
      process.exit(1);
      return cb(err, null);
    }
    return cb(null, null);
  });
}

/**
 * Drop database's foreign keys
 *
 * @param {function} cb
 */
function dropForeignKeys(cb) {
  const start = Date.now();
  console.log('Dropping foreign keys...');
  async.series([
    (cb) => executeSqlScript(app.get('sqlScripts').foreignKeysClean, cb),
    (cb) => executeQuery('SELECT pg_temp.drop_foreign_keys($1)', cb),
  ], (err, res) => {
    console.log('Foreign keys dropped in %d sec', (Date.now() - start) / 1000);
    return cb(null, null);
  });
}

/**
 * Create database's foreign keys
 *
 * @param {function} cb
 */
function createForeignKeys(cb) {
  const start = Date.now();
  console.log('Creating foreign keys...');
  async.series([
    (cb) => executeSqlScript(app.get('sqlScripts').foreignKeysGenerate, cb),
    (cb) => executeQuery('SELECT pg_temp.create_foreign_keys($1)', cb),
  ], (err, res) => {
    console.log('Foreign keys created in %d sec', (Date.now() - start) / 1000);
    return cb(null, null);
  });
}

/**
 * Create SQL functions
 *
 * @param {function} cb
 */
function createFunctions(cb) {
  const start = Date.now();
  console.log('Creating functions...');
  async.series([
    (cb) => executeSqlScript(app.get('sqlScripts').functionsGenerate, cb),
    (cb) => executeQuery('SELECT pg_temp.unaccent_string($1)', cb),
  ], (err, res) => {
    console.log('Functions created in %d sec', (Date.now() - start) / 1000);
    return cb(null, null);
  });
}

/**
 * Remove all tables and re-create them
 *
 * @param {function} cb
 */
function initDatabase(cb) {
  const start = Date.now();
  console.log('Building database...');
  app.datasources.db[migrate ? 'automigrate' : 'autoupdate'](function(err) {
    if (err) {
      console.error('Error while initializing database: %j', err);
      process.exit(1);
      return cb(err, null);
    }
    console.log('Database built in %d sec', (Date.now() - start) / 1000);
    return cb(null, null);
  });
}

/**
 * Insert data in all tables
 *
 * @param {function} cb
 */
function insertData(cb) {
  const start = Date.now();
  // Path for data scripts
  const scriptsPath = path.join(__dirname, app.get('scriptsDirectory'));
  console.log('Inserting data from files located in `%s`', scriptsPath);
  // Load files
  const scripts = fileUtils.loadFolder(scriptsPath);
  async.mapSeries(scripts, (script, cb) => {
    // For each file, require it and call 'generate' method
    const file = require(script.filepath);
    file.generate(app).then((res) => {
      cb(null, res);
    }).catch((err) => cb(`Error while inserting data from '${script.filename}': ${err}`, null));
  }, function(err, results) {
    if (err) {
      console.error(err);
      process.exit(1);
      return cb(err, null);
    }
    console.log('Data inserted in %d sec', (Date.now() - start) / 1000);
    return cb(null, null);
  });
}

/**
 * Skip data insertion
 *
 * @param {function} cb
 */
function insertNothing(cb) {
  console.warn('Skiping data insertion');
  return cb(null, null);
}

/**
 * Operate database update/migration
 */
function auto() {
  readScriptArguments();
  async.series([
    bootApp,
    dropForeignKeys,
    initDatabase,
    createFunctions,
    createForeignKeys,
    (cb) => migrate ? insertData(cb) : insertNothing(cb),
  ], function(err, results) {
    if (err) {
      console.error('Error during script execution: %j', err);
      process.exit(1);
    }
    app.datasources.db.disconnect();
    console.log('----- FINISHED (%d sec) -----', (Date.now() - startTime) / 1000);
    process.exit(0);
  });
}

auto();
