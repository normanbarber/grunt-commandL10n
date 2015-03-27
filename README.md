# grunt-commandL10n
> Identifies unused localization key/value pairs in a project. Recursively reads the directory and its sub-directories, comparing localization string variables from the view with the locale file(ie en.json) key/value pairs

### Install the package - "grunt-commandl10n"
```shell
npm install grunt-commandl10n --save-dev
```

### Load the task - "grunt-commandl10n"
```js
grunt.loadNpmTasks('grunt-commandl10n');
```

### Register the task - "commandL10n"
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
You do have to set the path to your localization file (ie en.json, es.json  en-au.json) and the path to your view folder in the connfiguration.

Unless you want the resulting cleaned up json to be written to a new file or folder, don't worry about the options object in the configuration.


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
