'use strict';
var Link = {
    autoPK: true,
    identity: 'link',
    nicename: 'Link',
    attributes: {
        title: {
            type: 'string'
        },
        url: {
            type: 'string',
            url: true
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
            diminant: true
        },
        //MANY-TO-ONE
        notes: {
            collection: 'note',
            via: 'link'
        },
        //ONE-TO-MANY
        owner: {
            model: 'user'
        }
    }
};
module.exports = Link;
