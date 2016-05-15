module.exports = {
    describe: function(req, res){

        Scrappy.describe(req.body.url).then(function(out){
            res.send({success:true, value: out});
        }).catch(function(err){
            res.send({success:false, error: err});
        });
    },
    create: function(req, res){
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

            var tags = req.body.tags.split(',');
            tags = tags.filter(function(tag){
                return tag.trim();
            });

            Tag.find({label:tags}).then(function(utags){
                var createTags = getNewTags(utags, tags);
                console.log('CREATE', createTags);

                if(!utags.length){
                    tags = tags.map(function(tag){
                        return {label: tag};
                    });
                    console.log('create tags', tags);
                    Tag.create(tags).then(function(utags){
                        console.log('tags', utags);
                        Link.update(link.id, {tags: utags}).then(function(link){
                            res.send({success:true, value: link});
                        });
                    });
                }

                console.log('tags', utags);
                Link.update(link.id, {tags: utags}).then(function(link){
                    console.log('update link');
                    res.send({success:true, value: link});
                });
            }).catch(function(err){
                return err;
            });
        }).catch(function(err){
            res.send({success:false, error: err});
        });
    },
    form: function(req, res){
        res.view()
    }
};

function getNewTags(utags, tags){
    function getLabels(tags){
        return tags.map(function(tag){ return tag.label});
    }
    var createdTags = getLabels(utags);

    return tags.filter(function(tag){
        return createdTags.indexOf(tag) === -1;
    });
}
