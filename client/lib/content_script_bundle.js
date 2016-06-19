/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
	// http://wonko.com/post/html-escaping

	var escapeHtml = __webpack_require__(11);

	var SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g;
	var win = typeof global !== 'undefined' ? global : window;

	var util = undefined;
	var toString = Object.prototype.toString;
	module.exports = util = {
	  isArray: Array.isArray || function (obj) {
	    return toString.call(obj) === '[object Array]';
	  },

	  keys: Object.keys || function (o) {
	    var result = [];
	    var p = undefined;

	    for (p in o) {
	      result.push(p);
	    }

	    return result;
	  },

	  each: function each(object, fn) {
	    var context = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	    if (object) {
	      var key = undefined;
	      var val = undefined;
	      var keys = undefined;
	      var i = 0;
	      var _length = object && object.length;
	      // do not use typeof obj == 'function': bug in phantomjs
	      var isObj = _length === undefined || Object.prototype.toString.call(object) === '[object Function]';

	      if (isObj) {
	        keys = util.keys(object);
	        for (; i < keys.length; i++) {
	          key = keys[i];
	          // can not use hasOwnProperty
	          if (fn.call(context, object[key], key, object) === false) {
	            break;
	          }
	        }
	      } else {
	        for (val = object[0]; i < _length; val = object[++i]) {
	          if (fn.call(context, val, i, object) === false) {
	            break;
	          }
	        }
	      }
	    }
	    return object;
	  },

	  mix: function mix(t, s) {
	    if (s) {
	      for (var p in s) {
	        t[p] = s[p];
	      }
	    }
	    return t;
	  },

	  globalEval: function globalEval(data) {
	    if (win.execScript) {
	      win.execScript(data);
	    } else {
	      (function (d) {
	        win.eval.call(win, d);
	      })(data);
	    }
	  },

	  substitute: function substitute(str, o, regexp) {
	    if (typeof str !== 'string' || !o) {
	      return str;
	    }

	    return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
	      if (match.charAt(0) === '\\') {
	        return match.slice(1);
	      }
	      return o[name] === undefined ? '' : o[name];
	    });
	  },

	  escapeHtml: escapeHtml,

	  merge: function merge() {
	    var i = 0;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var len = args.length;
	    var ret = {};
	    for (; i < len; i++) {
	      var arg = args[i];
	      if (arg) {
	        util.mix(ret, arg);
	      }
	    }
	    return ret;
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * scope resolution for xtemplate like function in javascript but keep original data unmodified
	 */

	'use strict';

	function Scope(data, affix, parent) {
	  if (data !== undefined) {
	    this.data = data;
	  } else {
	    this.data = {};
	  }
	  if (parent) {
	    this.parent = parent;
	    this.root = parent.root;
	  } else {
	    this.parent = undefined;
	    this.root = this;
	  }
	  this.affix = affix || {};
	  this.ready = false;
	}

	Scope.prototype = {
	  isScope: 1,

	  constructor: Scope,

	  setParent: function setParent(parentScope) {
	    this.parent = parentScope;
	    this.root = parentScope.root;
	  },

	  // keep original data unmodified
	  set: function set(name, value) {
	    this.affix[name] = value;
	  },

	  setData: function setData(data) {
	    this.data = data;
	  },

	  getData: function getData() {
	    return this.data;
	  },

	  mix: function mix(v) {
	    var affix = this.affix;
	    for (var _name in v) {
	      affix[_name] = v[_name];
	    }
	  },

	  get: function get(name) {
	    var data = this.data;
	    var v = undefined;
	    var affix = this.affix;

	    if (data !== null && data !== undefined) {
	      v = data[name];
	    }

	    if (v !== undefined) {
	      return v;
	    }

	    return affix[name];
	  },

	  resolveInternalOuter: function resolveInternalOuter(parts) {
	    var part0 = parts[0];
	    var v = undefined;
	    var self = this;
	    var scope = self;
	    if (part0 === 'this') {
	      v = self.data;
	    } else if (part0 === 'root') {
	      scope = scope.root;
	      v = scope.data;
	    } else if (part0) {
	      do {
	        v = scope.get(part0);
	      } while (v === undefined && (scope = scope.parent));
	    } else {
	      return [scope.data];
	    }
	    return [undefined, v];
	  },

	  resolveInternal: function resolveInternal(parts) {
	    var ret = this.resolveInternalOuter(parts);
	    if (ret.length === 1) {
	      return ret[0];
	    }
	    var i = undefined;
	    var len = parts.length;
	    var v = ret[1];
	    if (v === undefined) {
	      return undefined;
	    }
	    for (i = 1; i < len; i++) {
	      if (v === null || v === undefined) {
	        return v;
	      }
	      v = v[parts[i]];
	    }
	    return v;
	  },

	  resolveLooseInternal: function resolveLooseInternal(parts) {
	    var ret = this.resolveInternalOuter(parts);
	    if (ret.length === 1) {
	      return ret[0];
	    }
	    var i = undefined;
	    var len = parts.length;
	    var v = ret[1];
	    for (i = 1; v !== null && v !== undefined && i < len; i++) {
	      v = v[parts[i]];
	    }
	    return v;
	  },

	  resolveUp: function resolveUp(parts) {
	    return this.parent && this.parent.resolveInternal(parts);
	  },

	  resolveLooseUp: function resolveLooseUp(parts) {
	    return this.parent && this.parent.resolveLooseInternal(parts);
	  },

	  resolveOuter: function resolveOuter(parts, d) {
	    var self = this;
	    var scope = self;
	    var depth = d;
	    var v = undefined;
	    if (!depth && parts.length === 1) {
	      v = self.get(parts[0]);
	      if (v !== undefined) {
	        return [v];
	      }
	      depth = 1;
	    }
	    if (depth) {
	      while (scope && depth--) {
	        scope = scope.parent;
	      }
	    }
	    if (!scope) {
	      return [undefined];
	    }
	    return [undefined, scope];
	  },

	  resolveLoose: function resolveLoose(parts, depth) {
	    var ret = this.resolveOuter(parts, depth);
	    if (ret.length === 1) {
	      return ret[0];
	    }
	    return ret[1].resolveLooseInternal(parts);
	  },

	  resolve: function resolve(parts, depth) {
	    var ret = this.resolveOuter(parts, depth);
	    if (ret.length === 1) {
	      return ret[0];
	    }
	    return ret[1].resolveInternal(parts);
	  }
	};

	module.exports = Scope;

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * xtemplate runtime
	 */

	'use strict';

	var util = __webpack_require__(0);
	var nativeCommands = __webpack_require__(9);
	var commands = {};
	var Scope = __webpack_require__(1);
	var LinkedBuffer = __webpack_require__(10);

	// for performance: reduce hidden class
	function TplWrap(name, runtime, root, scope, buffer, originalName, fn, parent) {
	  this.name = name;
	  this.originalName = originalName || name;
	  this.runtime = runtime;
	  this.root = root;
	  // line counter
	  this.pos = { line: 1 };
	  this.scope = scope;
	  this.buffer = buffer;
	  this.fn = fn;
	  this.parent = parent;
	}

	function findCommand(runtimeCommands, instanceCommands, parts) {
	  var name = parts[0];
	  var cmd = runtimeCommands && runtimeCommands[name] || instanceCommands && instanceCommands[name] || commands[name];
	  if (parts.length === 1) {
	    return cmd;
	  }
	  if (cmd) {
	    var len = parts.length;
	    for (var i = 1; i < len; i++) {
	      cmd = cmd[parts[i]];
	      if (!cmd) {
	        return false;
	      }
	    }
	  }
	  return cmd;
	}

	function getSubNameFromParentName(parentName, subName) {
	  var parts = parentName.split('/');
	  var subParts = subName.split('/');
	  parts.pop();
	  for (var i = 0, l = subParts.length; i < l; i++) {
	    var subPart = subParts[i];
	    if (subPart === '.') {
	      continue;
	    } else if (subPart === '..') {
	      parts.pop();
	    } else {
	      parts.push(subPart);
	    }
	  }
	  return parts.join('/');
	}

	// depth: ../x.y() => 1
	function callFn(tpl, scope, option, buffer, parts, depth) {
	  var caller = undefined;
	  var fn = undefined;
	  var command1 = undefined;
	  if (!depth) {
	    command1 = findCommand(tpl.runtime.commands, tpl.root.config.commands, parts);
	  }
	  if (command1) {
	    return command1.call(tpl, scope, option, buffer);
	  } else if (command1 !== false) {
	    var callerParts = parts.slice(0, -1);
	    caller = scope.resolve(callerParts, depth);
	    if (caller === null || caller === undefined) {
	      buffer.error('Execute function `' + parts.join('.') + '` Error: ' + callerParts.join('.') + ' is undefined or null');
	      return buffer;
	    }
	    fn = caller[parts[parts.length - 1]];
	    if (fn) {
	      // apply(x, undefined) error in ie8
	      try {
	        return fn.apply(caller, option.params || []);
	      } catch (err) {
	        buffer.error('Execute function `' + parts.join('.') + '` Error: ' + err.message);
	        return buffer;
	      }
	    }
	  }
	  buffer.error('Command Not Found: ' + parts.join('.'));
	  return buffer;
	}

	var utils = {
	  callFn: callFn,

	  // {{y().z()}}
	  callDataFn: function callDataFn(params, parts) {
	    var caller = parts[0];
	    var fn = caller;
	    for (var i = 1; i < parts.length; i++) {
	      var _name = parts[i];
	      if (fn && fn[_name]) {
	        caller = fn;
	        fn = fn[_name];
	      } else {
	        return '';
	      }
	    }
	    return fn.apply(caller, params || []);
	  },

	  callCommand: function callCommand(tpl, scope, option, buffer, parts) {
	    return callFn(tpl, scope, option, buffer, parts);
	  }
	};

	/**
	 * template file name for chrome debug
	 *
	 * @cfg {Boolean} name
	 * @member XTemplate.Runtime
	 */

	/**
	 * XTemplate runtime. only accept tpl as function.
	 * @class XTemplate.Runtime
	 */
	function XTemplateRuntime(fn, config) {
	  this.fn = fn;
	  this.config = util.merge(XTemplateRuntime.globalConfig, config);
	  this.subNameResolveCache = {};
	  this.loadedSubTplNames = {};
	}

	util.mix(XTemplateRuntime, {
	  config: function config(key, v) {
	    var globalConfig = this.globalConfig = this.globalConfig || {};
	    if (key !== undefined) {
	      if (v !== undefined) {
	        globalConfig[key] = v;
	      } else {
	        util.mix(globalConfig, key);
	      }
	    } else {
	      return globalConfig;
	    }
	  },

	  nativeCommands: nativeCommands,

	  utils: utils,

	  util: util,

	  /**
	   * add command to all template
	   * @method
	   * @static
	   * @param {String} commandName
	   * @param {Function} fn
	   * @member XTemplate.Runtime
	   */
	  addCommand: function addCommand(commandName, fn) {
	    commands[commandName] = fn;
	  },

	  /**
	   * remove command from all template by name
	   * @method
	   * @static
	   * @param {String} commandName
	   * @member XTemplate.Runtime
	   */
	  removeCommand: function removeCommand(commandName) {
	    delete commands[commandName];
	  }
	});

	function resolve(root, subName_, parentName) {
	  var subName = subName_;
	  if (subName.charAt(0) !== '.') {
	    return subName;
	  }
	  var key = parentName + '_ks_' + subName;
	  var nameResolveCache = root.subNameResolveCache;
	  var cached = nameResolveCache[key];
	  if (cached) {
	    return cached;
	  }
	  subName = nameResolveCache[key] = getSubNameFromParentName(parentName, subName);
	  return subName;
	}

	function loadInternal(root, name, runtime, scope, buffer, originalName, escape, parentTpl) {
	  var tpl = new TplWrap(name, runtime, root, scope, buffer, originalName, undefined, parentTpl);
	  buffer.tpl = tpl;
	  root.config.loader.load(tpl, function (error, tplFn_) {
	    var tplFn = tplFn_;
	    if (typeof tplFn === 'function') {
	      tpl.fn = tplFn;
	      // reduce count of object field for performance
	      renderTpl(tpl);
	    } else if (error) {
	      buffer.error(error);
	    } else {
	      tplFn = tplFn || '';
	      if (escape) {
	        buffer.writeEscaped(tplFn);
	      } else {
	        buffer.data += tplFn;
	      }
	      buffer.end();
	    }
	  });
	}

	function includeInternal(root, scope, escape, buffer, tpl, originalName) {
	  var name = resolve(root, originalName, tpl.name);
	  var newBuffer = buffer.insert();
	  var next = newBuffer.next;
	  loadInternal(root, name, tpl.runtime, scope, newBuffer, originalName, escape, buffer.tpl);
	  return next;
	}

	function includeModuleInternal(root, scope, buffer, tpl, tplFn) {
	  var newBuffer = buffer.insert();
	  var next = newBuffer.next;
	  var newTpl = new TplWrap(tplFn.TPL_NAME, tpl.runtime, root, scope, newBuffer, undefined, tplFn, buffer.tpl);
	  newBuffer.tpl = newTpl;
	  renderTpl(newTpl);
	  return next;
	}

	function renderTpl(tpl) {
	  var buffer = tpl.fn();
	  // tpl.fn exception
	  if (buffer) {
	    var runtime = tpl.runtime;
	    var extendTpl = runtime.extendTpl;
	    var extendTplName = undefined;
	    if (extendTpl) {
	      extendTplName = extendTpl.params[0];
	      if (!extendTplName) {
	        return buffer.error('extend command required a non-empty parameter');
	      }
	    }
	    var extendTplFn = runtime.extendTplFn;
	    var extendTplBuffer = runtime.extendTplBuffer;
	    // if has extend statement, only parse
	    if (extendTplFn) {
	      runtime.extendTpl = null;
	      runtime.extendTplBuffer = null;
	      runtime.extendTplFn = null;
	      includeModuleInternal(tpl.root, tpl.scope, extendTplBuffer, tpl, extendTplFn).end();
	    } else if (extendTplName) {
	      runtime.extendTpl = null;
	      runtime.extendTplBuffer = null;
	      includeInternal(tpl.root, tpl.scope, 0, extendTplBuffer, tpl, extendTplName).end();
	    }
	    return buffer.end();
	  }
	}

	function getIncludeScope(scope, option, buffer) {
	  var params = option.params;
	  if (!params[0]) {
	    return buffer.error('include command required a non-empty parameter');
	  }
	  var newScope = scope;
	  var newScopeData = params[1];
	  var hash = option.hash;
	  if (hash) {
	    if (newScopeData) {
	      newScopeData = util.mix({}, newScopeData);
	    } else {
	      newScopeData = {};
	    }
	    util.mix(newScopeData, hash);
	  }
	  // sub template scope
	  if (newScopeData) {
	    newScope = new Scope(newScopeData, undefined, scope);
	  }
	  return newScope;
	}

	function checkIncludeOnce(root, option, tpl) {
	  var originalName = option.params[0];
	  var name = resolve(root, originalName, tpl.name);
	  var loadedSubTplNames = root.loadedSubTplNames;

	  if (loadedSubTplNames[name]) {
	    return false;
	  }
	  loadedSubTplNames[name] = true;
	  return true;
	}

	XTemplateRuntime.prototype = {
	  constructor: XTemplateRuntime,

	  Scope: Scope,

	  nativeCommands: nativeCommands,

	  utils: utils,

	  /**
	   * remove command by name
	   * @param commandName
	   */
	  removeCommand: function removeCommand(commandName) {
	    var config = this.config;
	    if (config.commands) {
	      delete config.commands[commandName];
	    }
	  },

	  /**
	   * add command definition to current template
	   * @param commandName
	   * @param {Function} fn command definition
	   */
	  addCommand: function addCommand(commandName, fn) {
	    var config = this.config;
	    config.commands = config.commands || {};
	    config.commands[commandName] = fn;
	  },

	  include: function include(scope, option, buffer, tpl) {
	    return includeInternal(this, getIncludeScope(scope, option, buffer), option.escape, buffer, tpl, option.params[0]);
	  },

	  includeModule: function includeModule(scope, option, buffer, tpl) {
	    return includeModuleInternal(this, getIncludeScope(scope, option, buffer), buffer, tpl, option.params[0]);
	  },

	  includeOnce: function includeOnce(scope, option, buffer, tpl) {
	    if (checkIncludeOnce(this, option, tpl)) {
	      return this.include(scope, option, buffer, tpl);
	    }
	    return buffer;
	  },

	  includeOnceModule: function includeOnceModule(scope, option, buffer, tpl) {
	    if (checkIncludeOnce(this, option, tpl)) {
	      return this.includeModule(scope, option, buffer, tpl);
	    }
	    return buffer;
	  },

	  /**
	   * get result by merge data with template
	   */
	  render: function render(data, option_, callback_) {
	    var _this = this;

	    var option = option_;
	    var callback = callback_;
	    var html = '';
	    var fn = this.fn;
	    var config = this.config;
	    if (typeof option === 'function') {
	      callback = option;
	      option = null;
	    }
	    option = option || {};
	    if (!callback) {
	      callback = function callback(error_, ret) {
	        var error = error_;
	        if (error) {
	          if (!(error instanceof Error)) {
	            error = new Error(error);
	          }
	          throw error;
	        }
	        html = ret;
	      };
	    }
	    var name = this.config.name;
	    if (!name && fn && fn.TPL_NAME) {
	      name = fn.TPL_NAME;
	    }
	    var scope = undefined;
	    if (data instanceof Scope) {
	      scope = data;
	    } else {
	      scope = new Scope(data);
	    }
	    var buffer = new XTemplateRuntime.LinkedBuffer(callback, config).head;
	    var tpl = new TplWrap(name, {
	      commands: option.commands
	    }, this, scope, buffer, name, fn);
	    buffer.tpl = tpl;
	    if (!fn) {
	      config.loader.load(tpl, function (err, fn2) {
	        if (fn2) {
	          tpl.fn = _this.fn = fn2;
	          renderTpl(tpl);
	        } else if (err) {
	          buffer.error(err);
	        }
	      });
	      return html;
	    }
	    renderTpl(tpl);
	    return html;
	  }
	};

	XTemplateRuntime.Scope = Scope;
	XTemplateRuntime.LinkedBuffer = LinkedBuffer;

	module.exports = XTemplateRuntime;

	/**
	 * @ignore
	 *
	 * 2012-09-12 yiminghe@gmail.com
	 *  - 参考 velocity, 扩充 ast
	 *  - Expression/ConditionalOrExpression
	 *  - EqualityExpression/RelationalExpression...
	 *
	 * 2012-09-11 yiminghe@gmail.com
	 *  - 初步完成，添加 tc
	 *
	 * 对比 template
	 *
	 *  优势
	 *      - 不会莫名其妙报错（with）
	 *      - 更多出错信息，直接给出行号
	 *      - 更容易扩展 command, sub-tpl
	 *      - 支持子模板
	 *      - 支持作用域链: ..\x ..\..\y
	 *      - 内置 escapeHtml 支持
	 *      - 支持预编译
	 *      - 支持简单表达式 +-/%* ()
	 *      - 支持简单比较 === !===
	 *      - 支持类似函数的嵌套命令
	 *   劣势
	 *      - 不支持完整 js 语法
	 */

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function (undefined){
	  var t;
	var t0;
	var t1;
	var t2;
	var t3;
	var t4;
	var t5;
	var t6;
	var t7;
	var t8;
	var t9;
	var tpl = this;
	  var root = tpl.root;
	  var buffer = tpl.buffer;
	  var scope = tpl.scope;
	  var runtime = tpl.runtime;
	  var name = tpl.name;
	  var pos = tpl.pos;
	  var data = scope.data;
	  var affix = scope.affix;
	  var nativeCommands = root.nativeCommands;
	  var utils = root.utils;
	var callFnUtil = utils["callFn"];
	var callDataFnUtil = utils["callDataFn"];
	var callCommandUtil = utils["callCommand"];
	var rangeCommand = nativeCommands["range"];
	var voidCommand = nativeCommands["void"];
	var foreachCommand = nativeCommands["foreach"];
	var forinCommand = nativeCommands["forin"];
	var eachCommand = nativeCommands["each"];
	var withCommand = nativeCommands["with"];
	var ifCommand = nativeCommands["if"];
	var setCommand = nativeCommands["set"];
	var includeCommand = nativeCommands["include"];
	var includeOnceCommand = nativeCommands["includeOnce"];
	var parseCommand = nativeCommands["parse"];
	var extendCommand = nativeCommands["extend"];
	var blockCommand = nativeCommands["block"];
	var macroCommand = nativeCommands["macro"];
	var debuggerCommand = nativeCommands["debugger"];


	buffer.data += '<!DOCTYPE html>\n\n<html lang="en">\n\n<head>\n  <meta charset="UTF-8">\n  <title>viewH5page</title>\n  <style>\n    .haha {\n      color: red;\n    }\n\n    .demo {\n      width: 433px;\n      height: 884px;\n      background: url(http://gtms02.alicdn.com/tps/i2/TB1EcmDGFXXXXXLXVXXK6Ax3pXX-433-884.png) no-repeat 0 0;\n    }\n\n    #J_Frame {\n      margin-left: 29px;\n      margin-top: 183px;\n      width: 375px;\n      height: 592px;\n    }\n  </style>\n</head>\n\n<body>\n  <div class="haha">1</div>\n  <div class="demo">\n    <iframe src="https://www.taobao.com/markets/hi/hongxing1_copy" name="J_Frame" class="frame" id="J_Frame" frameborder="0"></iframe>\n  </div>\n</body>\n\n</html>\n';
	return buffer;
	}

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 高能预警：
	// 内容脚本不能：
	// 调用 chrome.* API，除了以下 API：
	// extension（getURL、inIncognitoContext、lastError、onRequest、sendRequest）
	// i18n
	// runtime（connect、getManifest、getURL、id、onConnect、onMessage、sendMessage）
	// storage
	// 使用所属扩展程序页面中定义的变量或函数
	// 使用网页或其他内容脚本中定义的变量或函数
	var tpl = __webpack_require__(6);
	var Xtemplate = __webpack_require__(5);

	console.log('plugin client running');
	chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
		if (request.type == "plugin:error") {
			console.log(request.msg);
			console.log(request.context);
		}
	});

	var viewH5 = function viewH5() {
		var newDoc = document.open("text/html", "replace");
		newDoc.write(new Xtemplate(tpl).render({}));
		newDoc.close();
		// $('html').empty();
		//
		// $('html').html(new Xtemplate(tpl).render({}));// jquery bug , body tag lost
		//
		// $('body').append('<div class="demo" ><iframe id="J_Frame" frameborder="0" src="https://www.taobao.com/markets/hi/hongxing1_copy"></iframe></div>');
	};
	chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
		if (request.type == "plugin:viewH5") {
			viewH5();
		}
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * native commands for xtemplate.
	 */

	'use strict';

	var Scope = __webpack_require__(1);
	var util = __webpack_require__(0);
	var commands = {
	  // range(start, stop, [step])
	  range: function range(scope, option) {
	    var params = option.params;
	    var start = params[0];
	    var end = params[1];
	    var step = params[2];
	    if (!step) {
	      step = start > end ? -1 : 1;
	    } else if (start > end && step > 0 || start < end && step < 0) {
	      step = -step;
	    }
	    var ret = [];
	    for (var i = start; start < end ? i < end : i > end; i += step) {
	      ret.push(i);
	    }
	    return ret;
	  },

	  'void': function _void() {
	    return undefined;
	  },

	  foreach: function foreach(scope, option, buffer_) {
	    var buffer = buffer_;
	    var params = option.params;
	    var param0 = params[0];
	    var xindexName = params[2] || 'xindex';
	    var valueName = params[1];
	    var xcount = undefined;
	    var opScope = undefined;
	    var affix = undefined;
	    var xindex = undefined;
	    if (param0) {
	      xcount = param0.length;
	      for (xindex = 0; xindex < xcount; xindex++) {
	        opScope = new Scope(param0[xindex], {
	          xcount: xcount,
	          xindex: xindex
	        }, scope);
	        affix = opScope.affix;
	        if (xindexName !== 'xindex') {
	          affix[xindexName] = xindex;
	          affix.xindex = undefined;
	        }
	        if (valueName) {
	          affix[valueName] = param0[xindex];
	        }
	        buffer = option.fn(opScope, buffer);
	      }
	    }
	    return buffer;
	  },

	  forin: function forin(scope, option, buffer_) {
	    var buffer = buffer_;
	    var params = option.params;
	    var param0 = params[0];
	    var xindexName = params[2] || 'xindex';
	    var valueName = params[1];
	    var opScope = undefined;
	    var affix = undefined;
	    var name = undefined;
	    // if undefined, will emit warning by compiler
	    if (param0) {
	      for (name in param0) {
	        opScope = new Scope(param0[name], {
	          xindex: name
	        }, scope);
	        affix = opScope.affix;
	        if (xindexName !== 'xindex') {
	          affix[xindexName] = name;
	          affix.xindex = undefined;
	        }
	        if (valueName) {
	          affix[valueName] = param0[name];
	        }
	        buffer = option.fn(opScope, buffer);
	      }
	    }
	    return buffer;
	  },

	  each: function each(scope, option, buffer) {
	    var params = option.params;
	    var param0 = params[0];
	    if (param0) {
	      if (util.isArray(param0)) {
	        return commands.foreach(scope, option, buffer);
	      }
	      return commands.forin(scope, option, buffer);
	    }
	    return buffer;
	  },

	  'with': function _with(scope, option, buffer_) {
	    var buffer = buffer_;
	    var params = option.params;
	    var param0 = params[0];
	    if (param0) {
	      // skip object check for performance
	      var opScope = new Scope(param0, undefined, scope);
	      buffer = option.fn(opScope, buffer);
	    }
	    return buffer;
	  },

	  'if': function _if(scope, option, buffer_) {
	    var buffer = buffer_;
	    var params = option.params;
	    var param0 = params[0];
	    if (param0) {
	      var fn = option.fn;
	      if (fn) {
	        buffer = fn(scope, buffer);
	      }
	    } else {
	      var matchElseIf = false;
	      var elseIfs = option.elseIfs;
	      var inverse = option.inverse;
	      if (elseIfs) {
	        for (var i = 0, len = elseIfs.length; i < len; i++) {
	          var elseIf = elseIfs[i];
	          matchElseIf = elseIf.test(scope);
	          if (matchElseIf) {
	            buffer = elseIf.fn(scope, buffer);
	            break;
	          }
	        }
	      }
	      if (!matchElseIf && inverse) {
	        buffer = inverse(scope, buffer);
	      }
	    }
	    return buffer;
	  },

	  set: function set(scope_, option, buffer) {
	    var scope = scope_;
	    var hash = option.hash;
	    var len = hash.length;
	    for (var i = 0; i < len; i++) {
	      var h = hash[i];
	      var parts = h.key;
	      var depth = h.depth;
	      var value = h.value;
	      if (parts.length === 1) {
	        var root = scope.root;
	        while (depth && root !== scope) {
	          scope = scope.parent;
	          --depth;
	        }
	        scope.set(parts[0], value);
	      } else {
	        var last = scope.resolve(parts.slice(0, -1), depth);
	        if (last) {
	          last[parts[parts.length - 1]] = value;
	        }
	      }
	    }
	    return buffer;
	  },

	  include: 1,

	  includeOnce: 1,

	  parse: 1,

	  extend: 1,

	  block: function block(scope, option, buffer_) {
	    var buffer = buffer_;
	    var self = this;
	    var runtime = self.runtime;
	    var params = option.params;
	    var blockName = params[0];
	    var type = undefined;
	    if (params.length === 2) {
	      type = params[0];
	      blockName = params[1];
	    }
	    var blocks = runtime.blocks = runtime.blocks || {};
	    var head = blocks[blockName];
	    var cursor = undefined;
	    var current = {
	      fn: option.fn,
	      type: type
	    };
	    if (!head) {
	      blocks[blockName] = current;
	    } else if (head.type) {
	      if (head.type === 'append') {
	        current.next = head;
	        blocks[blockName] = current;
	      } else if (head.type === 'prepend') {
	        var prev = undefined;
	        cursor = head;
	        while (cursor && cursor.type === 'prepend') {
	          prev = cursor;
	          cursor = cursor.next;
	        }
	        current.next = cursor;
	        prev.next = current;
	      }
	    }

	    if (!runtime.extendTpl) {
	      cursor = blocks[blockName];
	      while (cursor) {
	        if (cursor.fn) {
	          buffer = cursor.fn.call(self, scope, buffer);
	        }
	        cursor = cursor.next;
	      }
	    }

	    return buffer;
	  },

	  macro: function macro(scope, option, buffer_) {
	    var buffer = buffer_;
	    var hash = option.hash;
	    var params = option.params;
	    var macroName = params[0];
	    var params1 = params.slice(1);
	    var self = this;
	    var runtime = self.runtime;
	    var macros = runtime.macros = runtime.macros || {};
	    var macro = macros[macroName];
	    // definition
	    if (option.fn) {
	      macros[macroName] = {
	        paramNames: params1,
	        hash: hash,
	        fn: option.fn
	      };
	    } else if (macro) {
	      var paramValues = macro.hash || {};
	      var paramNames = undefined;
	      if (paramNames = macro.paramNames) {
	        for (var i = 0, len = paramNames.length; i < len; i++) {
	          var p = paramNames[i];
	          paramValues[p] = params1[i];
	        }
	      }
	      if (hash) {
	        for (var h in hash) {
	          paramValues[h] = hash[h];
	        }
	      }
	      var newScope = new Scope(paramValues);
	      // https://github.com/xtemplate/xtemplate/issues/29
	      newScope.root = scope.root;
	      // no caller Scope
	      buffer = macro.fn.call(self, newScope, buffer);
	    } else {
	      var error = 'can not find macro: ' + macroName;
	      buffer.error(error);
	    }
	    return buffer;
	  }
	};

	commands['debugger'] = function () {
	  util.globalEval('debugger');
	};

	module.exports = commands;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * LinkedBuffer of generate content from xtemplate
	 */

	'use strict';

	var util = __webpack_require__(0);

	function Buffer(list, next, tpl) {
	  this.list = list;
	  this.init();
	  this.next = next;
	  this.ready = false;
	  // tpl belongs
	  this.tpl = tpl;
	}

	Buffer.prototype = {
	  constructor: Buffer,

	  isBuffer: 1,

	  init: function init() {
	    this.data = '';
	  },

	  append: function append(data) {
	    this.data += data;
	    return this;
	  },

	  write: function write(data) {
	    // ignore null or undefined
	    if (data !== null && data !== undefined) {
	      if (data.isBuffer) {
	        return data;
	      }
	      this.data += data;
	    }
	    return this;
	  },

	  writeEscaped: function writeEscaped(data) {
	    // ignore null or undefined
	    if (data !== null && data !== undefined) {
	      if (data.isBuffer) {
	        return data;
	      }
	      this.data += util.escapeHtml(data);
	    }
	    return this;
	  },

	  insert: function insert() {
	    var self = this;
	    var list = self.list;
	    var tpl = self.tpl;
	    var nextFragment = new Buffer(list, self.next, tpl);
	    var asyncFragment = new Buffer(list, nextFragment, tpl);
	    self.next = asyncFragment;
	    self.ready = true;
	    return asyncFragment;
	  },

	  async: function async(fn) {
	    var asyncFragment = this.insert();
	    var nextFragment = asyncFragment.next;
	    fn(asyncFragment);
	    return nextFragment;
	  },

	  error: function error(e_) {
	    var callback = this.list.callback;
	    var e = e_;
	    if (callback) {
	      var tpl = this.tpl;
	      if (tpl) {
	        if (!(e instanceof Error)) {
	          e = new Error(e);
	        }
	        var _name = tpl.name;
	        var line = tpl.pos.line;
	        var errorStr = 'XTemplate error in file: ' + _name + ' at line ' + line + ': ';
	        try {
	          // phantomjs
	          e.stack = errorStr + e.stack;
	          e.message = errorStr + e.message;
	        } catch (e2) {
	          // empty
	        }
	        e.xtpl = { pos: { line: line }, name: _name };
	      }
	      this.list.callback = null;
	      callback(e, undefined);
	    }
	  },

	  end: function end() {
	    var self = this;
	    if (self.list.callback) {
	      self.ready = true;
	      self.list.flush();
	    }
	    return self;
	  }
	};

	function LinkedBuffer(callback, config) {
	  var self = this;
	  self.config = config;
	  self.head = new Buffer(self, undefined);
	  self.callback = callback;
	  this.init();
	}

	LinkedBuffer.prototype = {
	  constructor: LinkedBuffer,

	  init: function init() {
	    this.data = '';
	  },

	  append: function append(data) {
	    this.data += data;
	  },

	  end: function end() {
	    this.callback(null, this.data);
	    this.callback = null;
	  },

	  flush: function flush() {
	    var self = this;
	    var fragment = self.head;
	    while (fragment) {
	      if (fragment.ready) {
	        this.data += fragment.data;
	      } else {
	        self.head = fragment;
	        return;
	      }
	      fragment = fragment.next;
	    }
	    self.end();
	  }
	};

	LinkedBuffer.Buffer = Buffer;

	module.exports = LinkedBuffer;

	/**
	 * 2014-06-19 yiminghe@gmail.com
	 * string concat is faster than array join: 85ms<-> 131ms
	 */

