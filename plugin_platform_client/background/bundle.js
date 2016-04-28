/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].e;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			e: {},
/******/ 			i: moduleId,
/******/ 			l: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.e, module, module.e, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// var mockAssertUrl = require('./mockConfig.json');
	// http://plugin.labs.taobao.net/api/get-plugins-config
	var ajax = __webpack_require__(1);
	// 如何把 promise的值丢出来给外面是个问题， ES7的async await解决了这个问题，外面需要try catch ，因为await拿到的不是promise（不然就没必要使用await），reject的内容以errorThrown出来。注意asyc方法不能作为对象的变量，因为方法被generator包起来了,this 不再是外部对象

	// var ppg = require('./printPublicGists.js');
	module.e = {
	  getPluginAssets: function getPluginAssets() {
	    var self = this;
	    var env = self.getEnv();
	    var url = self.getOptionDomain();
	    var pluginJsonFile = {};
	    var jqXHR = $.ajax({
	      dataType: "json",
	      url: url,
	      async: false // it must be sync
	    });
	    jqXHR.done(function (ret, textStatus, jqXHR) {
	      if (env === 'local') {
	        pluginJsonFile = ret;
	      } else {
	        pluginJsonFile = ret.configs;
	      }
	    }).fail(function (jqXHR, textStatus, errorThrown) {
	      console.log('获取插件配置文件失败');
	      console.log(jqXHR);
	    });
	    return pluginJsonFile;
	  },
	  getOptionDomain: function getOptionDomain() {
	    var domain = this.getEnv();
	    var configlUrl = {
	      local: 'http://127.0.0.1:3290/plugin.json',
	      prepub: 'http://plugin.labs.taobao.net:6001/api/getPluginsConfig',
	      online: 'http://plugin.labs.taobao.net/api/getPluginsConfig'
	    };
	    switch (domain) {
	      case 'local':
	        return configlUrl.local;
	      case 'prepub':
	        return configlUrl.prepub;
	      case 'online':
	        return configlUrl.online;
	      default:
	        return configlUrl.online;
	    }
	  },
	  getEnv: function getEnv() {
	    return localStorage["plugin-platform-setting-domain"] || "online";
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * main.js
	 *
	 * Main librairy file
	 */

	var arr_contains = function arr_contains(obj, to_find) {
	    var i = obj.length;
	    while (i--) {
	        if (obj[i] === to_find) {
	            return true;
	        }
	    }
	    return false;
	},
	    extend = function extend(o1, o2) // Two objects, !! writes to o1 !!
	{
	    for (var p in o2) {
	        o1[p] = o2[p];
	    }
	},
	    serialize = function serialize(obj, prefix) {
	    var p,
	        str = [];
	    for (p in obj) {
	        if (obj.hasOwnProperty(p)) {
	            var v = obj[p],
	                is_obj = (typeof v === "undefined" ? "undefined" : _typeof(v)) == "object",
	                k = prefix ? prefix + "[" + (isNaN(+p) || is_obj ? p : '') + "]" : p;
	            str.push(is_obj ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
	        }
	    }
	    return str.join("&");
	},
	    marmottajax = function marmottajax() // MAIN
	{
	    if (this.self) return new marmottajax(marmottajax.normalize(arguments));

	    var data = marmottajax.normalize(arguments);

	    if (data === null) throw "Invalid arguments";

	    extend(this, data);

	    if (this.method.toUpperCase() != 'GET') this.postData = serialize(this.parameters);else this.url += (this.url.slice(-1) == '?' ? '' : '?') + serialize(this.parameters);

	    this.setXhr();
	    this.setWatcher();
	};
	module.e = marmottajax;

	/**
	 * constants.js
	 *
	 * Constants variables
	 */

	marmottajax.defaultData = {

	    method: "get",
	    json: false,
	    watch: -1,

	    parameters: {}

	};

	marmottajax.validMethods = ["get", "post", "put", "update", "delete"];
	marmottajax.okStatusCodes = [200, 201, 202, 203, 204, 205, 206];

	/**
	 * normalize-data.js
	 *
	 * Normalize data in Ajax request
	 */

	marmottajax.normalize = function (data) {

	    /**
	     * Search data in arguments
	     */

	    if (data.length === 0) {

	        return null;
	    }

	    var result = {};

	    if (data.length === 1 && _typeof(data[0]) === "object") {

	        result = data[0];
	    } else if (data.length === 1 && typeof data[0] === "string") {

	        result = {

	            url: data[0]

	        };
	    } else if (data.length === 2 && typeof data[0] === "string" && _typeof(data[1]) === "object") {

	        data[1].url = data[0];

	        result = data[1];
	    }

	    /**
	     * Normalize data in arguments
	     */

	    if (!(typeof result.method === "string" && marmottajax.validMethods.indexOf(result.method.toLowerCase()) != -1)) {

	        result.method = marmottajax.defaultData.method;
	    } else {

	        result.method = result.method.toLowerCase();
	    }

	    if (typeof result.json !== "boolean") {

	        result.json = marmottajax.defaultData.json;
	    }

	    if (typeof result.watch !== "number") {

	        result.watch = marmottajax.defaultData.watch;
	    }

	    if (_typeof(result.parameters) !== "object") {

	        result.parameters = marmottajax.defaultData.parameters;
	    }

	    if (_typeof(result.headers) !== "object") {

	        result.headers = marmottajax.defaultData.headers;
	    }

	    return result;
	};
	/**
	 * set-xhr.js
	 *
	 * Set Watcher
	 */

	marmottajax.prototype.setWatcher = function () {

	    if (this.watch !== -1) {

	        this.watchIntervalFunction = function () {

	            if (this.xhr.readyState === 4 && arr_contains(marmottajax.okStatusCodes, this.xhr.status)) {

	                this.updateXhr();
	            }

	            this.watcherTimeout();
	        };

	        this.watcherTimeout();

	        this.stop = function () {

	            this.changeTime(-1);
	        };

	        this.changeTime = function (newTime) {

	            clearTimeout(this.changeTimeout);

	            this.watch = typeof newTime === "number" ? newTime : this.watch;

	            this.watcherTimeout();
	        };
	    }
	};
	/**
	 * set-xhr.js
	 *
	 * Set XMLHttpRequest
	 */

	marmottajax.prototype.setXhr = function () {

	    this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

	    this.xhr.lastResult = null;

	    this.xhr.json = this.json;
	    this.xhr.binding = null;

	    this.bind = function (binding) {

	        this.xhr.binding = binding;

	        return this;
	    };

	    this.cancel = function (callback) {

	        this.xhr.abort();

	        return this;
	    };

	    this.xhr.callbacks = {

	        then: [],
	        change: [],
	        error: []

	    };

	    for (var name in this.xhr.callbacks) {

	        if (this.xhr.callbacks.hasOwnProperty(name)) {

	            this[name] = function (name) {

	                return function (callback) {

	                    this.xhr.callbacks[name].push(callback);

	                    return this;
	                };
	            }(name);
	        }
	    }

	    this.xhr.call = function (categorie, result) {

	        for (var i = 0; i < this.callbacks[categorie].length; i++) {

	            if (typeof this.callbacks[categorie][i] === "function") {

	                if (this.binding) {

	                    this.callbacks[categorie][i].call(this.binding, result);
	                } else {

	                    this.callbacks[categorie][i](result);
	                }
	            }
	        }
	    };

	    this.xhr.onreadystatechange = function () {

	        if (this.readyState === 4 && arr_contains(marmottajax.okStatusCodes, this.status)) {

	            var result = this.responseText;

	            if (this.json) {

	                try {

	                    result = JSON.parse(result);
	                } catch (error) {

	                    this.call("error", "invalid json");

	                    return false;
	                }
	            }

	            this.lastResult = result;

	            this.call("then", result);
	        } else if (this.readyState === 4 && this.status == 404) {

	            this.call("error", "404");
	        } else if (this.readyState === 4) {

	            this.call("error", "unknow");
	        }
	    };

	    this.xhr.open(this.method, this.url, true);
	    this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	    if (this.headers) {
	        for (header in this.headers) {
	            if (this.headers.hasOwnProperty(header)) {

	                this.xhr.setRequestHeader(header, this.headers[header]);
	            }
	        }
	    }

	    this.xhr.send(typeof this.postData != "undefined" ? this.postData : null);
	};
	/**
	 * update-xhr.js
	 *
	 * Update XMLHttpRequest result
	 */

	marmottajax.prototype.updateXhr = function () {

	    var data = {

	        lastResult: this.xhr.lastResult,

	        json: this.xhr.json,
	        binding: this.xhr.binding,

	        callbacks: {

	            then: this.xhr.callbacks.then,
	            change: this.xhr.callbacks.change,
	            error: this.xhr.callbacks.error

	        }

	    };

	    this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

	    this.xhr.lastResult = data.lastResult;

	    this.xhr.json = data.json;
	    this.xhr.binding = data.binding;

	    this.xhr.callbacks = {

	        then: data.callbacks.then,
	        change: data.callbacks.change,
	        error: data.callbacks.error

	    };

	    this.xhr.call = function (categorie, result) {

	        for (var i = 0; i < this.callbacks[categorie].length; i++) {

	            if (typeof this.callbacks[categorie][i] === "function") {

	                if (this.binding) {

	                    this.callbacks[categorie][i].call(this.binding, result);
	                } else {

	                    this.callbacks[categorie][i](result);
	                }
	            }
	        }
	    };

	    this.xhr.onreadystatechange = function () {

	        if (this.readyState === 4 && arr_contains(marmottajax.okStatusCodes, this.status)) {

	            var result = this.responseText;

	            if (this.json) {

	                try {

	                    result = JSON.parse(result);
	                } catch (error) {

	                    this.call("error", "invalid json");

	                    return false;
	                }
	            }

	            isDifferent = this.lastResult != result;

	            try {

	                isDifferent = (typeof this.lastResult !== "string" ? JSON.stringify(this.lastResult) : this.lastResult) != (typeof result !== "string" ? JSON.stringify(result) : result);
	            } catch (error) {}

	            if (isDifferent) {

	                this.call("change", result);
	            }

	            this.lastResult = result;
	        } else if (this.readyState === 4 && this.status == 404) {

	            this.call("error", "404");
	        } else if (this.readyState === 4) {

	            this.call("error", "unknow");
	        }
	    };

	    this.xhr.open(this.method, this.url, true);
	    this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    this.xhr.send(typeof postData != "undefined" ? postData : null);
	};

	/**
	 * set-xhr.js
	 *
	 * Set Watcher 
	 */

	marmottajax.prototype.watcherTimeout = function () {

	    if (this.watch !== -1) {

	        this.changeTimeout = setTimeout(function (that) {

	            return function () {

	                that.watchIntervalFunction();
	            };
	        }(this), this.watch);
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// 内容脚本不能：
	// 调用 chrome.* API，除了以下 API：
	// extension（getURL、inIncognitoContext、lastError、onRequest、sendRequest）
	// i18n
	// runtime（connect、getManifest、getURL、id、onConnect、onMessage、sendMessage）
	// storage
	// 使用所属扩展程序页面中定义的变量或函数
	// 使用网页或其他内容脚本中定义的变量或函数

	// get sources url from server
	// import 'babel-polyfill';
	var configLoader = __webpack_require__(0);

	// var configLoader_ = require('./printPublicGists.js');

	// var mockAssertUrl = configLoader.getPluginAssets();

	// var pluginJsonFile = {};
	// getPluginAssets.done(function(ret){
	//   pluginJsonFile = ret;
	// }).fail(function(jqXHR, textStatus, errorThrown){
	//   console.log('获取插件配置文件失败')
	// });

	// var domain = configLoader.getOptionDomain();
	// for (var i = 0; i < backgroundScripts.length; i++) {
	//   document.write('<script src="' + backgroundScripts[i] + '" ></script>');
	// }

	// const getUrl1 = "http://127.0.0.1:8000/platform/background/background0.js";
	// const getUrl2 = "http://127.0.0.1:8000/platform/background/background00.js";
	// document.write('<script src="' + getUrl1 + '" ></script>');
	// document.write('<script src="' + getUrl2 + '" ></script>');

	// get the url domain
	function getDomainFromUrl(url) {
	  var host = "null";
	  if (typeof url == "undefined" || null == url) url = window.location.href;
	  var regex = /.*\:\/\/([^\/]*).*/;
	  var match = url.match(regex);
	  if (typeof match != "undefined" && null != match) host = match[1];
	  return host;
	}
	var whiteHosts = ['*.taobao.com', '*.taohua.com', '*.taobao.net', '*.taobao.org', '*.tw.taobao.com', '*.taobao.ali.com', '*.tmall.com', '*.tmall.hk', '*.juhuasuan.com', '*.etao.com', '*.tao123.com', '*.aliyun.com', '*.hitao.com', '*.alibado.com', '*.youshuyuan.com', '*.yahoo.com.cn', '*.aliloan.com', '*.alibaba-inc.com', '*.alibaba.com', '*.alibaba.com.cn', '*.alibaba.net', '*.xiami.com', '*.1688.com', '*.yunos.com', '*.atatech.org', '*.laiwang.com', '*.aliexpress.com', '*.koubei.com', '*.itao.com', '*.alimama.com',
	//淘点点
	'*.tdd.la', '*.aliqin.cn', '*.itao.com', '*.net.cn', '*.aliloan.com', '*.alibado.com', '*.ali.com',
	//淘宝航旅
	'*.alitrip.com', '*.dingtalk.com',
	//阿里云备案
	'*.gein.cn',
	//神马搜索
	'*.sm.cn', '*.tanx.com',
	//极有家
	'*.jiyoujia.com', 'gw.alicdn.com', '*.miiee.com', '*.imaijia.com', '*.alidayu.com', '*.cainiao.com', '*.alihealth.cn'];
	//check the url string
	// if in the white list -> active the page Action
	function checkForValidUrl(tabId, changeInfo, tab) {
	  if (tab.url.indexOf("chrome-devtools://") > -1) return;
	  var hostToChecked = getDomainFromUrl(tab.url).toLowerCase();
	  for (var i = 0; i < whiteHosts.length; i++) {
	    // convert a csp exp string to reg exp
	    var hostRegExp = whiteHosts[i].replace(/\./g, '\\.').replace(/\*/g, '\.\*');
	    if (new RegExp(hostRegExp).test(hostToChecked)) {
	      chrome.pageAction.show(tabId);
	    }
	  }
	};

	// watch the tab changed
	// get ride of most runtime errors, the enviroment is important for the plugins
	// check the whitelist
	chrome.tabs.onUpdated.addListener(checkForValidUrl);

	// chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	//     chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});
	// });

	// click page action icon event
	// it runs after the check 🐳
	chrome.pageAction.onClicked.addListener(function (tab) {
	  // chrome.notifications.create(
	  //   'name-for-notification',
	  //   {
	  //     type: 'basic',
	  //     iconUrl: '../img/k-ghost-view-icon.png',
	  //     title: "This is a notification",
	  //     message: "message",
	  //     buttons: [{title:"goto update", iconUrl: '../img/k-ghost-view-icon.png'}]
	  //   },
	  //   function() {}
	  // );
	  // chrome.notifications.onButtonClicked.addListener(function (id, n2){
	  //   console.log(id);
	  // })

	  var pluginJsonFile = configLoader.getPluginAssets();
	  // var pluginJsonFile_ = configLoader_.getPluginAssets_();
	  if (!pluginJsonFile) {
	    console.log('pluginConfig file is empty!');
	  }

	  try {
	    // var backgroundScripts = pluginJsonFile.background.scripts;
	    var contentScripts = pluginJsonFile.content_scripts;
	  } catch (err) {
	    console.log(err);
	    chrome.tabs.sendMessage(tab.id, {
	      type: "plugin:error",
	      msg: "Get plugin config error",
	      context: pluginJsonFile
	    });
	    return;
	  }
	  // programic injection: javascript files
	  for (var i = 0; i < contentScripts.length; i++) {
	    var jsSrcUrl = contentScripts[i].js[0];
	    // chrome.tabs.executeScript({
	    //   code: '$.getScript("' + jsSrcUrl + '")',
	    //   allFrames: true
	    // });
	    $.ajax({
	      url: jsSrcUrl
	    }).done(function (jsContent) {
	      // response is empty, insertCSS throws error
	      if (jsContent) {
	        chrome.tabs.executeScript({
	          code: jsContent,
	          allFrames: true
	        });
	      }
	    }).fail(function (info) {
	      console.log(info);
	    });
	  }

	  // programic injection: style files
	  for (var k = 0; k < contentScripts.length; k++) {
	    if (!contentScripts[k].css) continue;
	    var cssSrcUrl = contentScripts[k].css[0];
	    // console.log(cssSrcUrl);
	    $.ajax({
	      url: cssSrcUrl
	    }).done(function (cssContent) {
	      // response is empty, insertCSS throws error
	      if (cssContent) {
	        chrome.tabs.insertCSS({
	          code: cssContent,
	          allFrames: true
	        });
	      }
	    }).fail(function (info) {
	      console.log(info);
	    });
	  }
	});

/***/ }
/******/ ]);