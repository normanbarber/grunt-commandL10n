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
		env.paths = [{state: 'fulfilled', value:'path/to/file/1'},{state: 'fulfilled', value:'path/to/file/2'}];

		env.viewcode = 'div(class="modal-body")ul(style="list-style:none;padding:0;margin:0")li';

		env.walker = sinon.stub();
		env.fs = {
			stat: sinon.stub(),
			readFile: sinon.stub()
		};
		env.fs.stat.yields(env.paths);
		env.fs.readFile.yields(env.viewcode);

		env.grunt = {
			registerMultiTask: sinon.stub(),
			file: {
				read: sinon.stub()
			}
		};
		env.grunt.registerMultiTask.returns(env.locales);
		env.grunt.file.read.returns(env.locales);
		env.commandL10n = sandbox.require('../../../tasks/commandL10n', {
			requires: {
				'fs': env.fs,
				'grunt': env.grunt
			}
		});

		env.lib = {};
		env.lib.commandL10n = sandbox.require('../../../lib/commandL10n', {
			requires: {
				'fs': env.fs
			}
		});
	});

	describe('Testing Grunt Config File', function() {
		beforeEach(function() {
			env.commandL10n(env.grunt);
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


	describe('Testing main lib/commandL10n module', function() {
		beforeEach(function() {
			var files = ['file/path/1', 'file/path/2'];
			var locales = ['key1','key2'];
			var localearray = ['key1:value1','key2:value2','key3:value3'];
			var localefilepath = 'path/to/locale/folder';
			var writefilepath = 'path/to/write/writefilepath';
			env.lib.commandL10n(files, locales, localearray, localefilepath, writefilepath)(env.grunt);
		});
		describe('calling lib/commandL10n module', function() {
			it('should expect module to exist', function() {
				expect(env.lib.commandL10n).to.exist;
			});
			it('should have called fs.stat two times', function() {
				expect(env.fs.stat).to.have.been.calledTwice;
			});
			it('should have called fs.readFile two times', function() {
				expect(env.fs.readFile).to.have.been.calledTwice;
			});
		});
	});
});

