'use strict';
var Tag = {
    autoPK: true,
    identity: 'Tag',
    // nicename: 'Tag',
    attributes: {
        label: {
            type: 'string',
            unique: true
        },
        suggested: {
            type: 'boolean',
            defaultsTo: false
        },
        /////////////////////////
        /// RELATIONSHIPS
        /////////////////////////
        //MANY-TO-MANY
        links: {
            collection: 'link',
            via: 'tags'
        }
    }
};
module.exports = Tag;
