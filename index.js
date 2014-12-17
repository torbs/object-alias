/*jshint node:true*/
'use strict';
var jsonPointer = require('simple-json-pointer');

function Alias(source) {
    this.source = source;
    this.result = {};
}

Alias.prototype.define = function(sourcePath, prop, parser) {
    if (sourcePath.indexOf('/') === -1) {
        return;
    }

    var pIndex      = sourcePath.lastIndexOf('/'),
        sourceProp  = sourcePath.substring(pIndex+1),
        _this       = this;

    sourcePath = sourcePath.substring(0, pIndex);

    Object.defineProperty(this.result, prop, {
        set: function (val) {
            var source = jsonPointer(_this.source, sourcePath);

            if (typeof source !== 'object') {
                return;
            }

            if (parser && parser.set) {
                return (source[sourceProp] = parser.set(val, source[sourceProp]));   
            }
            return (source[sourceProp] = val);

        },
        get: function() {
            var source = jsonPointer(_this.source, sourcePath);

            if (typeof source !== 'object') {
                return;
            }

            if (parser && parser.get) {
                return parser.get(source[sourceProp]);   
            }

            return source[sourceProp]; 
        }
    });
};

module.exports = Alias;