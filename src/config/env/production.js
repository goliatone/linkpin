/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var host = process.env.NODE_ENV_MONGO_HOST || 'mongo',
    port = process.env.NODE_ENV_MONGO_PORT || 27017;

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'dockerMongo'
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 3030,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
    sockets: {
        adapter: 'redis',
        host: 'redis',
        port: 6379,
        db: 'sails'
    },
    session: {
        adapter: 'redis',
        host: process.env.NODE_ENV_REDIS_HOST,
        port: process.env.NODE_ENV_REDIS_PORT,
    },
};
