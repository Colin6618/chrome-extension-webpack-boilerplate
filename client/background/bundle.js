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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ function(module, exports) {

	// var util = require('./util/util.js');
	// var callBuffer = require('./util/callBuffer.js');

	// get the url domain
	// function getDomainFromUrl(url) {
	//   var host = "null";
	//   if (typeof url == "undefined" || null == url)
	//     url = window.location.href;
	//   var regex = /^(http|https):\/\/([^\/]*).*/;
	//   var match = url.match(regex);
	//   if (typeof match != "undefined" && null != match)
	//     host = match[2];
	//   return host;
	// }

	// frequently used api

	// watch the tab changed
	// chrome.webNavigation.onCompleted.addListener(function (tab){});

	// browser tab
	// chrome.browserAction.onClicked.addListener(function (tab){});
	"use strict";

/***/ }
/******/ ]);