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
/******/ ({

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(7);
	document.addEventListener('DOMContentLoaded', function () {

	  // get background js
	  var main = chrome.extension.getBackgroundPage().main;
	  // event bind enginStart
	  document.getElementById('enginStart').addEventListener('click', function () {
	    chrome.tabs.query({
	      currentWindow: true,
	      active: true
	    }, function (tabObjArray) {
	      if (tabObjArray.length < 1) {
	        alert('getTabIndex faild, please refresh the page and try again ');
	        return;
	      }
	      main(tabObjArray[0].id);
	    });
	  });

	  // event bind viewH5
	  document.getElementById('viewH5page').addEventListener('click', signalVewH5);
	  // return;
	  // var data = chrome.extension.getBackgroundPage().articleData;

	  document.getElementById('page_view_setting_change').checked = localStorage["plugin-platform-setting-viewH5-disabled"] === "true" ? true : false;
	  document.getElementById('page_view_setting_change').onclick = function (ev) {
	    var $this = ev.target;
	    localStorage["plugin-platform-setting-viewH5-disabled"] = $this.checked;
	  };
	});

	// 点击viewH5发出的事件
	function signalVewH5() {
	  chrome.tabs.query({
	    currentWindow: true,
	    active: true
	  }, function (tabObjArray) {
	    if (tabObjArray.length < 1) {
	      alert('GetTabIndex faild, please refresh the page and try again ');
	      return;
	    }
	    // tabObjArray[0].id
	    chrome.tabs.sendMessage(tabObjArray[0].id, {
	      type: "plugin:viewH5",
	      msg: "view H5 page in current tab",
	      context: "view H5 page in current tab"
	    });
	    chrome.tabs.insertCSS(tabObjArray[0].id, {
	      file: '/lib/content_script_bundle_style.css',
	      allFrames: false
	    });
	  });
	}

/***/ },

/***/ 7:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });