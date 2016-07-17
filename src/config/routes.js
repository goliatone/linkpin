/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  //API... TODO: add api...
  'POST /describe': 'SiteController.describe',
  'POST /create': 'SiteController.create',

  'POST /api/describe': 'SiteController.describe',
  'POST /api/create': 'SiteController.create',
  'POST /api/note' : 'SiteController.noteAdd',
  'POST /api/token' : 'AuthController.getToken',
  'POST /api/link/check' : 'SiteController.owns',

  'GET /' : 'SplashController.index',

  //move up to views
  'GET /site/link/:id' : 'SiteController.linkView',
  'POST /site/link/:id' : 'SiteController.linkEdit',


  'GET /site/tag/:label' : 'SiteController.tags',
  'GET /site' : 'SiteController.index',
  'GET /site/search' : 'SiteController.search',

  'GET /site/seed' : 'SiteController.seed',
  'GET /site/describe' : 'SiteController.describe',

  'GET /admin/login' : 'AuthController.login',
  'POST /admin/login' : 'AuthController.login',
  'GET /admin/logout' : 'AuthController.logout',
  'GET /admin/signup' : 'AuthController.signup',
  'POST /admin/signup' : 'AuthController.signup',
};
