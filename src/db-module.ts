const pgPromise = require('pg-promise');
const R         = require('ramda');

// Limit the amount of debugging of SQL expressions
const trimLogsSize : number = 200;

// Database interface
interface DBOptions
  { host      : string
  , database  : string
  , user?     : string
  , password? : string
  , port?     : number
  };

// Actual database options
const options : DBOptions = {
  user: "",
  password: "",
  host: 'localhost',
  database: 'lovelystay_test',
};

console.info('Connecting to the database:',
  `${options.user}@${options.host}:${options.port}/${options.database}`);

const pgpDefaultConfig = {
  promiseLib: require('bluebird'),
  // Log all querys
  query(query) {
    console.log('[SQL   ]', R.take(trimLogsSize,query.query));
  },
  /* On error, please show me the SQL, and the error message
     Must be catched by the promise caller
  */
  error(err, e) {
    if (e.query) {
      console.error('[SQL   ]', R.take(trimLogsSize,e.query),err.message+"\n");
    }
  }
};

const pgp = pgPromise(pgpDefaultConfig);
const db = pgp(options);

export {db}