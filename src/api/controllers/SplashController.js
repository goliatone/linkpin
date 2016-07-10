/**
 * SplashController
 *
 * @description :: Server-side logic for managing splashes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){
        res.render('splash/index', {
			title: 'LinkPin'
		});
    },
};
