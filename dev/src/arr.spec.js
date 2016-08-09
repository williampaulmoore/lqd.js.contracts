import { expect, assert } from 'chai';
import { arr, arrOf } from '../src/arr.js';

describe( 'arr', () => {

  it( 'will identify an empty array', () => {
    let a = [];

    expect( arr( a ) ).to.equal( a );
  });

  it( 'will identify an array with elements in it', () => {
    let a = [ 1, 2, 3 ];

    expect( arr( a ) ).to.equal( a );
  });

  it( 'will throw TypeError if the argument is not an error', () => {
    let sut = () => arr( {} );

    assert.throws( sut, TypeError, 'Expected an array!' );
  });

});


describe( 'arrOf', () => {

  var is_applied_to_each_element = function( c, a ) {
    let sut = arrOf.bind( null, c );

    // run the contract over the array then create zip the
    // reuslt of the arrOf and the contract manually mapped to
    // each element in the array.  Finally reduce this to
    // a boolean flag that is true if each element in the ziped
    // array match.
    return sut( a )
            .map( ( e, i )  => [ e, c( a[ i ] ) ] )
            .reduce( ( acc, value ) => acc && value[0] == value[1], true )
            ;
  }


  it( 'will apply the contract to all elements in the array', () => {
    let a = [ 1, 2 ];
    let c = ( n ) => n * 2;

    expect( is_applied_to_each_element( c, a ) ).to.equal( true );
  });


  it( 'will accept empty arrays', () => {
    let a = [];
    let c = ( n ) => n * 2;

    expect( is_applied_to_each_element( c, a ) ).to.equal( true );
  });


  it( 'will throw an exception if not passed an array', () => {
    let check = arrOf.bind( null, ( n ) => n * 2 );
    let sut = () => check( {} );

    assert.throws( sut, TypeError, 'Expected an array!' );
  });

});
