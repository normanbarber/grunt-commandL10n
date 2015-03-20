'use strict';

var commandL10n = require('../lib/commandL10n.js');
var _ = require('lodash-node');
var fs = require('fs');
var walker = require('walkdir');

module.exports = function (grunt) {
	var helpers = {
		pathCleanUp: function(filepath){
			return filepath.replace(/\//g,"\\");
		},
		cleanUpViewLocales:function(matches){
			return _.map(matches, function(match){
				return match.replace(/\{__\(|\)\}|\\|'/g,"");
			})
		},
		matchViewLocales:function(viewcode){
			/*    method removes formatting from view code.
			 only need the localization variables so it runs a match() for those and removes
			 the underscores and curly braces and everything except for tha valued
			 needed to compare with the en.json keys */
			return _.map(viewcode, function(viewlocale) {
				var code = viewlocale.replace(/"/g,"'");
				var matches = code.match(/({__\(\'(.*)\')/g);
				var viewlocalekeys = helpers.cleanUpViewLocales(matches);
				return viewlocalekeys;
			});

		},
		cleanEnJSONLocales:function(locales){
			/*    method removes formatting from en.json code.
			 only need the key to compare with the locale vars pulled from the view code */
			var code = locales.replace(/\r|\n|\t|^\s+|\s+$|"|'|\{|\}/g,"");
			var locales = code.split(',');
			return _.map(locales, function(str) {
				var locale = str.replace(/"/g,"'");
				locale = locale.match(/(.*)[\:]/)[0].replace(':', '').replace(/^\s+|\s+$/g, "").replace(/\\r\\n|\\/g,"").replace(/^\s+|\s+$/g, "")
				return locale;
			});
		},
		findWidows:function(localekeys,viewkeyscombined){
			/*    this method will find any key vars in the view that have not been added to the en.json
			 option1 - automatically add them to the en.json using the var name for both the key/value
			 option2 - log a warn message in the console */
			return _.difference(viewkeyscombined,localekeys);
		}
	};

	grunt.registerMultiTask('commandL10n', 'Identifies unused localization key/value pairs in a project', function () {
		var done = this.async();
		var localefilepath = this.data.localization.path || __dirname + 'test/mocks/content/localization/en.json';
		var writefilepath = this.options().write && this.options().write.path ? this.options().write.path : localefilepath;

		localefilepath = helpers.pathCleanUp(localefilepath);
		writefilepath = helpers.pathCleanUp(writefilepath);

		var files = [];
		var localecode = grunt.file.read(localefilepath).replace(/"/g,"'").replace(/\r|\n|\t|\{|\}/g,"");
		var localearray = localecode.split(',');
		var localedata =
		{
			viewcode:[],
			viewkeys:[],
			viewkeyscombined:[],
			localekeys:[],
			keysintersect:[],
			widows:[]
		};

		walker(this.data.view.path, function(filepath){
			if(filepath){
				fs.stat(filepath, function(error, data){

					if(!data.isDirectory()){
						localedata.viewcode.push(grunt.file.read(filepath));
						localedata.viewkeys = helpers.matchViewLocales(localedata.viewcode);
						localedata.viewkeyscombined = _.flatten(localedata.viewkeys);

						localedata.localekeys = helpers.cleanEnJSONLocales(JSON.stringify(localecode));

						localedata.keysintersect = _.intersection(localedata.viewkeyscombined,localedata.localekeys);
						localedata.widows = helpers.findWidows(localedata.localekeys,localedata.viewkeyscombined);
						localecode = localecode.replace(/"/g,"'").replace(/\r|\n|\t|\{|\}/g,"");
						localearray = localecode.split(',');
						done();
					}

				})
			}

		})
		.on('error',function(error){
			grunt.log.error('The folder you are trying to read from is either misspelled or does not exist');
			grunt.log.error('This is causing the error -> ' + error);
		})
		.on('end', function(){
			if(!localedata.keysintersect || localedata.keysintersect.length <= 0){
				grunt.log.error('Error');
				grunt.log.error('no localization vars found in view files match the keys in your main localization file');
				return false;
			}
			commandL10n(localedata.keysintersect, localearray, localefilepath, writefilepath)(grunt)
				.fin(function(data){
					console.log('\nresults returned and written successfully');
					console.log('\nresults written to: ' + writefilepath);
					if(data)
						console.log(data);

				})
				.fail(function(error){
					console.log('errror');
				})

		});

	});

};
