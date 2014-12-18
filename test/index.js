var expect  = require('chai').expect,
    Alias   = require('../index.js');

describe('Alias', function () {
    it('should create an alias to a root property', function () {
        var source = {
            a: 2
        }, 
        alias = new Alias(source);

        alias.define('#/a', '#/b');

        expect(alias.b).to.equal(2);
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

        alias.define('#/a/b/c', '#/b');

        expect(alias.b).to.equal(2);
    });

    it('should create an deep alias', function () {
        var source = {
            a: 2
        },

        alias = new Alias(source);

        alias.define('#/a', '#/b/c');

        expect(typeof alias.b).to.equal('object');
        expect(alias.b.c).to.equal(2);
    });

    it('should accept dots and missing #/', function () {
        var source = {
            a: {
                b: 2
            }
        },

        alias = new Alias(source);

        alias.define('a.b', 'b.c');

        expect(typeof alias.b).to.equal('object');
        expect(alias.b.c).to.equal(2);
    });

    it('should change the source property when target property is changed', function () {
        var source = {
            a: 2
        }, 
        alias = new Alias(source);

        alias.define('#/a', '#/b');
        alias.b = 3

        expect(source.a).to.equal(3);
    });

    it('should change apply the parse functions', function () {
        var source = {
            id: '0-0-2'
        }, 
        alias = new Alias(source);

        alias.define('#/id', '#/id', {
            get: function (val) {
                return parseInt(val.substring(val.lastIndexOf('-') + 1), 10);
            }, 
            set: function (val, sourceVal) {
                return sourceVal.substring(0, sourceVal.lastIndexOf('-')+1) + val;
            }
        });
        
        expect(alias.id).to.equal(2);

        alias.id = 3;

        expect(source.id).to.equal('0-0-3');

        source.id = '1-2-4';

        expect(alias.id).to.equal(4);
    });

    it('should take definitions as second parameter', function () {
        var source = {
            a: 2
        }, 
        definitions = [
            ['#/a', '#/b'],
            ['#/a', '#/c/d']
        ];

        alias = new Alias(source, definitions);
        expect(alias.b).to.equal(2);
        expect(alias.c.d).to.equal(2);
    });

    it('should create aliases to multiple sources', function () {
        var s1 = {
                a: 2
            },
            s2 = {
                b: 3
            },
            alias = new Alias(s1);

            alias.define('a', 'p1');
            alias.define('b', 'p2', null, s2);

            expect(alias.p1).to.equal(2);
            expect(alias.p2).to.equal(3);

            alias.p1 = 4;
            alias.p2 = 5
            
            expect(s1.a).to.equal(4);
            expect(s2.b).to.equal(5);
    }); 
});