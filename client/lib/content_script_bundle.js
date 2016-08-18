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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
	// http://wonko.com/post/html-escaping

	var escapeHtml = __webpack_require__(18);

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
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var QRCoder = __webpack_require__(14);

	function generateQR() {
	  var qr_coder = new QRCoder($('#qr_container'));
	  qr_coder.setMode(1);
	  qr_coder.draw(location.href, 'M', null, function (data) {
	    $('#qrwrapper').show();
	  });
	  $('#qrwrapper').show();
	}

	// 可以设置成功，但是还没用处，TMS页面通过
	function redefineTheUA() {
	  function setUserAgent(window, userAgent) {
	    if (window.navigator.userAgent != userAgent) {
	      var userAgentProp = { get: function get() {
	          return userAgent;
	        } };
	      try {
	        Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
	      } catch (e) {
	        window.navigator = Object.create(navigator, {
	          userAgent: userAgentProp
	        });
	      }
	    }
	  }
	  setUserAgent(document.querySelector('#J_Frame').contentWindow, "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1");

	  // console.log('Light Plugin: 当前设备UA, ' , 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1')
	}

	function bindPageEvent() {
	  $('#J_Fliter .phoneType .item').on('click', function (ev) {
	    var $this = $(ev.target);
	    if ($this.hasClass('selected')) return false;
	    var phoneTypeInPage = $('#J_Fliter .phoneType .selected').attr('data-name');
	    $('#J_Fliter .phoneType .item').removeClass('selected');
	    var phoneTypeToChange = $this.attr('data-name');
	    $this.addClass('selected');
	    $('#J_DemoWrap').removeClass(phoneTypeInPage).addClass(phoneTypeToChange);
	  });
	}

	var main = function main() {
	  generateQR();
	  redefineTheUA();
	  bindPageEvent();
	};

	module.exports = main;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * xtemplate runtime
	 */

	'use strict';

	var util = __webpack_require__(0);
	var nativeCommands = __webpack_require__(16);
	var commands = {};
	var Scope = __webpack_require__(1);
	var LinkedBuffer = __webpack_require__(17);

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
	      callback = function (error_, ret) {
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
/* 11 */
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


	buffer.data += '<!DOCTYPE html>\n\n<html lang="en">\n\n<head>\n  <meta charset="UTF-8">\n  <title>viewH5page</title>\n  <style>\n    /** {\n      cursor: url(\'//img.alicdn.com/tps/i2/T1_PMSFLBaXXcu5FDa-20-20.png\'), pointer !important;\n    }*/\n    /*@font-face {\n      font-family: \'_Helvetica\';\n      src: url(\'http://groups.demo.taobao.net/kimi/preview/src/font/_H_Helvetica.ttc\') format(\'truetype\');\n    }\n\n    @font-face {\n      font-family: \'_STHeiti-Light\';\n      src: url(\'http://groups.demo.taobao.net/kimi/preview/src/font/STHeiti-Light.ttc\') format(\'truetype\');\n    }*/\n/*\n    html,\n    body {\n      font-family: Helvetica, \'STHeiti Light\', STXihei, _Helvetica, _STHeiti-Light !important;\n    }*/\n  </style>\n</head>\n\n<body>\n  <div id="oper_wrap">\n    <div id="J_DemoWrap" class="demo-wrap iphone6" style="transform: scale(.8, .8);">\n      <div id="J_Navbar" class="nav-bar taobao">\n            <a href="javascript:window.history.back();" id="J_Back" class="back" title="返回">返回</a>\n            <span id="J_Title" class="frame-title">运营助手H5预览</span>\n            <a href="javascript:document.all.J_Frame.contentDocument.location.reload();" id="J_reflush" class="reflush" title="刷新">刷新</a>\n        </div>\n      <div class="demo">\n        <iframe src="';
	pos.line = 38;
	var id0 = ((t=(affix.currentUrl)) !== undefined ? t : ((t = data.currentUrl) !== undefined ? t  : scope.resolveLooseUp(["currentUrl"])));
	buffer = buffer.writeEscaped(id0);
	buffer.data += '" name="J_Frame" src="about:blank" frameborder="0" class="frame" id="J_Frame"></iframe>\n      </div>\n    </div>\n    <div class="info">\n      <form id="J_Form" class="ipt-wraper" hidden>\n        <input id="J_UrlTxt" placeholder="请输入URL……" class="url-txt" type="text" value="">\n      </form>\n      <div id="J_Fliter" class="fliter">\n        <dl class="phoneType">\n          <dt>设备：</dt>\n          <dd>\n            <span data-name="iphone4" class="item">iPhone4</span>\n            <span data-name="iphone5" class="item ">iPhone5</span>\n            <span data-name="iphone6" class="item selected">iPhone6</span>\n            <span data-name="iphone6plus" class="item">iPhone6 Plus</span>\n            <span data-name="sumsung" class="item">三星S5</span>\n            <span data-name="chuizi" class="item">锤子</span>\n          </dd>\n        </dl>\n        <dl class="webviewRuntime">\n          <dt>环境：</dt>\n          <dd>\n            <span data-name="taobao" class="item selected">手淘</span>\n            <span data-name="browser" class="item">浏览器</span>\n            <!-- <span data-name="tianmao" class="item">天猫</span>\n            <span data-name="alipay" class="item">支付宝</span> -->\n          </dd>\n        </dl>\n      </div>\n      <div id=\'qrwrapper\' hidden>\n        <p>使用客户端扫描二维码：</p>\n        <div class="qrcode" id="qr_container"></div>\n      </div>\n    </div>\n  </div>\n</body>\n\n</html>\n';
	return buffer;
	}

