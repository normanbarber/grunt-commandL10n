var walk= require('walkdir');
var path = require('path');
var _ = require('lodash-node');
var fs = require('fs');
var Q = require('q');
module.exports = function(viewfolder,callback) {
	console.log('\nstep 1 of 3: walking folder and sub-folders returns absolute paths to files. pleast wait...\n');
	var files=[];
	walk(viewfolder, function(filepath){
		files.push(filepath);
	})
	.on('error',function(error){
		grunt.log.error('The folder you are trying to read from is either misspelled or does not exist');
		grunt.log.error('This is causing the error -> ' + error);
	})
	.on('end', function(){
		return callback(files);
	});
};