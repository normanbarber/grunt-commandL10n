'use strict';

var commandL10n = require('../lib/commandL10n.js');
var _ = require('lodash-node');
var fs = require('fs');
var walker = require('walkdir');
var walkhelper = require('../lib/walker.js');

module.exports = function (grunt) {
	var helpers = {
		pathCleanUp: function(filepath){
			return filepath.replace(/\//g,"\\");
		},
		cleanEnJSONLocales:function(locales){
			/*    method removes formatting from en.json code.
			 only need the key to compare with the locale vars pulled from the view code */
			return _.map(locales, function(str) {
				var locale = str.replace(/"/g,"'");
				locale = locale.match(/(.*)[\:]/)[0].replace(':', '').replace(/^\s+|\s+$/g, "").replace(/\\r\\n|\\|"|'|\{|\}/g,"").replace(/^\s+|\s+$/g, "");
				return locale;
			});
		}
	};

	grunt.registerMultiTask('commandL10n', 'Identifies unused localization key/value pairs in a project', function () {
		var done = this.async();
		var localefilepath = this.data.localization.path || __dirname + 'test/mocks/content/localization/en.json';
		var writefilepath = this.options().write && this.options().write.path ? this.options().write.path : localefilepath;

		localefilepath = helpers.pathCleanUp(localefilepath);
		writefilepath = helpers.pathCleanUp(writefilepath);

		var localecode = grunt.file.read(localefilepath);
		var localearray = localecode.split(',');
		var locales = helpers.cleanEnJSONLocales(localearray);

		walkhelper(this.data.view.path,function(files){
			commandL10n(files, locales, localearray, localefilepath, writefilepath)(grunt)
				.fin(function(){
					console.log('\nresults returned and written successfully');
					console.log('\nresults written to: ' + writefilepath);
				})
				.fail(function(error){
					console.log('error');
				})

		})


	});

};
