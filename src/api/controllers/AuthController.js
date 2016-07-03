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
                    return res.redirect('/admin/login');
                }

                console.log('user', user);

                user.matchesPassword(req.body.password, function(err, match){
                    if(err || !match) return res.redirect('/admin/login');
                    req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
                    req.session.authenticated = {
                        id: user.id,
                        name: user.name
                    };

                    res.redirect('/site');
                });
            });
        } else {
            res.view('admin/login', {
                layout: 'layout'
            });
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
                        name: user.name
                    };

                res.redirect('/site');
            });
        }
    },
    logout: function (req, res) {

        req.session.authenticated = false;
        res.redirect('/admin/login');
    },
};
