var expect  = require('chai').expect,
    Alias   = require('../index.js');

describe('Alias', function () {
    it('should create an alias to a root property', function () {
        var source = {
            a: 2
        }, 
        alias = new Alias(source);

        alias.define('#/a', 'b');

        expect(alias.result.b).to.equal(2);
    });

    it('should create an alias to a deep property', function () {
        var source = {
            a: {
                b: {
                    c: 2
                }
            }
        }, 
        alias = new Alias(source);

        alias.define('#/a/b/c', 'b');

        expect(alias.result.b).to.equal(2);
    });

    it('should change the source property when target property is changed', function () {
        var source = {
            a: 2
        }, 
        alias = new Alias(source);

        alias.define('#/a', 'b');
        alias.result.b = 3

        expect(source.a).to.equal(3);
    });

    it('should change apply the parse functions', function () {
        var source = {
            id: '0-0-2'
        }, 
        alias = new Alias(source);

        alias.define('#/id', 'id', {
            get: function (val) {
                return parseInt(val.substring(val.lastIndexOf('-') + 1), 10);
            }, 
            set: function (val, sourceVal) {
                return sourceVal.substring(0, sourceVal.lastIndexOf('-')+1) + val;
            }
        });
        
        expect(alias.result.id).to.equal(2);

        alias.result.id = 3;

        expect(source.id).to.equal('0-0-3');

        source.id = '1-2-4';

        expect(alias.result.id).to.equal(4);
    });


});