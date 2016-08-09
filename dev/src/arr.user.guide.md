### arr

```javascript
import arr from 'contracts';

// Happy case - if an array is supplied as the argument then it is returned
// without being modified.
var a =  arr( [] );


// Error case - anything other than an array will result in a TypeError being
// thrown

try {
  var a = arr( {} );

} catch (e if e instanceof TypeError )  {
  console.log( e );
}
```
