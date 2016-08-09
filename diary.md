#lqd-contracts - diary.

##create build distribution build steps
* install gulp
   * es6 - install babel ( npm install babel-core babel-preset-es2015 --save-dev )
   * es6 - create .babelrc and set preset to apply es2015
   * es6 - set gulp to know that it should use babel ( renamed gulpfile.js to gulpfile.babel.js )
* copy src/js to dirstibution folder
   * files are now copied using gulp
   * es6 is transpiled
   * use eslint
      * Had to config eslint to use ecma6
* create user guide
   * include individual user guide from dev src
   * create header
   * create table of contents

##Set up project structure
 * create package ( npm init )
    * name
    * version ( 0.1.0 )
    * license ( MIT )
 * create readme.md
 * create folder structure ( src, build-tools )
 * create git repository
    * git init
    * create .gitignore
