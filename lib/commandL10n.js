var Q = require('q');
var _ = require('lodash-node');
var fs = require('fs');

var helpers = {
	formatJSON: function(code){
		code = '{\r\n\t' + code + '\n}';
		return (code.replace(/\,(\s+)?/g, ',\r\n\t').replace(/^\s+|\s+$/g, "")).replace(/'/g,'"');
	},
	getFiles: function(files){

		var all = [];
		var promise
		_.each(files, function(file){
			promise = Q.nfcall(fs.stat, file)
				.then(function(data){
					if(!data.isDirectory()){
						return Q(file);
					}
				});
			all.push(promise);
		});

		return Q.allSettled(all)
			.then(function(promises){
				return Q(_.map(promises, Q.nearer))
			});
	},
	readFiles: function(files){
		var all = [];
		var promise;
		_.each(files, function(file){
			if(file.state === 'fulfilled'){
				promise = Q.nfcall(fs.readFile, file.value, 'utf-8')
					.then(function(data){
						return Q(data);
					});
				all.push(promise);
			}
		})

		return Q.allSettled(all)
			.then(function(promises){
				return Q(_.map(promises, Q.nearer))
			})
	},
	matchViewLocales: function(viewcode){
		/*    method removes formatting from view code.
		 only need the localization variables so it runs a match() for those and removes
		 the underscores and curly braces and everything except for tha valued
		 needed to compare with the en.json keys */
		var all = [];
		_.each(viewcode, function(file){
				if(file.state === 'fulfilled') {
					var code = file.value.replace(/"/g, "'");
					var matches = code.match(/#({__\(\'(.*?)\'\)})/g);
					var viewlocalekeys = helpers.cleanUpViewLocales(matches);
					all.push(viewlocalekeys);
				}
		})
		return _.flatten(all);

	},
	cleanUpViewLocales:function(matches){
		return _.map(matches, function(match){
			return match.replace(/#\{__\(|\)\}|\\|'/g,"");
		})
	},
	removeUnused:function(localekeys,viewkeyscombined){
		return _.intersection(viewkeyscombined,localekeys);
	},
	compare: function(keysintersect,localearray){
		var matches = _.filter(localearray, function(str){
			var key = str.match(/(.*)[\:]/)[0].replace(/\:|\'/g,'').replace(/^\s+|\s+$|"/g,"");
			return  _.contains(keysintersect,key.toString()) ? str : null
		});
		return Q(helpers.formatJSON(matches));
	}
};

module.exports = function(files, locales, localearray, localefilepath, writefilepath) {

	return function(grunt) {
		console.log('\nstep 2 0f 3: handling results.. pleast wait...\n')

		// get paths to all files and exclude all paths to sub-directories ( this still reads the sub-dirs I do not want the path to sub-dir since fs.readFile with throw an error for this )
		return helpers.getFiles(files)
			.then(function(data){
				// readFiles returning all the code for the view files
				return helpers.readFiles(data)
			})
			.then(function(data){
				// finding all locale string variables from all view files code
				return helpers.matchViewLocales(data)
			})
			.then(function(data){
				// passing locale file keys and the view file keys returning only used keys found in both arrays
				return helpers.removeUnused(locales,data);
			})
			.then(function(data){
				return helpers.compare(data,localearray)
			})
			.then(function(data){
				console.log('\nstep 3 0f 3: overwriting existing en.json localization with cleaned up key/value pairs \n');
				var filepath = writefilepath ? writefilepath : localefilepath;
				grunt.file.write(filepath,data);
				return Q(data);
			});
	}
};