"use strict";

var crypto = require('crypto');
var base64URL = require('base64url');

var Invite = {
    schema: false,
    identity: 'Invite',
    autoCreatedAt: true,
    attributes: {
        user: {
            model: 'User',
            required: true
        },
        email : {
            type: 'email',
            unique: true,
            required: true
        },
        token: {
            type: 'string'
        },
    },
    generateToken: function(){
        return base64URL(crypto.randomBytes(48));
    },
    beforeCreate: function (values, next) {
        if(!values.accessToken) values.token = this.generateToken();
        next();
    },
};

module.exports = Invite;
