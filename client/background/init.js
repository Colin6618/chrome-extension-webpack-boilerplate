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
var configLoader = require('./configLoader.js');
var util = require('./util/util.js');
var whiteHosts = require('./util/whitelist.js');
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
  if (typeof url == "undefined" || null == url)
    url = window.location.href;
  var regex = /.*\:\/\/([^\/]*).*/;
  var match = url.match(regex);
  if (typeof match != "undefined" && null != match)
    host = match[1];
  return host;
}

// var currentTabId = 0;
// var currentWindowId = 0;

//check the url string
// if in the white list -> active the page Action
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf("chrome-devtools://") > -1 || tab.url.indexOf("chrome-extension://") > -1 ) return;
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

var main = window.main = function(tab) {

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
    })
    return;
  }

  // programic injection: javascript files
  for (var i = 0; i < contentScripts.length; i++) {
    let jsSrcUrl = contentScripts[i].js[0];
    jsSrcUrl = util.format(jsSrcUrl);
    // jsSrcUrl = "http://g.alicdn.com/kg/cp-tms/0.0./index.js?_=1462167227490"
    var jqXHR = $.ajax({
      url: jsSrcUrl,
      // contentType: 'application/javascript; charset=utf-8',
      cache: false,
      dataType: 'text' // it must be text, cannot be script, due to crsd rules in jquery
    });
    jqXHR.done(function(jsContent, aaa, bbb) {
      // response is empty, insertCSS throws error
      if (jsContent) {
        chrome.tabs.executeScript(tab.id, {
          code: jsContent,
          allFrames: false
        });
      }
    }).fail(function(info) {
      console.log(info);
    });
  }

  // programic injection: style files
  for (var k = 0; k < contentScripts.length; k++) {
    if (!contentScripts[k].css) continue;
    let cssSrcUrl = contentScripts[k].css[0];
    // console.log(cssSrcUrl);
    cssSrcUrl = util.format(cssSrcUrl);
    $.ajax({
      url: cssSrcUrl,
      cache: false,
      dataType: 'text'
    }).done(function(cssContent) {
      // response is empty, insertCSS throws error
      if (cssContent) {
        chrome.tabs.insertCSS({
          code: cssContent,
          allFrames: false
        });
      }
    }).fail(function(info) {
      console.log(info);
    });

  }
}

// chrome.pageAction.onClicked.addListener(main);