/***/ },
/* 11 */
/***/ function(module, exports) {

	/*!
	 * escape-html
	 * Copyright(c) 2012-2013 TJ Holowaychuk
	 * Copyright(c) 2015 Andreas Lubbe
	 * Copyright(c) 2015 Tiancheng "Timothy" Gu
	 * MIT Licensed
	 */

	'use strict';

	/**
	 * Module variables.
	 * @private
	 */

	var matchHtmlRegExp = /["'&<>]/;

	/**
	 * Module exports.
	 * @public
	 */

	module.exports = escapeHtml;

	/**
	 * Escape special characters in the given string of html.
	 *
	 * @param  {string} string The string to escape for inserting into HTML
	 * @return {string}
	 * @public
	 */

	function escapeHtml(string) {
	  var str = '' + string;
	  var match = matchHtmlRegExp.exec(str);

	  if (!match) {
	    return str;
	  }

	  var escape;
	  var html = '';
	  var index = 0;
	  var lastIndex = 0;

	  for (index = match.index; index < str.length; index++) {
	    switch (str.charCodeAt(index)) {
	      case 34:
	        // "
	        escape = '&quot;';
	        break;
	      case 38:
	        // &
	        escape = '&amp;';
	        break;
	      case 39:
	        // '
	        escape = '&#39;';
	        break;
	      case 60:
	        // <
	        escape = '&lt;';
	        break;
	      case 62:
	        // >
	        escape = '&gt;';
	        break;
	      default:
	        continue;
	    }

	    if (lastIndex !== index) {
	      html += str.substring(lastIndex, index);
	    }

	    lastIndex = index + 1;
	    html += escape;
	  }

	  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
	}

/***/ }
/******/ ]);