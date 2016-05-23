'use strict';
var Link = {
    autoPK: true,
    identity: 'Link',
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
            // unique: true
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
            dominant: true
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
        console.log('BEFORE CREATE', values.owner);
        values.fingerprint = 'kaka';
        next();
        // var crypto = require('crypto');
        //
        // if(typeof values.ownwer === 'number'){
        //
        // }
        // User.findOne(values.owner)
        // var username = ;
        // var hash = crypto.createHash('md5').update(values.url).digest('hex');
    }
};
module.exports = Link;
