/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Token Bearer policy
 *
 */
module.exports = function(req, res, next) {
    var credential;

    if(req.headers && req.headers.authorization){
        var parts = req.headers.authorization.split(' ');

        if(parts.length === 2){
            var schema = parts[0],
                credentials = parts[1];
            if(/^Bearer$/i.test(schema)){
                credential = credentials;
            }
        } else {
            return res.badRequest({error:'Mal formed authorization header.'});
        }
    }

    if(req.body && req.body.access_token){
        console.log('Redefinining credential present in header with body.access_token');
        if(credential) return res.badRequest({error:'Mal formed authorization header.'});
        else credential = req.body.access_token;
    }

    if(req.query && req.query.access_token){
        console.log('Redefinining credential present in header with query.access_token');
        if(credential) return res.badRequest({error:'Mal formed authorization header.'});
        else credential = req.query.access_token;
    }

    //We are not trying to authenticate.
    if(!credential) return next();

    var self = this;
    sails.models.token.findOne({accessToken: credential}).then(function(token){
        if(!token) return res.forbidden();

        sails.models.user.findOne({id: token.user}).then(function(user){
            if(!user) return res.forbidden();

            //TODO: formalize in single method, used also in AuthController.
            req.session.authenticated = {
                id: user.id,
                name: user.name
            };

            delete req.query.access_token;

            next();
        });
    }).catch(function(err){
        res.serverError();
    });
};
