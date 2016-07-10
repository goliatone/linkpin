'use strict';

var normalize = require('slug');
normalize.defaults.mode ='pretty';
normalize.defaults.modes['pretty'] = {
    replacement: '-',
    symbols: true,
    remove: /[.]/g,
    lower: true,
    charmap: normalize.charmap,
    multicharmap: normalize.multicharmap
};

var Tag = {
    autoPK: true,
    identity: 'Tag',
    autoCreatedAt: true,
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
    },
    normalize: normalize.bind(null)
};
module.exports = Tag;
