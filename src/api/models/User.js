"use strict";

var bcrypt = require('bcrypt');

var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,
    identity: 'User',
    attributes: {
        username  : {
            type: 'string',
            unique: true,
            required: true
        },
        email : {
            type: 'email',
            unique: true,
            required: true
        },
        password: {
            type: 'string',
            required: true
        },
        // passports : { collection: 'Passport', via: 'user' },
        /////////////////////////
        /// RELATIONSHIPS
        /////////////////////////
        //ONE-TO-MANY
        links: {
            collection: 'link',
            via: 'owner'
        },
        //MANY-TO-ONE
        notes: {
            collection: 'note',
            via: 'author'
        },
        matchesPassword: function (password, cb) {
           return bcrypt.compare(password, this.password, cb);
       },
       toJSON: function(){
         var obj = this.toObject();
         delete obj._csrf;
         delete obj.password;
         delete obj.passwordConfirm;
         return obj;
       },
    },
    beforeValidate: function (values, next) {
        if (values.email) values.email = values.email.toLowerCase();
        next();
    },
    beforeCreate: function (values, next) {

        if(!values.password || values.password !== values.passwordConfirm){
            return next({err: ['Password does not match password confirmation']});
        }

        bcrypt.hash(values.password, sails.config.crypto.workFactor, function(err, hash) {
            if(err) return next(err);
            values.password = hash;
            delete values.passwordConfirm;
            next();
        });
    },
    beforeUpdate: function (values, next) {
        if(values.password) {
            bcrypt.hash(values.password, sails.config.crypto.workFactor, function(err, hash) {
                if(err) return next(err);
                values.password = hash;
                delete values.passwordConfirm;
                next();
            });
        } else {
            return next();
        }
    }
};

module.exports = User;
