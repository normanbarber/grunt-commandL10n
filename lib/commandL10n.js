var Q = require('q');
var _ = require('lodash-node');

var helpers = {
	formatJSON: function(code){
		code = '{\r\n' + code + '\n}';
		return (code.replace(/\,(\s+)?/g, ',\r\n\t').replace(/^\s+|\s+$/g, ""));
	},
	compare: function(keysintersect,localearray){
		var matches = _.filter(localearray, function(str){
			var key = str.match(/(.*)[\:]/)[0].replace(/\:|\'/g,'').replace(/^\s+|\s+$|"/g,"");
			return  _.contains(keysintersect,key.toString()) ? str : null
		});
		return Q(helpers.formatJSON(matches));
	}
};

module.exports = function(keysintersect, localearray, localefilepath, writefilepath) {

	return function(grunt) {
		console.log('\nstep 2 0f 3: handling results.. pleast wait...\n')
		return helpers.compare(keysintersect,localearray)
			.then(function(data){
				console.log('\nstep 3 0f 3: overwriting existing en.json localization with cleaned up key/value pairs \n');
				var filepath = writefilepath ? writefilepath : localefilepath;
				grunt.file.write(filepath,data);
				return data;
			});
	}
};