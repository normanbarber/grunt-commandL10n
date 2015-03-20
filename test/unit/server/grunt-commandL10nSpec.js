var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	Q = require('q');

chai.use(require('sinon-chai'));

describe('Grunt task identifies unused localization key/value pairs', function() {
	process.setMaxListeners(0);	// avoid Q promise library warning

	var env = {};

	beforeEach(function() {
		env.locales = {
			'PO': 'PO',
			'lblMaterialReorderQty': 'Reorder Qty',
			'auto plan': 'Auto Plan',
			'Planning': 'Planning'
		};

		env.stats = {
			dev: 0,
			mode: 33206,
			nlink: 1,
			uid: 0,
			gid: 0,
			rdev: 0,
			ino: 0,
			size: 6785,
			atime: 'Sun Dec 28 2014',
			mtime: 'Tue Sep 21 2010',
			ctime: 'Sun Dec 28 2014'
		};

		env.walker = sinon.stub();
		env.fs = {
			stat: sinon.stub()
		};
		env.fs.stat.returns(env.stats);

		env.commandL10n = sandbox.require('../../../tasks/commandL10n', {
			requires: {
				'fs': env.fs
			}
		});
		env.grunt = {
			registerMultiTask: sinon.stub()
		};
		env.grunt.registerMultiTask.returns(env.locales);

	});

	describe('Testing Grunt Config File', function() {
		beforeEach(function() {
			var keysintersect = 'commandL10n';
			var localearray = ['key1:value1','key2:value2','key3:value3'];
			var localefilepath = 'path/to/locale/folder';
			var writefilepath = 'path/to/write/writefilepath';

			env.grunt.registerMultiTask('commandL10n', 'Identifies unused localization key/value pairs in a project', function () {})

		});
		describe('Register grunt task commandL10n', function() {

			it('should expect grunt to exist', function() {
				expect(env.grunt).to.exist;
			});

			it('should have called grunt.registerMultiTask one time', function() {
				expect(env.grunt.registerMultiTask).to.have.been.calledOnce;
			});
		});
	});
});

