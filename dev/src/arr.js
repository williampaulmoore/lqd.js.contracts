/* Contract that expects the argument to be an array.
*/
export function arr ( a ) {
    if ( {}.toString.call( a ) !== '[object Array]' )
        throw new TypeError( 'Expected an array!' );

    return a;
}

/* Create a contract that expects and array where all elements in the array meet
   the supplied contract.
*/
export function arrOf ( c, a ) {
    return arr( a ).map( c );
}
