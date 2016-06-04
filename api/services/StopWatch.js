'use strict';
var HumanTime = require('custom-human-time');
var humanTime = new HumanTime;
var _current, _data;

module.exports.start = function(){
    var start = process.hrtime();

    _current = function(){
        var end = process.hrtime(start);
        var seconds = end[0];
        var milliseconds = Math.trunc(end[1]/1000000);
        return {
            legend: humanTime.print(seconds * 1000),
            seconds: seconds,
            milliseconds: milliseconds
        };
    };
    return _current;
};

module.exports.stop = function(){
    if(_current){
        _data = _current();
        return _data;
    }
    return {};
};
