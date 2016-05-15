'use strict';
var Tag = {
    autoPK: true,
    identity: 'link',
    nicename: 'Link',
    attributes: {
        label: {
            type: 'string'
        },
        suggested: {
            type: 'boolean'
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
