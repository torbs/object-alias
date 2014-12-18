# Object Alias

Creates an alias object to another object.

Sometimes you need to accept an object in one format and map the object to a different format to use it in a different service. Object-Alias allows you to create this mapping in a compressed format using json-pointers.



## Installation

npm install object-alias



## Usage



### Create an alias

```js
var source = {
        rootProp: 'foo',
        deep: {
            prop: 'bar'
        }
    },
alias = new ObjectAlias(source);

alias.define('#/rootProp', '#/myProp');
console.log(alias.myProp); // foo

alias.define('#/deep/prop', '#/yourProp');
console.log(alias.yourProp); // bar

alias.define('#/deep/prop', '#/your/prop');
console.log(alias.your.prop); // bar
```



### Parse values from one format to another

```js
var source = {
        id: '0-0-2'
    }, 
    alias = new ObjectAlias(source);

alias.define('#/id', '#/id', {
    get: function (val) {
        return parseInt(val.substring(val.lastIndexOf('-') + 1), 10);
    }, 
    set: function (val, sourceVal) {
        return sourceVal.substring(0, sourceVal.lastIndexOf('-')+1) + val;
    }
});

console.log(alias.id); //2

alias.id = 3;
console.log(source.id); //'0-0-3'
```



### Use an alternative source

```js
var source2 = {
        prop: 'bar',
    };
// ...

alias.define('#/prop', '#/foo', null, source2);
console.log(alias.foo); // bar
```



### Create multiple aliases

```js
var definitions = [
    ['#/rootProp', '#/myProp'],
    ['#/deep/prop', '#/yourProp'],

    // You can use slash (/) or dot (.) as delimiter. #/ in the beginning is optional
    ['deep.prop', 'your.prop'],
    ['prop', 'foo', null, source2],
    ['#/id', '#/id', {
        set: function (val, sourceVal) {}, 
        get: function (val) {}
    }]
];    

alias = new ObjectAlias(source, definitions);
```


## TODO

Implement the full json-pointer syntax