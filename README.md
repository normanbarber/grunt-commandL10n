# grunt-commandL10n
> NOTE: currently in development. working thru some things

Identifies unused localization key/value pairs in a project. Recursively reads the directory and its sub-directories, comparing localization string variables from the view with the locale file(ie en.json) key/value pairs


```shell
npm install grunt-commandl10n --save-dev
```

Once the plugin has been installed, add this line to your Gruntfile:

```js
grunt.loadNpmTasks('grunt-commandl10n');
```

### Add the task - "commandL10n"
Register a new task
```js
grunt.registerTask('L10n', ['commandL10n:files']);
```

### Update the config settings
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
    }
})
```

### More Information
Right now, don't worry about the options unless you want the resulting json to be written to a new file or folder.
You do however, have to set the path to your localization file (ie en.json, es.json  en-au.json) and the path to your view folder in the gruntfile.js.

This utility compares the localization variables from your view read with localization key/value pairs from the locale file read. The write path is optional.

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
