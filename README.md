# grunt-commandL10n
> Identifies unused localization key/value pairs in a project. Recursively reads the directory and its sub-directories, comparing localization string variables from the view with the locale file(ie en.json) key/value pairs

### example code from en.json
```javascript
  {
	"PO": "PO",
	"Planning": "Planning",
	"auto plan": "Auto Plan",
	"On Hand": "On Hand"
  }
```

```shell
npm install grunt-commandL10n --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-commandL10n');
```

## Add the task - "commandL10n"

### Overview
In your project's Gruntfile, add a section named `commandL10n` to the data object passed into your config settings, `grunt.initConfig()`.

```js
grunt.initConfig({
    commandL10n: {
	files: {
	    localization: {
		path: 'path/to/your/locale/folder/en.json'
	    },
	    view: {
		path: 'path/to/your/view/folder/to/read'
	    }
	},
	options: {
	    write:{
		path: 'path/to/your/locale/folder/enSoFreshSoClean.json'  // optional
	    }
	}
})
```

### More Information
Right now, don't worry about the options unless you want the resulting json to be written to a new file or folder.
You have to set the path to your localization file (ie es.json or en-au.json) and the path to your view folder. This utility compares the localization variables from your view read with localization key/value pairs from the locale file read. The `write` object is optional. You only need this if you want to save the resulting json object to a new filename or location for some reason, or if you just don't want to overwrite your original localization file.

#### Default Options
commandL10n.files.localization.path = 'path/to/your/locale/folder/en.json'
commandL10n.files.view.path = 'path/to/your/view/folder/to/read'

#### Custom Options
commandL10n.options.write.path = 'path/to/your/locale/newfolder/newEn.json'
You only need this if you want to save the resulting json object to a new filename or new folder for some reason, or if you just don't want to overwrite your original localization file.

### Running from the command line
##### npm install and link
```javascript
	> npm link
```

##### command line example
```javascript
	> grunt L10n
```


### Running Tests unit test(server)

Using mocha, sinon and chai for unit testing server

##### In command line:

    mocha test/unit/server/grunt-commandL10nSpec --reporter spec



## License
Copyright (c) 2015 Norman Barber. Licensed under the MIT license.
