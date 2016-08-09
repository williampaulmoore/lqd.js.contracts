import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import fs from 'fs';
import gulp from 'gulp';
import mkdirp from 'mkdirp';
import mocha from 'gulp-mocha';
import os from "os";
import path from 'path';
import sort from 'gulp-sort';
import uuid from 'node-uuid';

var userguide_extension = '.user.guide.md';

var config = {
  paths: {
    file: {
      src: '**/*.js',
      test: '**/*.spec.js',
      userguide: '**/*'+ userguide_extension
    },
    dev: {
      src:  './dev/src',
      test: './dev/src'
    },
    dist: {
      src: './dist/src',
      test: './dist/test'
    },
    obj: './tmp/build', // temporary files needed as part of a build process
    root: '.'
  }
};

var lint_config = {
   'parserOptions': {
      'ecmaVersion': 6,
      'sourceType': 'module'
   }
  ,'rules': {
      'quotes': [1, 'single'],
      'semi': [1, 'always']
   }
};

var dev_src = path.join(
   config.paths.dev.src
  ,config.paths.file.src
);

var dev_test = path.join(
   config.paths.dev.test
  ,config.paths.file.test
);


var get_userguide_section_path = ( section_file_name ) =>
  path.join(
     config.paths.dev.src
    ,section_file_name
  )
;

var userguide_section_files = {
   header: get_userguide_section_path( 'userguide.header.md' )
}


var dev_userguide = path.join(
   config.paths.dev.src
  ,config.paths.file.userguide
);

var dist_userguide = 'userguide.md';

var dist_test = path.join(
    config.paths.dist.test
   ,config.paths.file.test
);


var get_filenames_recursive = ( dir , filelist ) => {

  var files = fs.readdirSync( dir );
  filelist = filelist || [];

  files.forEach( ( file ) =>  {
    var file_path = path.join(
       dir
      ,file
    );

    if ( fs.statSync( file_path ).isDirectory() ) {
      filelist = get_filenames_recursive( file_path, filelist );
    }
    else {
      filelist.push( { dir: dir, file: file } );
    }

  });
  return filelist;
};

var replace_file = ( path, contents ) => {

  // remove an existing userguide before creating a new one
  try {
    fs.unlinkSync( path );

  } catch ( err ) {
    console.log( err );

    // 'ENOENT means the file does not exist so as far as I
    // am concerned my objective has been achieved.
    //
    // if it is any other error then just throw it, as there
    // is nothing programmatically we can do about that
    if ( err.code !== 'ENOENT' ) throw err;
  }
  fs.writeFileSync( path, contents, 'utf8' ) ;
}

var is_a_user_guide = new RegExp( userguide_extension + '$' );

var get_userguide_filedetails = () => {
  var all_filenames = get_filenames_recursive( config.paths.dev.src );

  return all_filenames.filter( ( file_details ) => {
    return is_a_user_guide.test( file_details.file )
  })
  .reduce(
    ( acc, file_details ) => {

      acc.filenames.push(
        file_details.file
      );

      acc.filepaths.push(
        path.join(
          file_details.dir
         ,file_details.file
        )
      );
      return acc;
    }
   ,{ filenames: [], filepaths: []  }
  );
}

var get_userguide_table_of_contents = ( userguide_filenames ) => {

  return userguide_filenames
           .map( ( userguide_filename ) => userguide_filename.replace( is_a_user_guide, '' ) )
           .map( ( userguide_name ) => ' * ' + userguide_name )
           .reduce(
              ( acc, userguide_entry ) => {
                acc.push( userguide_entry );
                return acc;
              }
             ,[ '## Contents' ]
           )
           .concat( [ os.EOL ] );
};

var get_userguides = ( userguide_filepaths ) => {
  var result = [];

  userguide_filepaths.forEach( ( userguide ) =>
    result.push( fs.readFileSync( userguide, 'utf8' ) )
  );
  return result;
};

// creates the user guide as the different sections are concaternated together
gulp.task( 'build-userguide', () => {

  var userguide_details = get_userguide_filedetails ( config.paths.dev.src );

  var header = fs.readFileSync( userguide_section_files.header, 'utf8' );
  var table_of_contents = get_userguide_table_of_contents( userguide_details.filenames ).join( os.EOL );
  var userguides = get_userguides( userguide_details.filepaths ).join( os.EOL );

  var userguide = [ header
                  , table_of_contents
                  , userguides
                  ]
                  .join( os.EOL )
                ;

  replace_file(
     dist_userguide
    ,userguide
  );

});

// lint javascript in the scr folder and fail if any rules have been
// broken
gulp.task( 'lint-src', () =>
  gulp.src( [ dev_src, '!' + dev_test ] )
    .pipe( eslint( lint_config ) )
    .pipe( eslint.failOnError() )
);

// Transpile es6 from the source folder and copy to distribution folder.
gulp.task( 'src-to-dist', [ 'lint-src' ], () =>
  gulp.src( [ dev_src, '!'+dev_test] )
    .pipe( babel() )
    .pipe( gulp.dest( config.paths.dist.src ) )
);

// lint javascript in the test folde and fail if any rules have been broken
gulp.task( 'lint-test', () =>
  gulp.src( dev_test )
    .pipe( eslint( lint_config ) )
    .pipe( eslint.failOnError() )
);

// Transpile es6 from the test folder and copy to distribution folder.
gulp.task( 'test-to-dist', [ 'lint-test' ], () =>
  gulp.src( dev_test )
    .pipe( babel() )
    .pipe( gulp.dest( config.paths.dist.test ) )
);

// Lint and transpile the library and tests and copy them to the
// distribution folder
gulp.task( 'build', [ 'src-to-dist', 'test-to-dist' ] );

// lint, transpile, then run the tests
gulp.task('test', ['build'], () =>
  gulp.src( dist_test )
    .pipe( mocha( { reporter: 'spec' } ) )
    .on( 'error', err => console.log( err.stack ) )
);

gulp.task( 'watch', () => {
  gulp.watch( dev_src, [ 'test' ] );
  gulp.watch( dev_test, [ 'test' ] );
});
