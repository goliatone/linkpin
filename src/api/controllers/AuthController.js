/*global Post, User, Category, Tag*/

/**
 * BackEndEndController
 *
 * @description :: Server-side logic for managing the back end
 */
var Promise  = require('bluebird');

module.exports = {
    login: function (req, res) {
        if (req.method === 'POST') {

            User.findOne({email: req.body.email}).exec(function (error, user) {
                if (error || !user) {
                    return res.redirect('/');
                }

                console.log('user', user);

                user.matchesPassword(req.body.password, function(err, match){
                    if(err || !match) return res.redirect('/');
                    req.session.authenticated = {
                        id: user.id,
                        name: user.name,
                        gravatarUrl: user.gravatarUrl
                    };
                    req.session.user = user;

                    res.redirect('/site');
                });
            });
        } else {
            res.render('splash/index');
        }
    },
    signup: function (req, res) {

        if (req.isGet) {
            res.view('admin/login', {
                // layout: null
            });
        } else if (req.isPost) {

            User.create(req.body).exec(function (error, user) {

                req.session.authenticated = {
                        id: user.id,
                        name: user.name,
                        gravatarUrl: user.gravatarUrl
                    };
                req.session.user = user;
                
                res.redirect('/site');
            });
        }
    },
    logout: function (req, res) {
        req.session.authenticated = false;
        res.redirect('/');
    },
};
