[![GitHub release](https://img.shields.io/github/release/dietergeerts/fabricator-builder.svg)]()
[![Build Status](https://travis-ci.org/dietergeerts/fabricator-builder.svg)](https://travis-ci.org/dietergeerts/fabricator-builder)
[![devDependency Status](https://david-dm.org/dietergeerts/fabricator-builder/dev-status.svg)](https://david-dm.org/dietergeerts/fabricator-builder#info=devDependencies)

<p align="center">
  <img src="https://rawgit.com/dietergeerts/fabricator/master/logo.svg" width="400">
</p>

# Fabricator builder

> _fabricate_ - to make by assembling parts or sections.

Fabricator builder is a tool for building website UI toolkits - _think ["Tiny Bootstraps, for Every Client"](http://daverupert.com/2013/04/responsive-deliverables/#tiny-bootstraps-for-every-client)_

This is a builder version of the [original Fabricator project](https://github.com/fbrctr/fabricator), 
which means you create your project,  
add the needed configuration files and let Fabricator builder build your toolkit.

## Quick Start

###### Add the dependency

```
$ npm install fabricator-builder --save-dev
```

###### Build your toolkit

```javascript
// Inside your gulpfile.js

var fabricatorBuilder = require('fabricator-builder');
var gulp              = require('gulp');

gulp.task('default', function () {
    fabricatorBuilder(require('./fabricatorConfig'));
    // You can check the docs on info about the configuration.
});
```

## Documentation

#### [Read the wiki →](https://github.com/dietergeerts/fabricator-builder/wiki)

## Demo/Starter project

#### [Check out the starter project →](https://github.com/dietergeerts/fabricator-starter)
#### [Check out the demo →](http://www.dworks.be/fabricator-builder-demo/)

## Credits

Fabricator builder created by [Dieter Geerts](https://github.com/dietergeerts)

Original Fabricator created by [Luke Askew](http://twitter.com/lukeaskew)

Original Fabricator Logo by [Abby Putinski](https://abbyputinski.com/)

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)







# TODO: Place following in docs!

### Config file

The config file can just be an empty object. It's used to tell Fabricator builder what your paths and configuration is.
If nothing is specified, all required paths will be defaulted, configured in fabricatorConfig of Fabricator builder.

#### package

Specify the package.json file that needs to be used. It will be added to the Fabricator data.
The name and version are used in the title of the default layout, which is displayed in your browser tabs.

### ToolkitConfig file

The toolkitConfig file is used for two things:
 
1. To add extra data you can use in your views and pages. Access through `toolkitConfig.{insertKeyHere}`.
2. To fill in placeholders in sass files, like `/* key */` will become `key: value !default;`.

These values can be documented within atoms.global under a config material.

### Available includes

#### f-color-chip & f-color-chips

You can use includes to render color chips. like this:

```
{{#each toolkitConfig.colors}}
  {{> f-color-chips this}}
{{/each}}
```
```
{{#each this}}
{{> f-color-chip this}}
{{/each}}
```



handlebar helpers included: f-color-chip & f-color-chips

TODO: Add jshint and jsrc files with gulp task to check javascript files! Maybe configurable by project?

// ngAnnotate is lost >> We should make frameworks configurable and add steps for it!
// Maybe with an own gulp task/file that we can use here? Through an export?

// FABRICATORCONFIG.JSON ///////////////////////////////////////////////////////////////////////////////////////////////
//
// The 'required' ones, which have the following defaults:
//
//	"materials" : ["./src/materials/**/*"],
//	"data"      : ["./src/data/**/*.{json,yml}"],
//	"samples"   : ["./src/samples/**/*"],
//	"docs"      : ["./src/docs/**/*.md"],
//	"scripts"   : {  // Each prop will be a script file.
// 		"toolkit": ["./src/assets/toolkit/scripts/toolkit.js"]
// 	},
//	"styles"    : {  // Each prop will be a stylesheet file.
// 		"toolkit": ["./src/assets/toolkit/styles/toolkit.scss"] >> can do **/*.scss, because _ prefixed files will be ignored!
// 	},
//	"fonts"     : ["./src/assets/toolkit/fonts/**/*"],
//	"images"    : ["./src/assets/toolkit/images/**/*"]
//
// The 'optional' ones:
//
//  "templates"          : ['']  // If you use your own templates (from another project).
//	"dest"      :  ''   // A custom folder to build production to.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


usage example: 

'use strict';

// This file is just for testing, the real toolkit will always use gulp, and then
// start our tasks with it by calling the fabricator we have exported with index.js.

var fabricator = require('./index');
var gulp       = require('gulp');

gulp.task('default', function () {
	fabricator(require('./test/fabricatorConfig'));
});


--dev param for serve and no minification etc....
