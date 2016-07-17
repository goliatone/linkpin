/*global Post, User, Category, Tag*/

/**
 * BackEndEndController
 *
 * @description :: Server-side logic for managing the back end
 */
var Promise  = require('bluebird');

module.exports = {
    getToken: function(req, res){
        //TODO: this should be handled by basicAuth, here just return token.

        User.findOne({email: req.body.email}).populate('tokens').exec(function (error, user) {
            if (error || !user) return res.forbidden();

            console.log('user', user);

            user.matchesPassword(req.body.password, function(err, match){
                if(err || !match) return res.forbidden();
                var token = user.tokens[0];
                //TODO: this is just to get it working for now...
                if(!token) return res.forbidden();
                return res.jsonx({token: token.accessToken});
            });
        });
    },
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

                    if (req.wantsJSON) {
                        return res.jsonx({token: user.tokens});
                    }

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
