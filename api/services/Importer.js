'use strict';

var fs = require('fs');

module.exports = {
    importJSON: function(json, userId){
        json = json || [];
        if(json && !Array.isArray(json)) json = [json];

        //First, we want to get all tags, and then create them if
        //they dont exist.
        var tags = [];
        var links = [];
        //get all tags and add user.
        json.map(function(link){
            link.owner = userId;
            if(link.tags) tags = tags.concat(link.tags);
            //this is not working, why?
            if(link.createdAt) link.createdAt = new Date(link.createdAt);
        });

        //get unique tags
        tags = tags.filter(function (e, i, arr) {
            return arr.lastIndexOf(e) === i;
        });

        //make tag objects
        tags = tags.map(function(tag){ return {label: tag};});

        // var promises = [
        //     Tag.findOrCreate(tags),
        //     Link.findOrCreate(json)
        // ];
        //
        // return Promise.all(promises).then(function(res){
        //     var tags = res[0],
        //         links = res[1];
        //
        // });

        //Find or create Tags
        return Tag.findOrCreate(tags).then(function(tags){
            var map = {};
            tags.map(function(tag){
                map[tag.label] = tag;
            });

            json.map(function(link){
                link.tags = link.tags.map(function(label){
                    return map[Tag.normalize(label)].id;
                });
            });

            console.log('==================================')
            console.log(JSON.stringify(json, null,4))
            console.log('==================================')


            Link.findOrCreate(json).then(function(links){
                console.log('CREATED', links);
                return links;
            });
        });
    },
    fromFile: function(filepath, userId){
        var json = fs.readFileSync(filepath, 'utf-8');
        try {
            json = JSON.parse(json);
        } catch(e){
            console.error('ERROR parsing JSON');
            console.error(e.message, e.stack);
            json = [];
        }
        return module.exports.importJSON(json, userId);
    }
}
