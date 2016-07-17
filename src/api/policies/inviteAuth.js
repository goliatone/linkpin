/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Token Bearer policy
 *
 */
var base64url = require('base64url');

module.exports = function(req, res, next) {

    if(!req.query || !req.query.it){
        return res.badRequest({error:'Invalid token.'});
    }
    var token = req.query.it;
    return sails.models.invite.findOne({token: token}).then(function(invite){
        req.session.invite = invite;
        next();
    }).catch(function(err){
        res.serverError(err);
    });
};
