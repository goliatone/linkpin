'use strict';
var crypto = require('crypto');

var Link = {
    autoPK: true,
    identity: 'Link',
    autoCreatedAt: true,
    // nicename: 'Link',
    attributes: {
        title: {
            type: 'string'
        },
        url: {
            type: 'string',
            url: true,
            // unique: true //per user!
        },
        /*
         * It should be username + url hash
         */
        fingerprint: {
            type: 'string',
            unique: true
        },
        description: {
            type: 'text'
        },
        /////////////////////////
        /// RELATIONSHIPS
        /////////////////////////
        //MANY-TO-MANY
        tags: {
            collection: 'tag',
            via: 'links',
            // dominant: true
        },
        //MANY-TO-ONE
        notes: {
            collection: 'note',
            via: 'link'
        },
        //ONE-TO-MANY
        owner: {
            model: 'user'
        },
        private: {
            type: 'boolean',
            defaultsTo: true
        },
        toJSON: function() {
          var obj = this.toObject();
          delete obj.createdAt;
          delete obj.updatedAt;
          return obj;
        }
    },
    beforeCreate: function(values, next){
        if(!values.owner) return next(new Error('Undefined owner'));
        var hash = this.hashUrlForOwner(values.url, values.owner)
        values.fingerprint = hash;
        console.log('Fingerprint: %s', hash);
        next();
    },
    hashUrlForOwner: function(url, owner){
        owner = typeof owner === 'object' ? owner.id : owner;
        var finger =  owner + '::' + url;
        var hash = crypto.createHash('md5').update(finger).digest('hex');
        return hash;
    }
};
module.exports = Link;
