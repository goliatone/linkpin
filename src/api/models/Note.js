'use strict';
var Note = {
    autoPK: true,
    identity: 'Note',
    autoCreatedAt: true,
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
        //ONE-TO-MANY
        author: {
            model: 'user'
        },
        authorName:{
            type: 'string'
        }
    },
    beforeCreate: function(values, next){
        console.log(
            'BEFORE CREATE',
            values
        );
        if(values.author){
            if(values.author.username){
                values.authorName = values.author.username;
                next();
            } else {
                User.findOne(values.author).then(function(author){
                    values.authorName = author.username;
                    console.log('HERE MOTHERFUCKERS', author);
                    next();
                }).catch(function(err){
                    console.log('HERE', err);
                    next();
                })
            }
        } else next();
    }
};
module.exports = Note;
