'use strict';
var Promise = require('sails/node_modules/waterline/node_modules/bluebird');

module.exports = {
    describe: function(req, res){

        Scrappy.describe(req.body.url).then(function(out){
            res.send({success:true, value: out});
        }).catch(function(err){
            res.send({success:false, error: err});
        });
    },
    create: function(req, res){
        // var Promise = require('sails/node_modules/bluebird');
        //
        // var tags = getTagsFrom(req.body);
        //
        // Promise.all([
        //     Link.create({
        //         url: req.body.url,
        //         title: req.body.title,
        //         owner: req.body.owner || uid,
        //         description: req.body.description,
        //     }),
        //     Tag.find({label: tags})
        // ]).then(function(){})
        //create link
        // var uid = req.user.id;
        Link.create({
            url: req.body.url,
            title: req.body.title,
            owner: req.body.owner || uid,
            description: req.body.description,
        }).then(function(link){
            console.log('link', link);
            //find all tags
            if(!req.body.tags){
                return res.send({success:true, value: link});
            }

            var tags = getTagsFrom(req.body);
            console.log('TAGS', tags);

            Tag.find({label: tags}).then(function(userTags){
                var createTags = getNewTags(userTags, tags);
                console.log('FOUND', userTags);
                console.log('CREATE', createTags);

                if(createTags.length){
                    createTags = createTags.map(function(tag){
                        return {label: tag};
                    });
                    console.log('create tags', createTags);
                    Tag.create(createTags).then(function(newTags){
                        console.log('tags', newTags);
                        Link.update(link.id, {tags: newTags.concat(userTags)}).then(function(link){
                            res.send({success:true, value: link});
                        }).catch(function(err){
                            console.error('ERROR D', err.message, err.stack);
                            res.send({success:false, error: err});
                        });
                    }).catch(function(err){
                        console.error('ERROR A', err.message, err.stack);
                        res.send({success:false, error: err});
                    });

                } else {
                    console.log('tags', userTags);
                    Link.update(link.id, {tags: userTags}).then(function(link){
                        console.log('update link');
                        res.send({success:true, value: link});
                    }).catch(function(err){
                        console.error('ERROR B', err.message, err.stack);
                        res.send({success:false, error: err});
                    });
                }

            }).catch(function(err){
                console.error('ERROR C', err.message, err.stack);
                res.send({success:false, error: err});
            });
        }).catch(function(err){
            res.send({success:false, error: err});
        });
    },

    form: function(req, res){
        Tag.find({}).then(function(tags){
            res.view('site/form', {tags:tags});
        }).catch(function(err){
            res.send({success:false, error: err});
        });

    },
    index: function(req, res){
        var pageNumber = req.param('page') || 1;
        var pageSize = req.param('size') || 5;

        var criteria = { sort: 'createdAt DESC' };
        Promise.all([
            Link.count(),
            Link.find(criteria)
                .populate('tags')
                .paginate({page: pageNumber, limit: pageSize})
        ]).then(function(results){
            var count = results[0],
                links = results[1];

            res.view('site/index', {
                links: links,
                // layout: 'site/layout',
                count: Math.ceil(count / pageSize),
                pageNumber: parseInt(pageNumber),
                title: 'LinkPin',
                query: require('url').parse(req.url).query
            });
        });
    },
    tags: function(req, res){

        var criteria = {
            skip: 0,
            limit: 50,
            sort: 'createdAt DESC',
            label: req.params.label
        };
        //http://stackoverflow.com/questions/26535727/sails-js-waterline-populate-deep-nested-association
        Tag.findOne(criteria)
            .populate('links')
        .then(function(tag){
            var all = sails.util.pluck(tag.links, 'id');
            Link.find(all).populate('tags').then(function(links){
                res.view('site/index', {
                    links: links,
                    tag: tag,
                    title: 'LinkPin',
                    query: require('url').parse(req.url).query
                });
            });
        });
    },
    search: function(req, res){
        var pageNumber = req.param('page') || 1;
        var pageSize = req.param('size') || 5;
        var term = req.param('q');

        var criteria = { sort: 'createdAt DESC', or:[
            { title: {like: '%' + term + '%'}},
            { description: {like: '%' + term + '%'}},
        ] };
        Promise.all([
            Link.count(),
            Link.find(criteria)
                .populate('tags')
                .paginate({page: pageNumber, limit: pageSize})
        ]).then(function(results){
            var count = results[0],
                links = results[1];

            res.view('site/index', {
                links: links,

                // layout: 'site/layout',
                count: Math.ceil(count / pageSize),
                pageNumber: parseInt(pageNumber),
                title: 'LinkPin',
                pageTitle: 'Search Results',
                query: require('url').parse(req.url).query
            });
        });
    }
};

function getNewTags(userTags, tags){
    function getLabels(tags){
        return tags.map(function(tag){ return tag.label});
    }
    var createdTags = getLabels(userTags);

    return tags.filter(function(tag){
        return createdTags.indexOf(tag) === -1;
    });
}

function getTagsFrom(body){
    var tags = body.tags || []
    tags = tags.split(',').map(function(tag){
        return tag.trim();
    });
    return tags;
}
