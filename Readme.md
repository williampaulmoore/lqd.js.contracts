#lqd-contracts

Javascript library that provides a set of functions that can be used to check whether an object conforms to a type definition.

The ideas for this library have been taken directly from the youtube video series [category theory for javascript programmers](https://www.youtube.com/watch?v=-FkgOHvNAU8&list=PLwuUlC2HlHGe7vmItFmrdBLn6p0AS8ALX)


##Project structucture

* *scr* - Contains all the source and test file for the library.
* *dist* - folder where the package is build from (not included in the repository).
* *dist-test* - folder where that source is built to when running tests (not included in the repository).

When a distribution is built the package source files are copied to the distributions folder, a package.json file is created in the distribution folder from the package.json file in the root of the repository and the readme.md from the src folder is copied to the.


##Workflow

The workflow is to keep adding features until ready to release a new version. When building a release the version number in the package.json in the repository root should be updated. The release should be built using the gulp task and then deployed locally to ensure that it can be deployed.  Once confident it can be deployed the changes should be pushed to Github and release created, the realease should include a zipped copy of the distribution folder as that is not included in the git repository.


##Tools

* gulp - build tool.
* eslint - javascript lint tool, checks for common mistakes.
* babel - javascript transpiler that converts from ES2015.
