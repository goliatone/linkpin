'use strict';

var normalize = require('slug');

var Tag = {
    autoPK: true,
    identity: 'Tag',
    // nicename: 'Tag',
    attributes: {
        label: {
            type: 'string',
            required: true,
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
    },
    beforeCreate: function(values, next){
        values.label = (values.label || '').trim();
        values.label = normalize(values.label);
        next();
    }
};
module.exports = Tag;
