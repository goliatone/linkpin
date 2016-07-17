'use strict';
var Promise = require('bluebird');

module.exports = {
    seed: function(req, res){
        var filepath = '/opt/linkpin/uploads/delicious_all.json';
        if(req.query.filepath) filepath = req.query.filepath;

        Importer.fromFile(filepath, req.session.user.id);

        res.jsonx({working: true, filepath: filepath});
    },
    describe: function(req, res){
        var url = req.param('url');
        Scrappy.describe(url).then(function(out){
            res.jsonx({success:true, value: out});
        }).catch(function(err){
            //TODO: use response: badRequest/serverError/notFound
            res.jsonx({success:false, error: err});
        });
    },
    owns: function(req, res){
        var url = req.param('url'),
            owner = req.session.user.id;
        console.log('URL', url, 'OWNER', owner);
        Link.findOne({url: url, owner: owner})
            .populate(['notes', 'tags']).then(function(link){
                res.jsonx({success: true, value: link});
        }).catch(function(err){
            //TODO: use response: badRequest/serverError/notFound
            res.jsonx({success:false, error: err});
        });
    },
    create: function(req, res){
        //refactor like Importer.importJSON
        var uid =  req.session.user.id;

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

            return Tag.find({label: tags}).then(function(userTags){
                var createTags = getNewTags(userTags, tags);
                console.log('- FOUND', userTags);
                console.log('- CREATE', createTags);

                if(createTags.length){
                    createTags = createTags.map(function(tag){
                        return {label: tag};
                    });
                    console.log('create tags', createTags);
                    return Tag.create(createTags).then(function(newTags){
                        console.log('tags', newTags);
                        return Link.update(link.id, {tags: newTags.concat(userTags)}).then(function(link){
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
                    return Link.update(link.id, {tags: userTags}).then(function(link){
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
        var uid = req.session.user.id;
        if(!uid) return req.forbidden();

        var pageNumber = req.param('page') || 1;
        var pageSize = req.param('size') || sails.config.pagination.pageSize;

        var criteria = {
            sort: 'createdAt DESC',
            owner: uid
        };

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
    linkView: function(req, res){
        var id = req.param('id');
        var uid = req.session.user.id;
        console.log('FINDONE', {id:id, owner: uid});
        Link.findOne({id:id, owner: uid})
            .populate(['tags', 'notes'])
        .then(function(link){
            if(!link) res.notFound();
            res.view('site/link/view', {
                link: link || {},
                title: 'LinkPin'
            });
        });
    },
    linkEdit: function(req, res){

    },
    noteAdd: function(req, res){
        Note.create(req.body).then(function(note){
            res.send({success: true, data: note});
        }).catch(function(err){
            res.send({success: false, data: err});
        });
    },
    tags: function(req, res){
        var pageNumber = req.param('offset') || 1;
        var pageSize = req.param('size') || sails.config.pagination.pageSize;

        var criteria = {
            sort: 'createdAt DESC',
            label: req.params.label
        };
        //http://stackoverflow.com/questions/26535727/sails-js-waterline-populate-deep-nested-association
        // var promises = [
        //     Link.count({label:req.params.label}),
        // ]
        Tag.findOne(criteria)
            .populate('links')
            .paginate({page: pageNumber, limit: pageSize})
        .then(function(tag){
            var all = sails.util.pluck(tag.links, 'id');
            Link.find(all)
                .populate('tags')
            .then(function(links){
                res.view('site/index', {
                    links: links,
                    tag: tag,
                    title: 'LinkPin',
                    query: require('url').parse(req.url).query,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    count: 0 //we need to figure out this
                });
            });
        });
    },
    search: function(req, res){
        //TODO: fix, we need to count all links in search
        //and then only return those we have paginated.
        var term = req.param('q');
        var uid = req.session.user.id;
        var pageSize = req.param('size') || 5;
        var pageNumber = req.param('page') || 1;

        console.log('TERM', term, 'QUERY', req.query);

        var criteria = {
            sort: 'createdAt DESC',
            owner: uid,
            or:[
                { title: { like: '%' + term + '%'}},
                { description: {like: '%' + term + '%'}},
            ]
        };
        Promise.all([
            Link.count(criteria),
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
                total: count,
                searchTerm: term,
                pageNumber: parseInt(pageNumber),
                pageSize: pageSize,
                title: 'LinkPin',
                pageTitle: 'Search Results |' + term,
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
