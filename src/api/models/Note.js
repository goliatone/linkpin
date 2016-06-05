'use strict';
var Note = {
    autoPK: true,
    identity: 'Note',
    attributes: {
        body: {
            type: 'text'
        },
        /////////////////////////
        /// RELATIONSHIPS
        /////////////////////////
        //ONE-TO-MANY
        link: {
            model: 'link'
        },
        //ONE-TO-ONE
        author: {
            model: 'user'
        }
    }
};
module.exports = Note;
