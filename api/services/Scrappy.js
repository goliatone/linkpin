var options = {
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
};

module.exports = {
    describe: function(url){
        return fetch(url, options)
        .then(function($){
            var out = {
                title: $('title').text(),
                description: $('meta[name=description]').attr('content') || 'empty',
                tags: getTags($('meta[name=keywords]').attr('content'))
            };
            return out;
        });
    }
};

function getTags(tags){
    if(tags) return tags.split(',');
    return [];
}

var cheerio = require('cheerio');
var nodeFetch = require('node-fetch');

function fetchResponseToText(fetchResponse) {
  return fetchResponse.text();
}

function fetch(url, options) {
    return nodeFetch(url).then(fetchResponseToText).then(function bodyToCheerio(body) {
        return cheerio.load(body, options);
    });
}
