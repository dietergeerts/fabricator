[![GitHub release](https://img.shields.io/github/release/dietergeerts/fabricator.svg)]()
[![Build Status](https://travis-ci.org/dietergeerts/fabricator.svg)](https://travis-ci.org/dietergeerts/fabricator)
[![devDependency Status](https://david-dm.org/dietergeerts/fabricator/dev-status.svg)](https://david-dm.org/dietergeerts/fabricator#info=devDependencies)


<p align="center">
  <img src="https://rawgit.com/dietergeerts/fabricator/master/logo.svg" width="500">
</p>

# REMARK: In Development!

I forked this from the fabricator project and transformed it so it can be used to build toolkits. So you can build your
toolkit through configuration, and this project will then build it for you. I waited to see if I could merge my changes
into the original project, but it appears that won't happen. So I'm making it a different project that will do the same
as the original, but as a builder, and try to keep it in sync with the features of the original. The rest of this readme
is still from the original though, I'll update everything asap.

# Fabricator builder

> _fabricate_ - to make by assembling parts or sections.

Fabricator builder is a tool for building website UI toolkits - _think ["Tiny Bootstraps, for Every Client"]
(http://daverupert.com/2013/04/responsive-deliverables/#tiny-bootstraps-for-every-client)_

It's a builder version of the [original Fabricator project](https://github.com/fbrctr/fabricator), which means you
create your project, add the needed configuration files and let Fabricator builder build your toolkit.

## Quick Start

### Installing Fabricator builder

```
$ npm install fabricator-builder --save-dev
```

### Setup your package.json

```javascript
{
	"scripts": {
		"prestart": "npm install",
		"start": "cd node_modules && cd fabricator-builder && npm start -- --config=\"../../fabricatorConfig.json\"" --buildConfig=\"../../toolkitConfig.json\" && cd .. && cd ..",
		"prebuild": "npm install",
		"build": "cd node_modules && cd fabricator-builder && npm run build -- --config=\"../../fabricatorConfig.json\"" --buildConfig=\"../../toolkitConfig.json\" && cd .. && cd ..",
	}
}
```

Both the config and buildConfig files are optional.

## Documentation

Also see the [original Fabricator project](https://github.com/fbrctr/fabricator) for more info. I'll only document the
build process by config and all the extra options.

### Config file

The config file can just be an empty object. It's used to tell Fabricator builder what your paths and configuration is.
If nothing is specified, all required paths will be defaulted, configured in fabricatorConfig of Fabricator builder.

#### package

Specify the package.json file that needs to be used. It will be added to the Fabricator data.
The name and version are used in the title of the default layout, which is displayed in your browser tabs.

### BuildConfig file

The buildConfig file is used to add extra data and to fill in placeholders in sass files.

## Credits

Fabricator builder created by [Dieter Geerts](http://github.com/dietergeerts).

Original Fabricator created by [Luke Askew](http://twitter.com/lukeaskew).

Original Fabricator Logo by [Abby Putinski](https://abbyputinski.com/).

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)
