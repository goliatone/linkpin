"use strict";

var crypto = require('crypto');
var base64URL = require('base64url');

var Token = {
    schema: false,
    identity: 'Token',
    attributes: {
        user: {
            model: 'User',
            required: true
        },
        accessToken: {
            type: 'string'
        },
    },
    generateToken: function(){
        return base64URL(crypto.randomBytes(48));
    },
    beforeCreate: function (values, next) {
        if(!values.accessToken) values.accessToken = this.generateToken();
        next();
    },
};

module.exports = Token;
