'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		meta: {
			mockLocaleFolder : __dirname + '/test/mocks/localization',
			mockViewFolder : __dirname + '/test/mocks/content'
		},
		commandL10n: {
			files: {
				localization: {
					path: '<%= meta.mockLocaleFolder %>/en.json'
				},
				view: {
					path:  '<%= meta.mockViewFolder %>',
					recursive: true
				}
			},
			options: {
				write:{
					path: '<%= meta.mockLocaleFolder %>/enSoFreshSoClean.json'  // custom new filename for en.json. if options.write.path not used, then the main json file will be overwritten with updated key/value pairs
				}
			}
		}
	});
	grunt.loadTasks('tasks');
	grunt.registerTask('L10n', ['commandL10n:files']);
	grunt.registerTask('default', ['commandL10n:files']);
};
