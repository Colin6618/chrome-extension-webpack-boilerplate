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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	'use strict';

	// var mockAssertUrl = require('./mockConfig.json');
	// http://plugin.labs.taobao.net/api/get-plugins-config
	// var ajax = require('marmottajax');
	// 如何把 promise的值丢出来给外面是个问题， ES7的async await解决了这个问题，外面需要try catch ，因为await拿到的不是promise（不然就没必要使用await），reject的内容以errorThrown出来。注意asyc方法不能作为对象的变量，因为方法被generator包起来了,this 不再是外部对象

	// var ppg = require('./printPublicGists.js');
	module.exports = {
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
	      // pluginJsonFile = {"success":true,"configs":{"name":"get-plugins-config","version":"1.0.0","background":{"scripts":["//g.alicdn.com/kg/cp-tms/0.0.3/background.js"]},"content_scripts":[{"matches":["*://*.taobao.com/*"],"js":["//g.alicdn.com/kg/cp-tms/0.0.3/index.js"]}],"message":"~愈之~启用的插件配置信息获取成功"}};
	      // pluginJsonFile = pluginJsonFile.configs;
	    }).fail(function (jqXHR, textStatus, errorThrown) {
	      console.log('getPluginAssetsConifg failed');
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
	  },
	  getP: function getP() {
	    var jqXHR = $.ajax({
	      dataType: "json",
	      url: 'https://g.alicdn.com/kg/cp-rulers/0.0.1/index.js',
	      async: false // it must be sync
	    });
	    jqXHR.done(function (ret, textStatus, jqXHR) {
	      // debugger;
	    }).fail(function (jqXHR, textStatus, errorThrown) {
	      console.log('获取插件配置文件失败');
	      console.log(jqXHR);
	      // debugger;
	    });
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var format = function format(url) {
	  if (/http(s)?\:/.test(url)) return url;else return 'http:' + url;
	};

	module.exports = {
	  format: format
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

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

	module.exports = whiteHosts;

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

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
	var configLoader = __webpack_require__(2);
	var util = __webpack_require__(3);
	var whiteHosts = __webpack_require__(4);
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

	// var currentTabId = 0;
	// var currentWindowId = 0;

	//check the url string
	// if in the white list -> active the page Action
	function checkForValidUrl(tabId, changeInfo, tab) {
	  if (tab.url.indexOf("chrome-devtools://") > -1 || tab.url.indexOf("chrome-extension://") > -1) return;
	  var hostToChecked = getDomainFromUrl(tab.url).toLowerCase();
	  for (var i = 0; i < whiteHosts.length; i++) {
	    // convert a csp exp string to reg exp
	    var hostRegExp = whiteHosts[i].replace(/\./g, '\\.').replace(/\*/g, '\.\*');
	    if (new RegExp(hostRegExp).test(hostToChecked)) {
	      chrome.pageAction.show(tabId);
	      break;
	    }
	  }
	};

	// watch the tab changed
	// get ride of most runtime errors, the enviroment is important for the plugins
	// check the whitelist
	chrome.tabs.onUpdated.addListener(checkForValidUrl);

	// click page action icon event
	// it runs after the check 🐳

	var main = window.main = function (tab) {

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
	    jsSrcUrl = util.format(jsSrcUrl);
	    // jsSrcUrl = "http://g.alicdn.com/kg/cp-tms/0.0./index.js?_=1462167227490"
	    var jqXHR = $.ajax({
	      url: jsSrcUrl,
	      // contentType: 'application/javascript; charset=utf-8',
	      cache: false,
	      dataType: 'text' // it must be text, cannot be script, due to crsd rules in jquery
	    });
	    jqXHR.done(function (jsContent, aaa, bbb) {
	      // response is empty, insertCSS throws error
	      if (jsContent) {
	        chrome.tabs.executeScript(tab.id, {
	          code: jsContent,
	          allFrames: false
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
	    cssSrcUrl = util.format(cssSrcUrl);
	    $.ajax({
	      url: cssSrcUrl,
	      cache: false,
	      dataType: 'text'
	    }).done(function (cssContent) {
	      // response is empty, insertCSS throws error
	      if (cssContent) {
	        chrome.tabs.insertCSS({
	          code: cssContent,
	          allFrames: false
	        });
	      }
	    }).fail(function (info) {
	      console.log(info);
	    });
	  }
	};

	// chrome.pageAction.onClicked.addListener(main);

/***/ }
/******/ ]);