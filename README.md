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
