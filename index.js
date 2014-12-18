/*jshint node:true*/
'use strict';
var jsonPointer = require('simple-json-pointer');

require('es6-collections');

var dataStore = new WeakMap();

function _iteratePath(target, path) {
    if (path.length === 0) {
        return target;
    }
    var current = path.shift();
    if (current === '' && path.length === 0) {
        return target;
    }
    target[current] = _iteratePath(target[current] || {}, path);
    return target[current];
}

function ObjectAlias(source, definitions) {
    dataStore.set(this, source);

    if (definitions) {
        definitions.forEach(function (def) {
            this.define.apply(this, def);
        }.bind(this));
    }
}

ObjectAlias.prototype.define = function(sourcePath, targetPath, parser, alternativeSource) {
    if (sourcePath.indexOf('#/') === -1) {
        sourcePath = '#/' + sourcePath;
    }

    if (targetPath.indexOf('#/') === -1) {
        targetPath = '#/' + targetPath;
    }

    sourcePath = sourcePath.replace('.', '/');
    targetPath = targetPath.replace('.', '/');

    var sIndex      = sourcePath.lastIndexOf('/'),
        tIndex      = targetPath.lastIndexOf('/'),
        sourceProp  = sourcePath.substring(sIndex+1),
        targetProp  = targetPath.substring(tIndex+1),
        _this       = this,
        source      = alternativeSource || dataStore.get(this),
        target;

    sourcePath = sourcePath.substring(0, sIndex);
    targetPath = targetPath.substring(0, tIndex+1).replace('#/', '');

    if (targetPath !== '') {
        target = _iteratePath(this, targetPath.split('/'));
    } else {
        target = this;
    }

    Object.defineProperty(target, targetProp, {
        set: function (val) {
            var _source = jsonPointer(source, sourcePath);

            if (typeof _source !== 'object') {
                return;
            }

            if (parser && parser.set) {
                return (_source[sourceProp] = parser.set(val, _source[sourceProp]));   
            }
            return (_source[sourceProp] = val);

        },
        get: function() {
            var _source = jsonPointer(source, sourcePath);

            if (typeof _source !== 'object') {
                return;
            }

            if (parser && parser.get) {
                return parser.get(_source[sourceProp]);   
            }

            return _source[sourceProp]; 
        }
    });

    return this;
};

module.exports = ObjectAlias;