/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// 高能预警：
	// 内容脚本不能：
	// 调用 chrome.* API，除了以下 API：
	// extension（getURL、inIncognitoContext、lastError、onRequest、sendRequest）
	// i18n
	// runtime（connect、getManifest、getURL、id、onConnect、onMessage、sendMessage）
	// storage
	// 使用所属扩展程序页面中定义的变量或函数
	// 使用网页或其他内容脚本中定义的变量或函数

	// onMessage提前，防止background的sendMessage丢失
	chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
		if (request.type == "plugin:viewH5") {
			if (document.title !== 'viewH5page') {
				viewH5();
			}
		}
	});

	chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
		if (request.type == "plugin:refreshCurrentTab") {
			location.reload();
		}
	});

	chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
		if (request.type == "plugin:error") {
			console.log(request.msg);
			console.log(request.context);
		}
	});

	// require just for loader to compile, the styel injected in popupjs via chrome api
	__webpack_require__(8);
	var Xtemplate = __webpack_require__(10);
	var tpl = __webpack_require__(11);
	var viewH5Main = __webpack_require__(7);
	// var global = {}

	// 启用H5页面预览
	var viewH5 = function viewH5() {

		// 替换document
		var newDoc = document.open("text/html", "replace");
		var currentUrl = location.href;
		if (/\?/.test(currentUrl)) {
			currentUrl += '&wh_ttid=phone';
		} else {
			currentUrl += '?wh_ttid=phone';
		}
		//重新渲染页面
		newDoc.write(new Xtemplate(tpl).render({
			currentUrl: currentUrl
		}));
		newDoc.close();
		// page js
		viewH5Main();
		// $('html').html(new Xtemplate(tpl).render({}));// jquery bug , body tag lost
		// $('body').append('<div class="demo" ><iframe id="J_Frame" frameborder="0" src="https://www.taobao.com/markets/hi/hongxing1_copy"></iframe></div>');
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	/*
		DESCRIPTION: 	A javascript tool which can generate QR (Quick Response) symbol based on ISO/IEC 18004.
		VERSION: 		1.0.0.0
		AUTHOR: 		Jerry Weng
		UPDATE: 		2014-05-21
	*/

	/*
		DESCRIPTION:
			Use a container element on the HTML page to create an object which can create QR symbol.
		PARAMETERS:
			1: container: an DOM on the web page to present the whole symbol
		USAGE:
			var qr_coder =  new QRCoder($('#qr_container');
			qr_coder.draw("http://www.baidu.com", 'Q');
	*/
	var QRCoder = function QRCoder(container) {
		var $qr = QRHELPER;var $_ = this;

		// Version of the QR symbol ([1,40]). It will be resolved dynamically by the length of the message.
		var _qr_version = 1;
		// The count of modules per row/column, it will be resolved by the _qr_version.
		var _module_length = 0;
		// Error correction level (["L", "M", "Q", "H"]).
		var _error_level = "L";
		// The width & height in px for a div in the HTML page which represent one module of the whole symbol. Resolved dynamically by the _qr_version.
		var _module_size = 0;
		// An DOM on the web page to present the whole symbol.
		var _module_container = container;
		// The widht & height in px for the container.
		var _container_size = 150;
		// an icon image set at the center of the symbol.
		var _icon = null;
		// 0: the data will be decorated as a bmp and output to a <IMG> tag.
		// 1: the data will be shown as a css decorated matrix by some <div> tags.
		var _flush_mode = 0;
		// A dictionary to hold the bit array for each module.
		// One value of an module will be stored as data[$qr.point(i,j)]=true;
		// i means the column position of the symbol while j means the row position;
		// Zero point is at the left-top corner of the symbol.
		var data = new Array();

		// A dictionary to hold module points which represent the functional parts like
		// detection patterns, timing patterns, format infornmation, etc.
		var fundata = new Array();

		/*
	 	DESCRIPTION:
	 		Clear the container and draw a QR symbol based for the message.
	 	PARAMETERS:
	 		1: message: 		a string to encoded to be a QR symbol
	 		2: error_capacity: 	a character(L,M,Q,H) to indicate the error correction capacity for the QR symbol
	 							(
	 								error_capacity = 7  => L
	 								error_capacity = 15 => M
	 								error_capacity = 25 => Q
	 								error_capacity = 30 => H
	 							)
	 		3: icon 			a uri to indicate an icon to set at the center of the symbol
	 */
		this.draw = function (message, error_capacity, icon, callback) {
			$_.setIcon(icon);
			setTimeout(function () {
				fun_draw(message, error_capacity);
				if (callback != null && typeof callback === 'function') {
					callback(data);
				}
			}, 0);
		};

		/*
	 	DESCRIPTION:
	 		Set the width and height in px for the QR symbol.
	 	PARAMETERS:
	 		1: value: 	a integer value (px)
	 */
		this.setWidth = function (value) {
			_container_size = value;
		};

		/*
	 	DESCRIPTION:
	 		Set the icon image which will be set at the center of the QR symbol.
	 	PARAMETERS:
	 		1: icon: 	a uri to indicate an icon to set at the center of the symbol
	 */
		this.setIcon = function (icon) {
			_icon = icon;
		};

		/*
	 	DESCRIPTION:
	 		Redraw the QR symbol.
	 */
		this.redraw = function () {
			flush();
		};

		/*
	 	DESCRIPTION:
	 		Set the output mode to show the final symbol.
	 	PARAMETERS:
	 		1: mode: [0] => the data will be decorated as a bmp and output to a <IMG> tag.
	 				 [1] => the data will be shown as a css decorated matrix by some <DIV> tags.
	 */
		this.setMode = function (mode) {
			if (mode == null) mode = 0;
			_flush_mode = mode >= 1 ? 1 : 0;
		};

		// resolve the version and error correction level
		var fun_init = function fun_init(message, error_capacity) {
			var msg_len = message.length;
			if (msg_len > 2956) {
				return false;
			}
			_error_level = error_capacity.toUpperCase();
			if (['L', 'M', 'Q', 'H'].contains(_error_level) == -1) {
				_error_level = 'H';
			}

			for (var i = 1; i <= 40; i++) {
				var blk = QRHELPER_CONST_BLK[i + _error_level];
				var capacity = blk[0] * blk[2] + blk[1] * blk[3] - 16;
				if (capacity >= msg_len) {
					_qr_version = i;
					//console.log(_qr_version);
					_module_length = (_qr_version - 1) * 4 + 21;

					data = new Array();
					fundata = new Array();
					break;
				}
			}
			return true;
		};

		// draw a QR symbol
		var fun_draw = function fun_draw(message, error_capacity) {
			var ret = fun_init(message, error_capacity);

			if (ret) {
				// fill detection pattern, left-top
				fillDetectionPatterns(0, 0, 7, 7);
				// fill detection pattern, right-top
				fillDetectionPatterns(_module_length, 0, _module_length - 7, 7);
				// fill detection pattern, left-bottom
				fillDetectionPatterns(0, _module_length, 7, _module_length - 7);
				// fill timeing pattern
				fillTimeingPattern();
				// fill alignment
				fillAlignments(QRHELPER_CONST_ALG[_qr_version]);
				// fill version inoformation(version > 6)
				fillVersionInformation();
				// set functional area.
				setFunArea();
				// fill the data to the symbol
				filldata(message, _qr_version, _error_level);
				// flush to the container
				flush();
			}
		};

		var flush = function flush() {
			_module_size = Math.floor(_container_size / _module_length);
			if (_module_size == 0) _module_size = 1;
			_container_size = _module_size * _module_length;

			var container = _module_container;
			container.css({
				"width": _container_size + "px",
				"height": _container_size + "px"
			});
			container.html("");

			var version = navigator.appVersion.toLowerCase();
			var isIe6 = version.indexOf("msie 6") > -1;
			var isIe7 = version.indexOf("msie 7") > -1;

			if (isIe6 || isIe7) {
				_flush_mode = 1;
			}
			if (_flush_mode == 0) {
				// output as a bmp image
				var base64 = Bitmap.resolve(data, _module_length, _module_length);
				$(document.createElement("IMG")).attr("src", "data:image/bmp;base64," + base64).attr("width", _container_size).attr("height", _container_size).appendTo(container);
			} else {
				// output as a div matrix
				for (var y = 0; y < _module_length; y++) {
					for (var x = 0; x < _module_length; x++) {
						var m = $(document.createElement("DIV")).attr("id", "qr_module_" + x + "_" + y).css({
							"width": _module_size + "px",
							"height": _module_size + "px",
							"overflow": "hidden",
							"backgroundColor": data[$qr.point(x, y)] ? "black" : "white",
							"float": "left" }).appendTo(container);
					};
				};
			}

			// apply a small 35*35 icon to the center of the symbol,
			// it needs a higher error correction level.
			if (_icon != null) {
				var img = $(document.createElement("IMG")).attr("src", _icon).css({
					"position": "absolute",
					"z-Index": 1000,
					"width": _module_size * 7 + "px",
					"height": _module_size * 7 + "px",
					"left": ((_module_length - 1) / 2 - 3) * _module_size + "px",
					"top": ((_module_length - 1) / 2 - 3) * _module_size + "px"
				}).appendTo(container);

				// fix ie6 fail to load dynamic images:
				if (isIe6) {
					if (img[0].width == 0 || img[0].height == 0) {
						var interval = null;
						var _img = new Image();
						_img.src = _icon;

						interval = setInterval(function () {
							if (_img.width > 0 && _img.height > 0) {
								img.remove();
								container.append($(_img));
								$(_img).css({
									"position": "absolute",
									"z-Index": 1000,
									"width": _module_size * 7 + "px",
									"height": _module_size * 7 + "px",
									"left": ((_module_length - 1) / 2 - 3) * _module_size + "px",
									"top": ((_module_length - 1) / 2 - 3) * _module_size + "px"
								});
								clearInterval(interval);
							}
						}, 100);
					}
				}
			}
		};

		var setFunArea = function setFunArea() {
			for (var i = 0; i < 9; i++) {
				for (var j = 0; j < 9; j++) {
					fundata[$qr.point(i, j)] = true;
					if (i < 8) {
						fundata[_module_length - i - 1 + "," + j] = true;
						fundata[j + "," + (_module_length - i - 1)] = true;
					}
				}
			}
			var remainders = QRHELPER.resolveRemainderBits(_qr_version);
			var st_y = _module_length - 9;
			switch (remainders) {
				case 7:
					fundata[0 + ',' + (st_y - 3)] = true;
					fundata[0 + ',' + (st_y - 2)] = true;
					fundata[1 + ',' + (st_y - 2)] = true;
				case 4:
					fundata[1 + ',' + (st_y - 1)] = true;
				case 3:
					fundata[0 + ',' + st_y] = true;
					fundata[1 + ',' + st_y] = true;
					fundata[0 + ',' + (st_y - 1)] = true;
					break;
			}
		};

		var fillDetectionPatterns = function fillDetectionPatterns(lt_x, lt_y, rb_x, rb_y) {
			var len_i = Math.abs(rb_x - lt_x);
			var len_j = Math.abs(rb_y - lt_y);
			for (var i = 0; i < len_i; i++) {
				for (var j = 0; j < len_j; j++) {
					var x = (rb_x >= lt_x ? lt_x : rb_x) + i;
					var y = (rb_y >= lt_y ? lt_y : rb_y) + j;
					data[$qr.point(x, y)] = true;
					fundata[$qr.point(x, y)] = true;
					if ((i == 1 || i == len_i - 2) && j >= 1 && j < len_j - 1 || (j == 1 || j == len_j - 2) && i >= 1 && i < len_i - 1) {
						data[$qr.point(x, y)] = false;
					}
				}
			};
		};

		var fillTimeingPattern = function fillTimeingPattern() {
			for (var i = 8; i < _module_length - 8; i++) {
				data[$qr.point(6, i)] = !data[$qr.point(6, i - 1)];
				data[$qr.point(i, 6)] = !data[$qr.point(i - 1, 6)];
				fundata[$qr.point(6, i)] = true;
				fundata[$qr.point(i, 6)] = true;
			}
		};

		var fillAlignments = function fillAlignments(center_points) {
			for (var i = 0; i < center_points.length; i++) {
				for (var j = 0; j < center_points.length; j++) {
					var x = center_points[i];
					var y = center_points[j];
					if (x == y && x == 6 || x == 6 && y + 7 == _module_length || y == 6 && x + 7 == _module_length) {
						continue;
					}
					fillDetectionPatterns(x - 2, y - 2, x + 3, y + 3);
				}
			}
		};

		var fillFormatInfo = function fillFormatInfo(correction_level, mask_pattern) {
			var bitptrs = [{ x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 7, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 }, { x: _module_length - 1, y: 8 }, { x: _module_length - 2, y: 8 }, { x: _module_length - 3, y: 8 }, { x: _module_length - 4, y: 8 }, { x: _module_length - 5, y: 8 }, { x: _module_length - 6, y: 8 }, { x: _module_length - 7, y: 8 }, { x: _module_length - 8, y: 8 }, { x: 8, y: _module_length - 7 }, { x: 8, y: _module_length - 6 }, { x: 8, y: _module_length - 5 }, { x: 8, y: _module_length - 4 }, { x: 8, y: _module_length - 3 }, { x: 8, y: _module_length - 2 }, { x: 8, y: _module_length - 1 }];
			var cl = 0x01;
			switch (correction_level) {
				case "L":
					cl = 0x01;
					break;
				case "M":
					cl = 0x00;
					break;
				case "Q":
					cl = 0x03;
					break;
				case "H":
					cl = 0x02;
					break;
			}
			var fi_bits = cl.toBitString(2) + mask_pattern.toBitString(3);
			var fi = parseInt(fi_bits, 2);
			var mask = 0x5412; //101010000010010
			var bch = fi << 10 ^ $qr.bch15_5(fi << 10);
			var encoded = bch ^ mask;
			var bit_encoded = encoded.toBitString();
			bit_encoded = QRHELPER.replica('0', 15 - bit_encoded.length) + bit_encoded;
			for (var i = 0; i < 15; i++) {
				var b = bit_encoded.substr(14 - i, 1) == "1" ? true : false;
				data[$qr.point(bitptrs[i].x, bitptrs[i].y)] = b;
				data[$qr.point(bitptrs[15 + i].x, bitptrs[15 + i].y)] = b;
			}
			data[$qr.point(8, _module_length - 8)] = true;
			return encoded;
		};

		var fillVersionInformation = function fillVersionInformation() {
			if (_qr_version > 6) {
				var bits = QRHELPER_CONST_VERBIT[_qr_version];
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < 6; j++) {
						var d = bits.substr(17 - j * 3 - i, 1) == "1" ? true : false;
						data[$qr.point(j, _module_length - 11 + i)] = d;
						data[$qr.point(_module_length - 11 + i, j)] = d;
						fundata[$qr.point(j, _module_length - 11 + i)] = true;
						fundata[$qr.point(_module_length - 11 + i, j)] = true;
					}
				}
			}
		};

		var filldata = function filldata(str, version, correction_level) {
			var bits = RSEncoder.encode(str, version, correction_level);

			var p_st = bits.length - 1; //console.log(p_st);
			var len = _module_length - 1;
			var p_up = true;
			var p_x = 0;
			var p_y = len;
			var c_d = 0;
			var left = true;
			while (p_st > 0) {
				if (p_x >= _module_length) {
					break;
				}
				if (p_x == 6) {
					p_x = 7;
				}
				if (fundata[$qr.point(p_x, p_y)] != true) {
					var d = bits.substr(p_st, 1) == "1" ? true : false;
					data[$qr.point(p_x, p_y)] = d;
					p_st--;
				}
				left ? p_x++ : p_x--;
				if (!left) {
					p_up ? p_y-- : p_y++;
					if (p_y < 0) p_y = 0;
					if (p_y > len) p_y = len;
					c_d++;
				}
				left = !left;
				if (c_d == len + 1) {
					p_up = !p_up;
					c_d = 0;
					p_x += 2;
				}
			}

			// calculate the score for each mask functions and choose the lowest one.
			var score = 0;
			var maskref = maskfuns[0];
			for (var i = 0; i < maskfuns.length; i++) {
				var val = maskscore(maskfuns[i].calc);
				if (val < score || score == 0) {
					score = val;
					maskref = maskfuns[i];
				}
			}

			// apply the best mask to the data array
			for (var y = 0; y <= len; y++) {
				for (var x = 0; x <= len; x++) {
					if (fundata[$qr.point(x, y)] != true) {
						data[$qr.point(x, y)] = (data[$qr.point(x, y)] ^ maskref.calc(y, x)) == 1 ? true : false;
					}
				}
			}

			// re-fill the formatinfo with the selected mask and error correction level.
			fillFormatInfo(correction_level, maskref.Ref);
		};

		// there are 8 mask functions, we need choose the one which get the lowest score.
		var maskfuns = [{ Ref: 0x00, calc: function calc(i, j) {
				return (i + j) % 2 == 0;
			} }, { Ref: 0x01, calc: function calc(i, j) {
				return i % 2 == 0;
			} }, { Ref: 0x02, calc: function calc(i, j) {
				return j % 3 == 0;
			} }, { Ref: 0x03, calc: function calc(i, j) {
				return (i + j) % 3 == 0;
			} }, { Ref: 0x04, calc: function calc(i, j) {
				return (i / 2 + j / 3) % 2 == 0;
			} }, { Ref: 0x05, calc: function calc(i, j) {
				return i * j % 2 + i * j % 3 == 0;
			} }, { Ref: 0x06, calc: function calc(i, j) {
				return (i * j % 2 + i * j % 3) % 2 == 0;
			} }, { Ref: 0x07, calc: function calc(i, j) {
				return (i * j % 3 + (i + j) % 2) % 2 == 0;
			} }];

		// there are 4 functions to get a score for each mask functions
		var maskscorefuns = [{
			score: function score(array) {
				var s = 0;
				var r_count = 0;
				var c_count = 0;
				var r_dark = true;
				var c_dark = true;
				for (var i = 0; i < _module_length; i++) {
					for (var j = 0; j < _module_length; j++) {
						if (r_dark == array[$qr.point(i, j)]) {
							r_count++;
						} else {
							r_dark = !r_dark;
							if (r_count > 5) {
								s += r_count - 2;
							}
							r_count = 1;
						}
						if (c_dark == array[$qr.point(j, i)]) {
							c_count++;
						} else {
							c_dark = !c_dark;
							if (c_count > 5) {
								s += c_count - 2;
							}
							c_count = 1;
						}
					}
				}
				return s;
			}
		}, {
			score: function score(array) {
				var count = 0;
				for (var i = 0; i < _module_length - 6; i++) {
					for (var j = 0; j < _module_length - 6; j++) {
						if (array[$qr.point(i, j)] == true && array[$qr.point(i, j + 1)] == false && array[$qr.point(i, j + 2)] == true && array[$qr.point(i, j + 3)] == true && array[$qr.point(i, j + 4)] == true && array[$qr.point(i, j + 5)] == false && array[$qr.point(i, j + 6)] == true || array[$qr.point(i, j)] == true && array[$qr.point(i + 1, j)] == false && array[$qr.point(i + 2, j)] == true && array[$qr.point(i + 3, j)] == true && array[$qr.point(i + 4, j)] == true && array[$qr.point(i + 5, j)] == false && array[$qr.point(i + 6, j)] == true) {
							count++;
						}
					}
				}
				return 40 * count;
			}
		}, {
			score: function score(array) {
				var count = 0;
				for (var i = 0; i < _module_length; i++) {
					for (var j = 0; j < _module_length; j++) {
						if (array[$qr.point(i, j)] == true) {
							count++;
						}
					}
				}
				var t = 10 * Math.ceil((count / (_module_length * _module_length) * 100 - 50) / 5);
				return t > 0 ? t : 0;
			}
		}, {
			score: function score(array) {
				// to improve the performance, we only calculate the same color blocks which
				// size is m*n, m,n = [2,5], because these small blocks are the most frequency ones.
				var max = 0;
				for (var m = 2; m < 6; m++) {
					for (var n = 2; n < 6; n++) {
						for (var i = 0; i < _module_length - m; i++) {
							for (var j = 0; j < _module_length - n; j++) {
								var b = false;
								var v = array[$qr.point(i, j)];
								for (var k = i; k < i + m; k++) {
									for (var p = j; p < j + n; p++) {
										if (array[$qr.point(k, p)] != v) {
											b = true;
											break;
										}
									}
									if (b) {
										break;
									}
								}

								if (!b) {
									max += (m - 1) * (n - 1) * 3;
								}
							}
						}
					}
				}
				return max;
			}
		}];

		var maskscore = function maskscore(fun) {
			var score = 0;
			var len = _module_length - 1;
			var maskarray = data.clone();
			for (var y = 0; y <= len; y++) {
				for (var x = 0; x <= len; x++) {
					if (fundata[$qr.point(x, y)] != true) {
						maskarray[$qr.point(x, y)] = (data[$qr.point(x, y)] ^ fun(y, x)) == 1 ? true : false;
					}
				}
			}

			for (var i = 0; i < maskscorefuns.length; i++) {
				var time = new Date();
				score += maskscorefuns[i].score(maskarray);
			}
			//console.log("score:"+score);
			return score;
		};
	};

	var QRHELPER = {
		point: function point(x, y) {
			return x + "," + y;
		},
		replica: function replica(character, length) {
			var output = "";
			for (var i = 0; i < length; i++) {
				output += character.toString();
			}
			return output;
		},
		bch15_5: function bch15_5(value) {
			var gen = 0x537; //generate polymonial(10100110111): x^10 + x^8 + x^5 + x^4 + x^2 + x + 1
			for (var i = 4; i > -1; i--) {
				if (value & 1 << i + 10) {
					value ^= gen << i;
				}
			}
			return value;
		},
		resolveBitNumofCCI: function resolveBitNumofCCI(mode, version) {
			var cci_len = 10;
			if (version < 1 || version > 40) {
				return null;
			}
			if (version >= 1 && version <= 9) {
				switch (mode) {
					case "numeric":
						cci_len = 10;
						break;
					case "alphanumeric":
						cci_len = 9;
						break;
					case "8bitbyte":
					case "kanji":
						cci_len = 8;
						break;
				}
			} else if (version > 9 && version <= 26) {
				switch (mode) {
					case "numeric":
						cci_len = 12;
						break;
					case "alphanumeric":
						cci_len = 11;
						break;
					case "8bitbyte":
						cci_len = 16;
						break;
					case "kanji":
						cci_len = 10;
						break;
				}
			} else if (version > 26 && version <= 40) {
				switch (mode) {
					case "numeric":
						cci_len = 14;
						break;
					case "alphanumeric":
						cci_len = 13;
						break;
					case "8bitbyte":
						cci_len = 16;
						break;
					case "kanji":
						cci_len = 12;
						break;
				}
			}
			return cci_len;
		},
		resolveRemainderBits: function resolveRemainderBits(version) {
			var len = 0;
			switch (version) {
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					len = 7;
					break;
				case 14:
				case 15:
				case 16:
				case 17:
				case 18:
				case 19:
				case 20:
				case 28:
				case 29:
				case 30:
				case 31:
				case 32:
				case 33:
				case 34:
					len = 3;
					break;
				case 21:
				case 22:
				case 23:
				case 24:
				case 25:
				case 26:
				case 27:
					len = 4;
					break;
				default:
					len = 0;
					break;
			}
			return len;
		},
		resolveDataModules: function resolveDataModules(version) {
			var total_modules = (version - 1) * 4 + 21;
			var total_format_version_modules;
			if (version < 7) {
				total_format_version_modules = 31;
			} else {
				total_format_version_modules = 67;
			}
			return total_modules * total_modules - QRHELPER_CONST_FPM[version] - total_format_version_modules;
		},
		resolveDataCapacity: function resolveDataCapacity(version) {
			if (version < 1 || version > 40) {
				return 0;
			}
			var d_modules = QRHELPER.resolveDataModules(version);
			var rem_bits = QRHELPER.resolveRemainderBits(version);
			return (d_modules - rem_bits) / 8;
		},
		parseNumToBit: function parseNumToBit(num, version) {
			var cci_len = QRHELPER.resolveBitNumofCCI("numeric", version);
			var num_str = num.toString();
			var ptr = 0;
			var output = "";
			while (ptr < num_str.length) {
				var seg = num_str.substr(ptr, 3);
				var seg_bit = parseInt(seg).toString(2);
				switch (seg.length) {
					case 3:
						output += QRHELPER.replica("0", cci_len - seg_bit.length);
						break;
					case 2:
						output += QRHELPER.replica("0", 7 - seg_bit.length);
						break;
					case 1:
						output += QRHELPER.replica("0", 4 - seg_bit.length);
						break;
				}
				output += seg_bit;
				ptr += 3;
			}
			var numcout_bit = num_str.length.toString(2);
			output = QRHELPER.replica("0", cci_len - numcout_bit.length) + numcout_bit + output;
			output = QRHELPER_CONST_MODE["numeric"] + output;
			return output;
		},
		parseAlphaToBit: function parseAlphaToBit(str, version) {
			if (str == null) {
				return null;
			}
			var cci_len = QRHELPER.resolveBitNumofCCI("alphanumeric", version);
			var str = str.toString().toUpperCase();
			var ptr = 0;
			var output = "";
			while (ptr < str.length) {
				var seg = str.substr(ptr, 2);
				if (seg.length == 2) {
					var seg_v0 = QRHELPER_CONTST_AL[seg[0]];
					var seg_v1 = QRHELPER_CONTST_AL[seg[1]];
					var seg_val = seg_v0 * 45 + seg_v1;
					var seg_bit = seg_val.toString(2);
					output += QRHELPER.replica("0", 11 - seg_bit.length);
					output += seg_bit;
				} else {
					var seg_val = QRHELPER_CONTST_AL[seg];
					var seg_bit = seg_val.toString(2);
					output += QRHELPER.replica("0", 6 - seg_bit.length);
					output += seg_bit;
				}
				ptr += 2;
			}

			var numcout_bit = str.length.toString(2);
			output = QRHELPER.replica("0", cci_len - numcout_bit.length) + numcout_bit + output;
			output = QRHELPER_CONST_MODE["alphanumeric"] + output;
			return output;
		},
		parseJIStoBit: function parseJIStoBit(str, version) {
			if (str == null) {
				return null;
			}
			var cci_len = QRHELPER.resolveBitNumofCCI("8bitbyte", version);
			var output = "";
			for (var i = 0; i < str.length; i++) {
				var character = str.substr(i, 1);
				var code = QRHELPER_CONST_JIS8[character];
				if (code == null) {
					code = 0x3F;
				}
				output += code.toBitString();
			}
			var numcout_bit = str.length.toString(2);
			output = QRHELPER.replica("0", cci_len - numcout_bit.length) + numcout_bit + output;
			output = QRHELPER_CONST_MODE["8bitbyte"] + output;
			return output;
		},
		parseDataToBlocks: function parseDataToBlocks(str, version, correction_level) {
			var bits = QRHELPER.parseJIStoBit(str, version);
			// add terminator
			bits += '0000';
			var bit_len = bits.length;
			var bit_pad = bit_len % 8 > 0 ? 8 - bit_len % 8 : 0;
			bits += QRHELPER.replica("0", bit_pad);
			var blk = QRHELPER_CONST_BLK[version + correction_level.toUpperCase()];
			if (blk == null) {
				return null;
			}
			var total_data_bits = (blk[0] * blk[2] + blk[1] * blk[3]) * 8;
			var padding_blocks = ['11101100', '00010001'];
			var n = 0;
			if (bits.length > total_data_bits) {
				return null;
			}
			while (bits.length < total_data_bits) {
				bits += padding_blocks[Math.pow(-1, ++n) * 0.5 + 0.5];
			}
			var blocks = new Array();
			var sgl_block = new Array();
			for (var i = 0, ptr = 0; i < bits.length / 8; i++, ptr += 8) {
				var block_2 = bits.substr(ptr, 8);
				var blk_a_l = blk[2] * blk[0];

				if (i <= blk_a_l && i % blk[2] == 0 || i > blk_a_l && (i - blk_a_l) % blk[3] == 0) {
					sgl_block = new Array();
				}
				sgl_block.push(parseInt(block_2, 2));
				if (i <= blk_a_l && i % blk[2] == blk[2] - 1 || i > blk_a_l && (i - blk_a_l) % blk[3] == blk[3] - 1) {
					blocks.push(sgl_block);
				}
			}
			return blocks;
		}
	};

	Array.prototype.clone = function () {
		var n = new Array();
		for (var d in this) {
			n[d] = this[d];
		}
		return n;
	};

	Array.prototype.contains = function (val) {
		for (var k in this) {
			if (this[k] == val) {
				return true;
			}
		}
		return false;
	};

	Array.prototype.toHex = function () {
		for (var i = 0; i < this.length; i++) {
			this[i] = this[i].toString(16);
		}return this;
	};

	Array.prototype.toBase64 = function () {
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var input = this;
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		while (i < input.length) {
			chr1 = input[i++];
			chr2 = input[i++];
			chr3 = input[i++];
			enc1 = chr1 >> 2;
			enc2 = (chr1 & 3) << 4 | chr2 >> 4;
			enc3 = (chr2 & 15) << 2 | chr3 >> 6;
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	};

	Number.prototype.toByteArray = function (size) {
		var hex = this.toString(16);
		hex = QRHELPER.replica('0', size * 2 - hex.length) + hex;
		var arr = new Array();
		for (var i = hex.length - 2; i >= 0; i -= 2) {
			if (i < 0) i = 0;
			arr.push(parseInt('0x' + hex.substr(i, 2)));
		}
		return arr;
	};

	Number.prototype.toBitString = function (length) {
		var num = this;
		if (length == null || typeof length !== 'number' || length <= 0) {
			length = 8;
		}
		var bits = num.toString(2);

		if (length > bits.length) {
			while (bits.length < length) {
				bits = "0" + bits;
			}
		} else {
			bits = bits.substr(bits.length - length);
		}
		return bits;
	};

	// Reed Solomon error correction encoder
	var RSEncoder = {
		// generate error correction codeblocks
		generr: function generr(codeblocks, err_block_count) {
			var gen = GF.Poly.gx(err_block_count);
			var msgout = new Array(codeblocks.length + err_block_count);
			for (var i = 0; i < codeblocks.length; i++) {
				msgout[i] = codeblocks[i];
			}
			for (var i = 0; i < codeblocks.length; i++) {
				var c = msgout[i];
				if (c != 0) {
					for (var j = 0; j < gen.length; j++) {
						msgout[i + j] ^= GF.multi(gen[j], c);
					}
				}
			}
			for (var i = 0; i < codeblocks.length; i++) {
				msgout[i] = codeblocks[i];
			}
			return msgout.slice(codeblocks.length);
		},
		// generate error correction codeblocks and append to the data codeblocks.
		encode: function encode(message, version, correction_level) {
			var blk = QRHELPER_CONST_BLK[version + correction_level.toUpperCase()];
			var err_cb_len = blk[4] / (blk[0] + blk[1]);
			var blocks = QRHELPER.parseDataToBlocks(message, version, correction_level);
			var errorblocks = new Array();
			for (var i = 0; i < blocks.length; i++) {
				errorblocks.push(RSEncoder.generr(blocks[i], err_cb_len));
			}
			var output = "";
			var max_cb_len = Math.max(blk[2], blk[3]);
			for (var i = 0; i < max_cb_len; i++) {
				for (var j = 0; j < blocks.length; j++) {
					if (i < blocks[j].length) {
						output += blocks[j][i].toBitString();
					}
				}
			}
			for (var i = 0; i < err_cb_len; i++) {
				for (var j = 0; j < blocks.length; j++) {
					output += errorblocks[j][i].toBitString();
				}
			}
			//var remainder=QRHELPER.resolveRemainderBits(version);
			//for(var i=0;i<remainder;i++){
			//	output+="0";
			//}
			return output;
		}
	};

	// Galois Field operations
	var GF = {
		// values of alpha^0, alpha^1,..., alpha^255 in the GF(2^8), index is the power number.
		aTo: [1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142],
		// values of power, index is the value in GF(2^8), return the power.
		expOf: [0, 255, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200, 8, 76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120, 77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241, 210, 19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122, 117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175],

		exp: function exp(p_of_a) {
			return GF.aTo[p_of_a];
		},

		lg: function lg(gfv) {
			if (gfv != 0) {
				return GF.expOf[gfv];
			}
		},

		inverse: function inverse(gfv) {
			if (gfv != 0) {
				return GF.exp(255 - GF.lg(gfv));
			}
		},

		add: function add(a, b) {
			return a ^ b;
		},

		sub: function sub(a, b) {
			return GF.add(a, b);
		},

		multi: function multi(a, b) {
			if (a == 0 || b == 0) {
				return 0;
			}
			if (a == 1) {
				return b;
			}
			if (b == 1) {
				return a;
			}
			return GF.exp((GF.lg(a) + GF.lg(b)) % 255);
		},

		devide: function devide(a, b) {
			if (b == 0) {
				return NaN;
			}
			if (a == 0) {
				return 0;
			}
			if (b == 1) {
				return a;
			}
			return GF.exp(Math.abs(GF.lg(a) - GF.lg(b)) % 255);
		},
		create: function create() {
			var gf_exp = new Array();
			var gf_log = new Array();
			gf_exp[0] = 1;
			var x = 1;
			for (var i = 1; i < 255; i++) {
				x <<= 1;
				if (x & 0x100) {
					x ^= 0x11d;
				}
				gf_exp[i] = x;
				gf_log[x] = i;
			}
			for (var i = 255; i < 512; i++) {
				gf_exp[i] = gf_exp[i - 255];
			}
			gf_log[gf_exp[255]] = 255;
			return [gf_exp, gf_log];
		},
		Poly: {
			scale: function scale(p, x) {
				for (var i = 0; i < p.length; i++) {
					p[i] = GF.multi(p[i], x);
				}
				return p;
			},
			add: function add(p, q) {
				var t = new Array();
				var len = p.length;
				if (q.length > p.length) {
					len = q;
				}
				for (var i = 0; i < p.length; i++) {
					t[i + len - p.length] = p[i];
				}
				for (var i = 0; i < q.length; i++) {
					t[i + len - q.length] ^= q[i];
				}
				return t;
			},
			multi: function multi(p, q) {
				var t = new Array(p.length + q.length - 1);
				for (var j = 0; j < q.length; j++) {
					for (var i = 0; i < p.length; i++) {
						t[i + j] ^= GF.multi(p[i], q[j]);
					}
				}
				return t;
			},
			eval: function _eval(p, x) {
				var y = p[0];
				for (var i = 1; i < p.length; i++) {
					y = GF.multi(y, x) ^ p[i];
				}
				return y;
			},
			gencache: new Array(),
			// get the generator polynomial. ([1,alpha^0]*[1,alpha^1]*...*[1,alpha^(n-1)]) n is the number of error correction codeblocks
			gx: function gx(nsym) {
				if (GF.Poly.gencache[nsym] != null) {
					return GF.Poly.gencache[nsym];
				}
				var g = [1, GF.exp(0)];
				for (var i = 1; i < nsym; i++) {
					g = GF.Poly.multi(g, [1, GF.exp(i)]);
				}
				GF.Poly.gencache[nsym] = g;
				return g;
			}
		}
	};

	// convert a byte array to a 1-bit bitmap
	var Bitmap = {
		resolve: function resolve(data, width, height) {
			var binary = [];
			var B = 0x42,
			    M = 0x4D,
			    data_ptr = 0x3e,
			    px_bit = 1,
			    bmp_size = height * (px_bit * width + 31 >> 5 << 2),
			    length = 0x3e + bmp_size,
			    zero = 0x00,
			    headersize = 40,
			    color_plane = 1,
			    zip_type = 0,
			    h_bpi = 0,
			    v_bpi = 0,
			    color_c = 0;
			// 0000h
			binary.push(B);
			binary.push(M);
			// 0002h
			binary = binary.concat(length.toByteArray(4));
			// 0006h
			binary = binary.concat(zero.toByteArray(4));
			// 000Ah
			binary = binary.concat(data_ptr.toByteArray(4));
			// BITMAPINFOHEADER
			// 000Eh
			binary = binary.concat(headersize.toByteArray(4));
			// 0012h
			binary = binary.concat(width.toByteArray(4));
			// 0016h
			binary = binary.concat(height.toByteArray(4));
			// 001Ah
			binary = binary.concat(color_plane.toByteArray(2));
			// 001Ch
			binary = binary.concat(px_bit.toByteArray(2));
			// 001Eh
			binary = binary.concat(zip_type.toByteArray(4));
			// 0022h
			binary = binary.concat(bmp_size.toByteArray(4));
			// 0026h
			binary = binary.concat(h_bpi.toByteArray(4));
			// 002Ah
			binary = binary.concat(v_bpi.toByteArray(4));
			// 002Eh
			binary = binary.concat(color_c.toByteArray(4));
			// 0032h
			binary = binary.concat(zero.toByteArray(4));
			// color table
			// 0036h
			var dark = 0,
			    light = 255;
			binary.push(light);
			binary.push(light);
			binary.push(light);
			binary.push(zero);
			binary.push(dark);
			binary.push(dark);
			binary.push(dark);
			binary.push(zero);

			// data:
			// 003eh
			for (var y = height - 1; y >= 0; y--) {
				var bit_row = "";
				for (var x = 0; x < width; x++) {
					bit_row += QRHELPER.replica('0', px_bit - 1) + (data[QRHELPER.point(x, y)] ? "1" : "0");
				}
				bit_row += QRHELPER.replica('0', bmp_size / height * 8 - bit_row.length);
				for (var i = 0; i < bmp_size / height; i++) {
					binary.push(parseInt(bit_row.substr(i * 8, 8), 2));
				}
			}
			return binary.toBase64();
		}
	};

	// Alphanumberic characters encoding table
	var QRHELPER_CONTST_AL = new Array();
	QRHELPER_CONTST_AL[0] = "0";QRHELPER_CONTST_AL["0"] = 0;
	QRHELPER_CONTST_AL[1] = "1";QRHELPER_CONTST_AL["1"] = 1;
	QRHELPER_CONTST_AL[2] = "2";QRHELPER_CONTST_AL["2"] = 2;
	QRHELPER_CONTST_AL[3] = "3";QRHELPER_CONTST_AL["3"] = 3;
	QRHELPER_CONTST_AL[4] = "4";QRHELPER_CONTST_AL["4"] = 4;
	QRHELPER_CONTST_AL[5] = "5";QRHELPER_CONTST_AL["5"] = 5;
	QRHELPER_CONTST_AL[6] = "6";QRHELPER_CONTST_AL["6"] = 6;
	QRHELPER_CONTST_AL[7] = "7";QRHELPER_CONTST_AL["7"] = 7;
	QRHELPER_CONTST_AL[8] = "8";QRHELPER_CONTST_AL["8"] = 8;
	QRHELPER_CONTST_AL[9] = "9";QRHELPER_CONTST_AL["9"] = 9;
	QRHELPER_CONTST_AL[10] = "A";QRHELPER_CONTST_AL["A"] = 10;
	QRHELPER_CONTST_AL[11] = "B";QRHELPER_CONTST_AL["B"] = 11;
	QRHELPER_CONTST_AL[12] = "C";QRHELPER_CONTST_AL["C"] = 12;
	QRHELPER_CONTST_AL[13] = "D";QRHELPER_CONTST_AL["D"] = 13;
	QRHELPER_CONTST_AL[14] = "E";QRHELPER_CONTST_AL["E"] = 14;
	QRHELPER_CONTST_AL[15] = "F";QRHELPER_CONTST_AL["F"] = 15;
	QRHELPER_CONTST_AL[16] = "G";QRHELPER_CONTST_AL["G"] = 16;
	QRHELPER_CONTST_AL[17] = "H";QRHELPER_CONTST_AL["H"] = 17;
	QRHELPER_CONTST_AL[18] = "I";QRHELPER_CONTST_AL["I"] = 18;
	QRHELPER_CONTST_AL[19] = "J";QRHELPER_CONTST_AL["J"] = 19;
	QRHELPER_CONTST_AL[20] = "K";QRHELPER_CONTST_AL["K"] = 20;
	QRHELPER_CONTST_AL[21] = "L";QRHELPER_CONTST_AL["L"] = 21;
	QRHELPER_CONTST_AL[22] = "M";QRHELPER_CONTST_AL["M"] = 22;
	QRHELPER_CONTST_AL[23] = "N";QRHELPER_CONTST_AL["N"] = 23;
	QRHELPER_CONTST_AL[24] = "O";QRHELPER_CONTST_AL["O"] = 24;
	QRHELPER_CONTST_AL[25] = "P";QRHELPER_CONTST_AL["P"] = 25;
	QRHELPER_CONTST_AL[26] = "Q";QRHELPER_CONTST_AL["Q"] = 26;
	QRHELPER_CONTST_AL[27] = "R";QRHELPER_CONTST_AL["R"] = 27;
	QRHELPER_CONTST_AL[28] = "S";QRHELPER_CONTST_AL["S"] = 28;
	QRHELPER_CONTST_AL[29] = "T";QRHELPER_CONTST_AL["T"] = 29;
	QRHELPER_CONTST_AL[30] = "U";QRHELPER_CONTST_AL["U"] = 30;
	QRHELPER_CONTST_AL[31] = "V";QRHELPER_CONTST_AL["V"] = 31;
	QRHELPER_CONTST_AL[32] = "W";QRHELPER_CONTST_AL["W"] = 32;
	QRHELPER_CONTST_AL[33] = "X";QRHELPER_CONTST_AL["X"] = 33;
	QRHELPER_CONTST_AL[34] = "Y";QRHELPER_CONTST_AL["Y"] = 34;
	QRHELPER_CONTST_AL[35] = "Z";QRHELPER_CONTST_AL["Z"] = 35;
	QRHELPER_CONTST_AL[36] = " ";QRHELPER_CONTST_AL[" "] = 36;
	QRHELPER_CONTST_AL[37] = "$";QRHELPER_CONTST_AL["$"] = 37;
	QRHELPER_CONTST_AL[38] = "%";QRHELPER_CONTST_AL["%"] = 38;
	QRHELPER_CONTST_AL[39] = "*";QRHELPER_CONTST_AL["*"] = 39;
	QRHELPER_CONTST_AL[40] = "+";QRHELPER_CONTST_AL["+"] = 40;
	QRHELPER_CONTST_AL[41] = "-";QRHELPER_CONTST_AL["-"] = 41;
	QRHELPER_CONTST_AL[42] = ".";QRHELPER_CONTST_AL["."] = 42;
	QRHELPER_CONTST_AL[43] = "/";QRHELPER_CONTST_AL["/"] = 43;
	QRHELPER_CONTST_AL[44] = ":";QRHELPER_CONTST_AL[":"] = 44;

	// 8 bit bytes JIS8 encoding table
	var QRHELPER_CONST_JIS8 = new Array();
	QRHELPER_CONST_JIS8[0x20] = ' ';QRHELPER_CONST_JIS8[' '] = 0x20;
	QRHELPER_CONST_JIS8[0x21] = '!';QRHELPER_CONST_JIS8['!'] = 0x21;
	QRHELPER_CONST_JIS8[0x22] = '"';QRHELPER_CONST_JIS8['"'] = 0x22;
	QRHELPER_CONST_JIS8[0x23] = '#';QRHELPER_CONST_JIS8['#'] = 0x23;
	QRHELPER_CONST_JIS8[0x24] = '$';QRHELPER_CONST_JIS8['$'] = 0x24;
	QRHELPER_CONST_JIS8[0x25] = '%';QRHELPER_CONST_JIS8['%'] = 0x25;
	QRHELPER_CONST_JIS8[0x26] = '&';QRHELPER_CONST_JIS8['&'] = 0x26;
	QRHELPER_CONST_JIS8[0x27] = "'";QRHELPER_CONST_JIS8["'"] = 0x27;
	QRHELPER_CONST_JIS8[0x28] = '(';QRHELPER_CONST_JIS8['('] = 0x28;
	QRHELPER_CONST_JIS8[0x29] = ')';QRHELPER_CONST_JIS8[')'] = 0x29;
	QRHELPER_CONST_JIS8[0x2A] = '*';QRHELPER_CONST_JIS8['*'] = 0x2A;
	QRHELPER_CONST_JIS8[0x2B] = '+';QRHELPER_CONST_JIS8['+'] = 0x2B;
	QRHELPER_CONST_JIS8[0x2C] = ',';QRHELPER_CONST_JIS8[','] = 0x2C;
	QRHELPER_CONST_JIS8[0x2D] = '-';QRHELPER_CONST_JIS8['-'] = 0x2D;
	QRHELPER_CONST_JIS8[0x2E] = '.';QRHELPER_CONST_JIS8['.'] = 0x2E;
	QRHELPER_CONST_JIS8[0x2F] = '/';QRHELPER_CONST_JIS8['/'] = 0x2F;
	QRHELPER_CONST_JIS8[0x30] = '0';QRHELPER_CONST_JIS8['0'] = 0x30;
	QRHELPER_CONST_JIS8[0x31] = '1';QRHELPER_CONST_JIS8['1'] = 0x31;
	QRHELPER_CONST_JIS8[0x32] = '2';QRHELPER_CONST_JIS8['2'] = 0x32;
	QRHELPER_CONST_JIS8[0x33] = '3';QRHELPER_CONST_JIS8['3'] = 0x33;
	QRHELPER_CONST_JIS8[0x34] = '4';QRHELPER_CONST_JIS8['4'] = 0x34;
	QRHELPER_CONST_JIS8[0x35] = '5';QRHELPER_CONST_JIS8['5'] = 0x35;
	QRHELPER_CONST_JIS8[0x36] = '6';QRHELPER_CONST_JIS8['6'] = 0x36;
	QRHELPER_CONST_JIS8[0x37] = '7';QRHELPER_CONST_JIS8['7'] = 0x37;
	QRHELPER_CONST_JIS8[0x38] = '8';QRHELPER_CONST_JIS8['8'] = 0x38;
	QRHELPER_CONST_JIS8[0x39] = '9';QRHELPER_CONST_JIS8['9'] = 0x39;
	QRHELPER_CONST_JIS8[0x3A] = ':';QRHELPER_CONST_JIS8[':'] = 0x3A;
	QRHELPER_CONST_JIS8[0x3B] = ';';QRHELPER_CONST_JIS8[';'] = 0x3B;
	QRHELPER_CONST_JIS8[0x3C] = '<';QRHELPER_CONST_JIS8['<'] = 0x3C;
	QRHELPER_CONST_JIS8[0x3D] = '=';QRHELPER_CONST_JIS8['='] = 0x3D;
	QRHELPER_CONST_JIS8[0x3E] = '>';QRHELPER_CONST_JIS8['>'] = 0x3E;
	QRHELPER_CONST_JIS8[0x3F] = '?';QRHELPER_CONST_JIS8['?'] = 0x3F;
	QRHELPER_CONST_JIS8[0x40] = '@';QRHELPER_CONST_JIS8['@'] = 0x40;
	QRHELPER_CONST_JIS8[0x41] = 'A';QRHELPER_CONST_JIS8['A'] = 0x41;
	QRHELPER_CONST_JIS8[0x42] = 'B';QRHELPER_CONST_JIS8['B'] = 0x42;
	QRHELPER_CONST_JIS8[0x43] = 'C';QRHELPER_CONST_JIS8['C'] = 0x43;
	QRHELPER_CONST_JIS8[0x44] = 'D';QRHELPER_CONST_JIS8['D'] = 0x44;
	QRHELPER_CONST_JIS8[0x45] = 'E';QRHELPER_CONST_JIS8['E'] = 0x45;
	QRHELPER_CONST_JIS8[0x46] = 'F';QRHELPER_CONST_JIS8['F'] = 0x46;
	QRHELPER_CONST_JIS8[0x47] = 'G';QRHELPER_CONST_JIS8['G'] = 0x47;
	QRHELPER_CONST_JIS8[0x48] = 'H';QRHELPER_CONST_JIS8['H'] = 0x48;
	QRHELPER_CONST_JIS8[0x49] = 'I';QRHELPER_CONST_JIS8['I'] = 0x49;
	QRHELPER_CONST_JIS8[0x4A] = 'J';QRHELPER_CONST_JIS8['J'] = 0x4A;
	QRHELPER_CONST_JIS8[0x4B] = 'K';QRHELPER_CONST_JIS8['K'] = 0x4B;
	QRHELPER_CONST_JIS8[0x4C] = 'L';QRHELPER_CONST_JIS8['L'] = 0x4C;
	QRHELPER_CONST_JIS8[0x4D] = 'M';QRHELPER_CONST_JIS8['M'] = 0x4D;
	QRHELPER_CONST_JIS8[0x4E] = 'N';QRHELPER_CONST_JIS8['N'] = 0x4E;
	QRHELPER_CONST_JIS8[0x4F] = 'O';QRHELPER_CONST_JIS8['O'] = 0x4F;
	QRHELPER_CONST_JIS8[0x50] = 'P';QRHELPER_CONST_JIS8['P'] = 0x50;
	QRHELPER_CONST_JIS8[0x51] = 'Q';QRHELPER_CONST_JIS8['Q'] = 0x51;
	QRHELPER_CONST_JIS8[0x52] = 'R';QRHELPER_CONST_JIS8['R'] = 0x52;
	QRHELPER_CONST_JIS8[0x53] = 'S';QRHELPER_CONST_JIS8['S'] = 0x53;
	QRHELPER_CONST_JIS8[0x54] = 'T';QRHELPER_CONST_JIS8['T'] = 0x54;
	QRHELPER_CONST_JIS8[0x55] = 'U';QRHELPER_CONST_JIS8['U'] = 0x55;
	QRHELPER_CONST_JIS8[0x56] = 'V';QRHELPER_CONST_JIS8['V'] = 0x56;
	QRHELPER_CONST_JIS8[0x57] = 'W';QRHELPER_CONST_JIS8['W'] = 0x57;
	QRHELPER_CONST_JIS8[0x58] = 'X';QRHELPER_CONST_JIS8['X'] = 0x58;
	QRHELPER_CONST_JIS8[0x59] = 'Y';QRHELPER_CONST_JIS8['Y'] = 0x59;
	QRHELPER_CONST_JIS8[0x5A] = 'Z';QRHELPER_CONST_JIS8['Z'] = 0x5A;
	QRHELPER_CONST_JIS8[0x5B] = '[';QRHELPER_CONST_JIS8['['] = 0x5B;
	QRHELPER_CONST_JIS8[0x5C] = 'Â¥';QRHELPER_CONST_JIS8['Â¥'] = 0x5C;
	QRHELPER_CONST_JIS8[0x5D] = ']';QRHELPER_CONST_JIS8[']'] = 0x5D;
	QRHELPER_CONST_JIS8[0x5E] = '^';QRHELPER_CONST_JIS8['^'] = 0x5E;
	QRHELPER_CONST_JIS8[0x5F] = '_';QRHELPER_CONST_JIS8['_'] = 0x5F;
	QRHELPER_CONST_JIS8[0x60] = '`';QRHELPER_CONST_JIS8['`'] = 0x60;
	QRHELPER_CONST_JIS8[0x61] = 'a';QRHELPER_CONST_JIS8['a'] = 0x61;
	QRHELPER_CONST_JIS8[0x62] = 'b';QRHELPER_CONST_JIS8['b'] = 0x62;
	QRHELPER_CONST_JIS8[0x63] = 'c';QRHELPER_CONST_JIS8['c'] = 0x63;
	QRHELPER_CONST_JIS8[0x64] = 'd';QRHELPER_CONST_JIS8['d'] = 0x64;
	QRHELPER_CONST_JIS8[0x65] = 'e';QRHELPER_CONST_JIS8['e'] = 0x65;
	QRHELPER_CONST_JIS8[0x66] = 'f';QRHELPER_CONST_JIS8['f'] = 0x66;
	QRHELPER_CONST_JIS8[0x67] = 'g';QRHELPER_CONST_JIS8['g'] = 0x67;
	QRHELPER_CONST_JIS8[0x68] = 'h';QRHELPER_CONST_JIS8['h'] = 0x68;
	QRHELPER_CONST_JIS8[0x69] = 'i';QRHELPER_CONST_JIS8['i'] = 0x69;
	QRHELPER_CONST_JIS8[0x6A] = 'j';QRHELPER_CONST_JIS8['j'] = 0x6A;
	QRHELPER_CONST_JIS8[0x6B] = 'k';QRHELPER_CONST_JIS8['k'] = 0x6B;
	QRHELPER_CONST_JIS8[0x6C] = 'l';QRHELPER_CONST_JIS8['l'] = 0x6C;
	QRHELPER_CONST_JIS8[0x6D] = 'm';QRHELPER_CONST_JIS8['m'] = 0x6D;
	QRHELPER_CONST_JIS8[0x6E] = 'n';QRHELPER_CONST_JIS8['n'] = 0x6E;
	QRHELPER_CONST_JIS8[0x6F] = 'o';QRHELPER_CONST_JIS8['o'] = 0x6F;
	QRHELPER_CONST_JIS8[0x70] = 'p';QRHELPER_CONST_JIS8['p'] = 0x70;
	QRHELPER_CONST_JIS8[0x71] = 'q';QRHELPER_CONST_JIS8['q'] = 0x71;
	QRHELPER_CONST_JIS8[0x72] = 'r';QRHELPER_CONST_JIS8['r'] = 0x72;
	QRHELPER_CONST_JIS8[0x73] = 's';QRHELPER_CONST_JIS8['s'] = 0x73;
	QRHELPER_CONST_JIS8[0x74] = 't';QRHELPER_CONST_JIS8['t'] = 0x74;
	QRHELPER_CONST_JIS8[0x75] = 'u';QRHELPER_CONST_JIS8['u'] = 0x75;
	QRHELPER_CONST_JIS8[0x76] = 'v';QRHELPER_CONST_JIS8['v'] = 0x76;
	QRHELPER_CONST_JIS8[0x77] = 'w';QRHELPER_CONST_JIS8['w'] = 0x77;
	QRHELPER_CONST_JIS8[0x78] = 'x';QRHELPER_CONST_JIS8['x'] = 0x78;
	QRHELPER_CONST_JIS8[0x79] = 'y';QRHELPER_CONST_JIS8['y'] = 0x79;
	QRHELPER_CONST_JIS8[0x7A] = 'z';QRHELPER_CONST_JIS8['z'] = 0x7A;
	QRHELPER_CONST_JIS8[0x7B] = '{';QRHELPER_CONST_JIS8['{'] = 0x7B;
	QRHELPER_CONST_JIS8[0x7C] = '|';QRHELPER_CONST_JIS8['|'] = 0x7C;
	QRHELPER_CONST_JIS8[0x7D] = '}';QRHELPER_CONST_JIS8['}'] = 0x7D;
	QRHELPER_CONST_JIS8[0x7E] = 'Â¯';QRHELPER_CONST_JIS8['Â¯'] = 0x7E;

	// indicator model table
	var QRHELPER_CONST_MODE = new Array();
	QRHELPER_CONST_MODE["eci"] = "0111";
	QRHELPER_CONST_MODE["numeric"] = "0001";
	QRHELPER_CONST_MODE["alphanumeric"] = "0010";
	QRHELPER_CONST_MODE["8bitbyte"] = "0100";
	QRHELPER_CONST_MODE["kanji"] = "1000";
	QRHELPER_CONST_MODE["structured"] = "0011";
	QRHELPER_CONST_MODE["fnc1_first"] = "0101";
	QRHELPER_CONST_MODE["fnc1_second"] = "1001";
	QRHELPER_CONST_MODE["eof"] = "0000";

	// function pattern module count for each version
	var QRHELPER_CONST_FPM = new Array();
	QRHELPER_CONST_FPM[1] = 202;
	QRHELPER_CONST_FPM[2] = 235;
	QRHELPER_CONST_FPM[3] = 243;
	QRHELPER_CONST_FPM[4] = 251;
	QRHELPER_CONST_FPM[5] = 259;
	QRHELPER_CONST_FPM[6] = 267;
	QRHELPER_CONST_FPM[7] = 390;
	QRHELPER_CONST_FPM[8] = 398;
	QRHELPER_CONST_FPM[9] = 406;
	QRHELPER_CONST_FPM[10] = 414;
	QRHELPER_CONST_FPM[11] = 422;
	QRHELPER_CONST_FPM[12] = 430;
	QRHELPER_CONST_FPM[13] = 438;
	QRHELPER_CONST_FPM[14] = 611;
	QRHELPER_CONST_FPM[15] = 619;
	QRHELPER_CONST_FPM[16] = 627;
	QRHELPER_CONST_FPM[17] = 635;
	QRHELPER_CONST_FPM[18] = 643;
	QRHELPER_CONST_FPM[19] = 651;
	QRHELPER_CONST_FPM[20] = 659;
	QRHELPER_CONST_FPM[21] = 882;
	QRHELPER_CONST_FPM[22] = 890;
	QRHELPER_CONST_FPM[23] = 898;
	QRHELPER_CONST_FPM[24] = 906;
	QRHELPER_CONST_FPM[25] = 914;
	QRHELPER_CONST_FPM[26] = 922;
	QRHELPER_CONST_FPM[27] = 930;
	QRHELPER_CONST_FPM[28] = 1203;
	QRHELPER_CONST_FPM[29] = 1211;
	QRHELPER_CONST_FPM[30] = 1219;
	QRHELPER_CONST_FPM[31] = 1227;
	QRHELPER_CONST_FPM[32] = 1235;
	QRHELPER_CONST_FPM[33] = 1243;
	QRHELPER_CONST_FPM[34] = 1251;
	QRHELPER_CONST_FPM[35] = 1574;
	QRHELPER_CONST_FPM[36] = 1582;
	QRHELPER_CONST_FPM[37] = 1590;
	QRHELPER_CONST_FPM[38] = 1598;
	QRHELPER_CONST_FPM[39] = 1606;
	QRHELPER_CONST_FPM[40] = 1614;

	// Error correction characteristics
	// [
	//  number of blocks(1), data codewords in each block(1),
	//  number of blocks(2), data codewords in each block(2),
	//  number of error correction codewords
	//]
	var QRHELPER_CONST_BLK = new Array();
	QRHELPER_CONST_BLK["1L"] = [1, 0, 19, 0, 7, 24];
	QRHELPER_CONST_BLK["1M"] = [1, 0, 16, 0, 10, 20];
	QRHELPER_CONST_BLK["1Q"] = [1, 0, 13, 0, 13, 15];
	QRHELPER_CONST_BLK["1H"] = [1, 0, 9, 0, 17, 10];
	QRHELPER_CONST_BLK["2L"] = [1, 0, 34, 0, 10, 49];
	QRHELPER_CONST_BLK["2M"] = [1, 0, 28, 0, 16, 40];
	QRHELPER_CONST_BLK["2Q"] = [1, 0, 22, 0, 22, 31];
	QRHELPER_CONST_BLK["2H"] = [1, 0, 16, 0, 28, 20];
	QRHELPER_CONST_BLK["3L"] = [1, 0, 55, 0, 15, 79];
	QRHELPER_CONST_BLK["3M"] = [1, 0, 44, 0, 26, 60];
	QRHELPER_CONST_BLK["3Q"] = [2, 0, 17, 0, 36, 49];
	QRHELPER_CONST_BLK["3H"] = [2, 0, 13, 0, 44, 31];
	QRHELPER_CONST_BLK["4L"] = [1, 0, 80, 0, 20, 113];
	QRHELPER_CONST_BLK["4M"] = [2, 0, 32, 0, 36, 84];
	QRHELPER_CONST_BLK["4Q"] = [2, 0, 24, 0, 52, 69];
	QRHELPER_CONST_BLK["4H"] = [4, 0, 9, 0, 64, 46];
	QRHELPER_CONST_BLK["5L"] = [1, 0, 108, 0, 26, 154];
	QRHELPER_CONST_BLK["5M"] = [2, 0, 43, 0, 48, 116];
	QRHELPER_CONST_BLK["5Q"] = [2, 2, 15, 16, 72, 95];
	QRHELPER_CONST_BLK["5H"] = [2, 2, 11, 12, 88, 63];
	QRHELPER_CONST_BLK["6L"] = [2, 0, 68, 0, 36, 194];
	QRHELPER_CONST_BLK["6M"] = [4, 0, 27, 0, 64, 151];
	QRHELPER_CONST_BLK["6Q"] = [4, 0, 19, 0, 96, 122];
	QRHELPER_CONST_BLK["6H"] = [4, 0, 15, 0, 112, 81];
	QRHELPER_CONST_BLK["7L"] = [2, 0, 78, 0, 40, 244];
	QRHELPER_CONST_BLK["7M"] = [4, 0, 31, 0, 72, 188];
	QRHELPER_CONST_BLK["7Q"] = [2, 4, 14, 15, 108, 154];
	QRHELPER_CONST_BLK["7H"] = [4, 1, 13, 14, 130, 101];
	QRHELPER_CONST_BLK["8L"] = [2, 0, 97, 0, 48, 299];
	QRHELPER_CONST_BLK["8M"] = [2, 2, 38, 39, 88, 229];
	QRHELPER_CONST_BLK["8Q"] = [4, 2, 18, 19, 132, 183];
	QRHELPER_CONST_BLK["8H"] = [4, 2, 14, 15, 156, 123];
	QRHELPER_CONST_BLK["9L"] = [2, 0, 116, 0, 60, 354];
	QRHELPER_CONST_BLK["9M"] = [3, 2, 36, 37, 110, 267];
	QRHELPER_CONST_BLK["9Q"] = [4, 4, 16, 17, 160, 223];
	QRHELPER_CONST_BLK["9H"] = [4, 4, 12, 13, 192, 145];
	QRHELPER_CONST_BLK["10L"] = [2, 2, 68, 69, 72, 418];
	QRHELPER_CONST_BLK["10M"] = [4, 1, 43, 44, 130, 319];
	QRHELPER_CONST_BLK["10Q"] = [6, 2, 19, 20, 192, 262];
	QRHELPER_CONST_BLK["10H"] = [6, 2, 15, 16, 224, 176];
	QRHELPER_CONST_BLK["11L"] = [4, 0, 81, 0, 80, 485];
	QRHELPER_CONST_BLK["11M"] = [1, 4, 50, 51, 150, 368];
	QRHELPER_CONST_BLK["11Q"] = [4, 4, 22, 23, 224, 299];
	QRHELPER_CONST_BLK["11H"] = [3, 8, 12, 13, 264, 207];
	QRHELPER_CONST_BLK["12L"] = [2, 2, 92, 93, 96, 555];
	QRHELPER_CONST_BLK["12M"] = [6, 2, 36, 37, 176, 421];
	QRHELPER_CONST_BLK["12Q"] = [4, 6, 20, 21, 260, 351];
	QRHELPER_CONST_BLK["12H"] = [7, 4, 14, 15, 308, 236];
	QRHELPER_CONST_BLK["13L"] = [4, 0, 107, 0, 104, 624];
	QRHELPER_CONST_BLK["13M"] = [8, 1, 37, 38, 198, 479];
	QRHELPER_CONST_BLK["13Q"] = [8, 4, 20, 21, 288, 398];
	QRHELPER_CONST_BLK["13H"] = [12, 4, 11, 12, 352, 275];
	QRHELPER_CONST_BLK["14L"] = [3, 1, 115, 116, 120, 707];
	QRHELPER_CONST_BLK["14M"] = [4, 5, 40, 41, 216, 531];
	QRHELPER_CONST_BLK["14Q"] = [11, 5, 16, 17, 320, 447];
	QRHELPER_CONST_BLK["14H"] = [11, 5, 12, 13, 384, 302];
	QRHELPER_CONST_BLK["15L"] = [5, 1, 87, 88, 132];
	QRHELPER_CONST_BLK["15M"] = [5, 5, 41, 42, 240];
	QRHELPER_CONST_BLK["15Q"] = [5, 7, 24, 25, 360];
	QRHELPER_CONST_BLK["15H"] = [11, 7, 12, 13, 432];
	QRHELPER_CONST_BLK["16L"] = [5, 1, 98, 99, 144];
	QRHELPER_CONST_BLK["16M"] = [7, 3, 45, 46, 280];
	QRHELPER_CONST_BLK["16Q"] = [15, 2, 19, 20, 408];
	QRHELPER_CONST_BLK["16H"] = [3, 13, 15, 16, 480];
	QRHELPER_CONST_BLK["17L"] = [1, 5, 107, 108, 168];
	QRHELPER_CONST_BLK["17M"] = [10, 1, 46, 47, 308];
	QRHELPER_CONST_BLK["17Q"] = [1, 15, 22, 23, 448];
	QRHELPER_CONST_BLK["17H"] = [2, 17, 14, 15, 532];
	QRHELPER_CONST_BLK["18L"] = [5, 1, 120, 121, 180];
	QRHELPER_CONST_BLK["18M"] = [9, 4, 43, 44, 338];
	QRHELPER_CONST_BLK["18Q"] = [17, 1, 22, 23, 504];
	QRHELPER_CONST_BLK["18H"] = [2, 19, 14, 15, 588];
	QRHELPER_CONST_BLK["19L"] = [3, 4, 113, 114, 196];
	QRHELPER_CONST_BLK["19M"] = [3, 11, 44, 45, 364];
	QRHELPER_CONST_BLK["19Q"] = [17, 4, 21, 22, 546];
	QRHELPER_CONST_BLK["19H"] = [9, 16, 13, 14, 650];
	QRHELPER_CONST_BLK["20L"] = [3, 5, 107, 108, 224];
	QRHELPER_CONST_BLK["20M"] = [3, 13, 41, 42, 416];
	QRHELPER_CONST_BLK["20Q"] = [15, 5, 24, 25, 600];
	QRHELPER_CONST_BLK["20H"] = [15, 10, 15, 16, 700];
	QRHELPER_CONST_BLK["21L"] = [4, 4, 116, 117, 224];
	QRHELPER_CONST_BLK["21M"] = [17, 0, 42, 0, 442];
	QRHELPER_CONST_BLK["21Q"] = [17, 6, 22, 23, 644];
	QRHELPER_CONST_BLK["21H"] = [19, 6, 16, 17, 750];
	QRHELPER_CONST_BLK["22L"] = [2, 7, 111, 112, 252];
	QRHELPER_CONST_BLK["22M"] = [17, 0, 46, 0, 476];
	QRHELPER_CONST_BLK["22Q"] = [7, 16, 24, 25, 690];
	QRHELPER_CONST_BLK["22H"] = [34, 0, 13, 0, 816];
	QRHELPER_CONST_BLK["23L"] = [4, 5, 121, 122, 270];
	QRHELPER_CONST_BLK["23M"] = [4, 14, 47, 48, 504];
	QRHELPER_CONST_BLK["23Q"] = [11, 14, 24, 25, 750];
	QRHELPER_CONST_BLK["23H"] = [16, 14, 15, 16, 900];
	QRHELPER_CONST_BLK["24L"] = [6, 4, 117, 118, 300];
	QRHELPER_CONST_BLK["24M"] = [6, 14, 45, 46, 560];
	QRHELPER_CONST_BLK["24Q"] = [11, 16, 24, 25, 810];
	QRHELPER_CONST_BLK["24H"] = [30, 2, 16, 17, 960];
	QRHELPER_CONST_BLK["25L"] = [8, 4, 106, 107, 312];
	QRHELPER_CONST_BLK["25M"] = [8, 13, 47, 48, 588];
	QRHELPER_CONST_BLK["25Q"] = [7, 22, 24, 25, 870];
	QRHELPER_CONST_BLK["25H"] = [22, 13, 15, 16, 1050];
	QRHELPER_CONST_BLK["26L"] = [10, 2, 114, 115, 336];
	QRHELPER_CONST_BLK["26M"] = [19, 4, 46, 47, 644];
	QRHELPER_CONST_BLK["26Q"] = [28, 6, 22, 23, 952];
	QRHELPER_CONST_BLK["26H"] = [33, 4, 16, 17, 1110];
	QRHELPER_CONST_BLK["27L"] = [8, 4, 122, 123, 360];
	QRHELPER_CONST_BLK["27M"] = [22, 3, 45, 46, 700];
	QRHELPER_CONST_BLK["27Q"] = [8, 26, 23, 24, 1020];
	QRHELPER_CONST_BLK["27H"] = [12, 28, 15, 16, 1200];
	QRHELPER_CONST_BLK["28L"] = [3, 10, 117, 118, 390];
	QRHELPER_CONST_BLK["28M"] = [3, 23, 45, 46, 728];
	QRHELPER_CONST_BLK["28Q"] = [4, 31, 24, 25, 1050];
	QRHELPER_CONST_BLK["28H"] = [11, 31, 15, 16, 1260];
	QRHELPER_CONST_BLK["29L"] = [7, 7, 116, 117, 420];
	QRHELPER_CONST_BLK["29M"] = [21, 7, 45, 46, 784];
	QRHELPER_CONST_BLK["29Q"] = [1, 37, 23, 24, 1140];
	QRHELPER_CONST_BLK["29H"] = [19, 26, 15, 16, 1350];
	QRHELPER_CONST_BLK["30L"] = [5, 10, 115, 116, 450];
	QRHELPER_CONST_BLK["30M"] = [19, 10, 47, 48, 812];
	QRHELPER_CONST_BLK["30Q"] = [15, 25, 24, 25, 1200];
	QRHELPER_CONST_BLK["30H"] = [23, 25, 15, 16, 1440];
	QRHELPER_CONST_BLK["31L"] = [13, 3, 115, 116, 480];
	QRHELPER_CONST_BLK["31M"] = [2, 29, 46, 47, 868];
	QRHELPER_CONST_BLK["31Q"] = [42, 1, 24, 25, 1290];
	QRHELPER_CONST_BLK["31H"] = [23, 28, 15, 16, 1530];
	QRHELPER_CONST_BLK["32L"] = [17, 0, 115, 0, 510];
	QRHELPER_CONST_BLK["32M"] = [10, 23, 46, 47, 924];
	QRHELPER_CONST_BLK["32Q"] = [10, 35, 24, 25, 1350];
	QRHELPER_CONST_BLK["32H"] = [19, 35, 15, 16, 1620];
	QRHELPER_CONST_BLK["33L"] = [17, 1, 115, 116, 540];
	QRHELPER_CONST_BLK["33M"] = [14, 21, 46, 47, 980];
	QRHELPER_CONST_BLK["33Q"] = [29, 19, 24, 25, 1440];
	QRHELPER_CONST_BLK["33H"] = [11, 46, 15, 16, 1710];
	QRHELPER_CONST_BLK["34L"] = [13, 6, 115, 116, 570];
	QRHELPER_CONST_BLK["34M"] = [14, 23, 46, 47, 1036];
	QRHELPER_CONST_BLK["34Q"] = [44, 7, 24, 25, 1530];
	QRHELPER_CONST_BLK["34H"] = [59, 1, 16, 17, 1800];
	QRHELPER_CONST_BLK["35L"] = [12, 7, 121, 122, 570];
	QRHELPER_CONST_BLK["35M"] = [12, 26, 47, 48, 1064];
	QRHELPER_CONST_BLK["35Q"] = [39, 14, 24, 25, 1590];
	QRHELPER_CONST_BLK["35H"] = [22, 41, 15, 16, 1890];
	QRHELPER_CONST_BLK["36L"] = [6, 14, 121, 122, 600];
	QRHELPER_CONST_BLK["36M"] = [6, 34, 47, 48, 1120];
	QRHELPER_CONST_BLK["36Q"] = [46, 10, 24, 25, 1680];
	QRHELPER_CONST_BLK["36H"] = [2, 64, 15, 16, 1980];
	QRHELPER_CONST_BLK["37L"] = [17, 4, 122, 123, 630];
	QRHELPER_CONST_BLK["37M"] = [29, 14, 46, 47, 1204];
	QRHELPER_CONST_BLK["37Q"] = [49, 10, 24, 25, 1770];
	QRHELPER_CONST_BLK["37H"] = [24, 46, 15, 16, 2100];
	QRHELPER_CONST_BLK["38L"] = [4, 18, 122, 123, 660];
	QRHELPER_CONST_BLK["38M"] = [13, 32, 46, 47, 1260];
	QRHELPER_CONST_BLK["38Q"] = [48, 14, 24, 25, 1860];
	QRHELPER_CONST_BLK["38H"] = [42, 32, 15, 16, 2220];
	QRHELPER_CONST_BLK["39L"] = [20, 4, 117, 118, 720];
	QRHELPER_CONST_BLK["39M"] = [40, 7, 47, 48, 1316];
	QRHELPER_CONST_BLK["39Q"] = [43, 22, 24, 25, 1950];
	QRHELPER_CONST_BLK["39H"] = [10, 67, 15, 16, 2310];
	QRHELPER_CONST_BLK["40L"] = [19, 6, 118, 119, 750];
	QRHELPER_CONST_BLK["40M"] = [18, 31, 47, 48, 1372];
	QRHELPER_CONST_BLK["40Q"] = [34, 34, 24, 25, 2040];
	QRHELPER_CONST_BLK["40H"] = [20, 61, 15, 16, 2430];

	// Alignment coordinates for each version
	var QRHELPER_CONST_ALG = new Array();
	QRHELPER_CONST_ALG[1] = [];
	QRHELPER_CONST_ALG[2] = [6, 18];
	QRHELPER_CONST_ALG[3] = [6, 22];
	QRHELPER_CONST_ALG[4] = [6, 26];
	QRHELPER_CONST_ALG[5] = [6, 30];
	QRHELPER_CONST_ALG[6] = [6, 34];
	QRHELPER_CONST_ALG[7] = [6, 22, 38];
	QRHELPER_CONST_ALG[8] = [6, 24, 42];
	QRHELPER_CONST_ALG[9] = [6, 26, 46];
	QRHELPER_CONST_ALG[10] = [6, 28, 50];
	QRHELPER_CONST_ALG[11] = [6, 30, 54];
	QRHELPER_CONST_ALG[12] = [6, 32, 58];
	QRHELPER_CONST_ALG[13] = [6, 34, 62];
	QRHELPER_CONST_ALG[14] = [6, 26, 46, 66];
	QRHELPER_CONST_ALG[15] = [6, 26, 48, 70];
	QRHELPER_CONST_ALG[16] = [6, 26, 50, 74];
	QRHELPER_CONST_ALG[17] = [6, 30, 54, 78];
	QRHELPER_CONST_ALG[18] = [6, 30, 56, 82];
	QRHELPER_CONST_ALG[19] = [6, 30, 58, 86];
	QRHELPER_CONST_ALG[20] = [6, 34, 62, 90];
	QRHELPER_CONST_ALG[21] = [6, 28, 50, 72, 94];
	QRHELPER_CONST_ALG[22] = [6, 26, 50, 74, 98];
	QRHELPER_CONST_ALG[23] = [6, 30, 54, 78, 102];
	QRHELPER_CONST_ALG[24] = [6, 28, 54, 80, 106];
	QRHELPER_CONST_ALG[25] = [6, 32, 58, 84, 110];
	QRHELPER_CONST_ALG[26] = [6, 30, 58, 86, 114];
	QRHELPER_CONST_ALG[27] = [6, 34, 62, 90, 118];
	QRHELPER_CONST_ALG[28] = [6, 26, 50, 74, 98, 122];
	QRHELPER_CONST_ALG[29] = [6, 30, 54, 78, 102, 126];
	QRHELPER_CONST_ALG[30] = [6, 26, 52, 78, 104, 130];
	QRHELPER_CONST_ALG[31] = [6, 30, 56, 82, 108, 134];
	QRHELPER_CONST_ALG[32] = [6, 34, 60, 86, 112, 138];
	QRHELPER_CONST_ALG[33] = [6, 30, 58, 86, 114, 142];
	QRHELPER_CONST_ALG[34] = [6, 34, 62, 90, 118, 146];
	QRHELPER_CONST_ALG[35] = [6, 30, 54, 78, 102, 126, 150];
	QRHELPER_CONST_ALG[36] = [6, 24, 50, 76, 102, 128, 154];
	QRHELPER_CONST_ALG[37] = [6, 28, 54, 80, 106, 132, 158];
	QRHELPER_CONST_ALG[38] = [6, 32, 58, 84, 110, 136, 162];
	QRHELPER_CONST_ALG[39] = [6, 26, 54, 82, 110, 138, 166];
	QRHELPER_CONST_ALG[40] = [6, 30, 58, 86, 114, 142, 170];

	// version information bits for each version
	var QRHELPER_CONST_VERBIT = new Array();
	QRHELPER_CONST_VERBIT[7] = "000111110010010100";
	QRHELPER_CONST_VERBIT[8] = "001000010110111100";
	QRHELPER_CONST_VERBIT[9] = "001001101010011001";
	QRHELPER_CONST_VERBIT[10] = "001010010011010011";
	QRHELPER_CONST_VERBIT[11] = "001011101111110110";
	QRHELPER_CONST_VERBIT[12] = "001100011101100010";
	QRHELPER_CONST_VERBIT[13] = "001101100001000111";
	QRHELPER_CONST_VERBIT[14] = "001110011000001101";
	QRHELPER_CONST_VERBIT[15] = "001111100100101000";
	QRHELPER_CONST_VERBIT[16] = "010000101101111000";
	QRHELPER_CONST_VERBIT[17] = "010001010001011101";
	QRHELPER_CONST_VERBIT[18] = "010010101000010111";
	QRHELPER_CONST_VERBIT[19] = "010011010100110010";
	QRHELPER_CONST_VERBIT[20] = "010100100110100110";
	QRHELPER_CONST_VERBIT[21] = "010101011010000011";
	QRHELPER_CONST_VERBIT[22] = "010110100011001001";
	QRHELPER_CONST_VERBIT[23] = "010111011111101100";
	QRHELPER_CONST_VERBIT[24] = "011000111011000100";
	QRHELPER_CONST_VERBIT[25] = "011001000111100001";
	QRHELPER_CONST_VERBIT[26] = "011010111110101011";
	QRHELPER_CONST_VERBIT[27] = "011011000010001110";
	QRHELPER_CONST_VERBIT[28] = "011100110000011010";
	QRHELPER_CONST_VERBIT[29] = "011101001100111111";
	QRHELPER_CONST_VERBIT[30] = "011110110101110101";
	QRHELPER_CONST_VERBIT[31] = "011111001001010000";
	QRHELPER_CONST_VERBIT[32] = "100000100111010101";
	QRHELPER_CONST_VERBIT[33] = "100001011011110000";
	QRHELPER_CONST_VERBIT[34] = "100010100010111010";
	QRHELPER_CONST_VERBIT[35] = "100011011110011111";
	QRHELPER_CONST_VERBIT[36] = "100100101100001011";
	QRHELPER_CONST_VERBIT[37] = "100101010000101110";
	QRHELPER_CONST_VERBIT[38] = "100110101001100100";
	QRHELPER_CONST_VERBIT[39] = "100111010101000001";
	QRHELPER_CONST_VERBIT[40] = "101000110001101001";

	module.exports = QRCoder;

/***/ },
/* 15 */,
/* 16 */
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
/* 17 */
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
/* 18 */
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
	      case 34: // "
	        escape = '&quot;';
	        break;
	      case 38: // &
	        escape = '&amp;';
	        break;
	      case 39: // '
	        escape = '&#39;';
	        break;
	      case 60: // <
	        escape = '&lt;';
	        break;
	      case 62: // >
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

	  return lastIndex !== index
	    ? html + str.substring(lastIndex, index)
	    : html;
	}


/***/ }
/******/ ]);