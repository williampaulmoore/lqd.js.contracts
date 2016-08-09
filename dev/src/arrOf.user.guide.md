### arrOf

```js
import arrOf from 'contracts';

var bool = ( p ) => {

  if ( typeof p !== 'boolean' ) throw new TypeError( 'Expected a boolean!' );

  return p
};


var boolArr = arrOf.bind( null, bool );

//
// Happy case - if an array of bools or an empty array is supplied as the
// argument then it is returned without being modified.
var a  = boolArr( [] );
var ab = boolArr( [ true, false, true ] );


// Error case - anything other than a boolean array will result in a
// TypeError being thrown
try {
  var a = boolArr( {} ); // Error - not passing an array
  var ab = boolArr( [ true, false, true, 'Fred' ] ); // Error - passing an array where not all elements are boolean

} catch (e if e instanceof TypeError )  {

  console.log( e );
}
```
