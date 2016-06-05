'use strict';

var fs = require('fs');

module.exports = {
    importJSON: function $importJSON(json, userId){
        json = json || [];
        if(json && !Array.isArray(json)) json = [json];

        StopWatch.start();
        console.log('Total', json.length);

        function batch(step, data){
            step= step || 20;
            //we should paginate in batches of 50.
            var index = 0,
                count = 0,
                chunk, promises, iterations;

            iterations = Math.ceil(data.length / step);

            function doStep(results){
                if(results) console.log(results);
                if(data.length === 0) return done(results);
                if(index === iterations) return done(results);
                chunk = data.slice(index++ * step, index * step);

                count += chunk.length;

                console.log('- Iteration %s of %s. Processed %s items.', index, iterations, count);

                createFromJSON(chunk, userId)
                    .then(doStep)
                    .catch(function(err){
                        console.error('ERROR', err.message);
                        if(data.length === 0) return done(results);
                        else doStep();
                    });
            }

            function done(){
                var timer = StopWatch.stop();
                console.log('Batch import JSON done in %s iterations, time %s.', index, timer.legend);
            }

            doStep();
        }

        batch(50, json);
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

function createFromJSON(json, userId){
    console.log('JSON', json.length);
    if(!json.length) return Promise.resolve();
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
    tags = tags.map(function(tag){ return {label: Tag.normalize(tag)};});

    console.log('- tags', tags.length);

    if(tags.length === 0) return Promise.resolve();
    //Find or create Tags
    return Tag.findOrCreate(tags).then(function(tags){
        var map = {};
        tags.map(function(tag){
            map[tag.label] = tag;
        });

        json.map(function(link){
            link.tags = link.tags.map(function(label){
                return (map[label] || {}).id;
            });
        });

        console.log('- Creating %s links', json.length);

        Link.create(json).then(function(links){
            console.log('- CREATED a total of %s links', links.length);
            return links;
        }).catch(function(err){
            console.error('- Link create error:\n\t- Message: %s\n\t- Stack:', err.message, err.failedTransactions);
        });
    }).catch(function(err){
        console.error('- Tag findOrCreate error:\n\t- Message: %s\n\t- Stack:', err.message, err.stack);
    });
}
