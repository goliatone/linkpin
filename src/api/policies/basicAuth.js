/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Token Bearer policy
 *
 */
var base64url = require('base64url');

module.exports = function(req, res, next) {
    var credential;

    if(req.headers && req.headers.authorization){
        var parts = req.headers.authorization.split(' ');

        if(parts.length === 2){
            var schema = parts[0],
                credentials = parts[1];
            if(/^Basic$/i.test(schema)){
                credential = credentials;
            }
        } else {
            return res.badRequest({error:'Mal formed authorization header.'});
        }
    }

    //We are not trying to authenticate.
    if(!credential) return next();
    if(!credential.length) return next();

    credential = base64url.decode(credential);
    if(!credential.indexOf(':')) return next();

    var email = credential.slit(':')[0],
        pass = credential.split(':')[1];
    
    return sails.models.user.findOne({email: email}).populate('tokens').then(function(user){
        if(!user) return res.forbidden();

        return user.matchesPassword(pass, function(err, match){
            req.session.authenticated = {
                id: user.id,
                name: user.name
            };
            req.session.user = user;

            next();
        });
    }).catch(function(err){
        res.serverError();
    });
};
