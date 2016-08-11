// 内容脚本不能：
// 调用 chrome.* API，除了以下 API：
// extension（getURL、inIncognitoContext、lastError、onRequest、sendRequest）
// i18n
// runtime（connect、getManifest、getURL、id、onConnect、onMessage、sendMessage）
// storage
// 使用所属扩展程序页面中定义的变量或函数
// 使用网页或其他内容脚本中定义的变量或函数

// get sources url from server
var configLoader = require('./configLoader.js');
var whiteHosts = require('./util/whitelist.js');
var util = require('./util/util.js');

// get the url domain
function getDomainFromUrl(url) {
  var host = "null";
  if (typeof url == "undefined" || null == url)
    url = window.location.href;
  var regex = /^(http|https):\/\/([^\/]*).*/;
  var match = url.match(regex);
  if (typeof match != "undefined" && null != match)
    host = match[2];
  return host;
}

// var currentTabId = 0;
// var currentWindowId = 0;

//check the url string
// if in the white list -> active the page Action
function checkForValidUrl(tabId, changeInfo, tab) {
  // chrome.browserAction.disable(tabId);
  if (tab.url.indexOf("chrome-devtools://") > -1 || tab.url.indexOf("chrome-extension://") > -1 ) return;
  let hostToChecked = getDomainFromUrl(tab.url).toLowerCase();
  let i = 0;
  for (; i < whiteHosts.length; i++) {
    // convert a csp exp string to reg exp
    var hostRegExp = whiteHosts[i].replace(/\./g, '\\.').replace(/\*/g, '\.\*');
    if (new RegExp(hostRegExp).test(hostToChecked)) {
      // chrome.pageAction.show(tabId);
      // chrome.browserAction.enable(tabId);
      break;
    }
  }
};

function isH5Page(activeInfo) {
  if(localStorage["plugin-platform-setting-viewH5-disabled"]==='true') return false;
  let tabId = activeInfo.id;
  chrome.tabs.get(tabId, function(tab){
    let hostToChecked = getDomainFromUrl(tab.url).toLowerCase();
    if(/\.m\.taobao\./.test(hostToChecked) || /\.wapa\.taobao\./.test(hostToChecked)) {
          // tabObjArray[0].id check
          // if(tabObjArray[0].id != activeInfo.tabId ) return false;
        setTimeout(function() {
          chrome.tabs.sendMessage(tabId, {
            type: "plugin:viewH5",
            msg: "view H5 page in current tab",
            context: "view H5 page in current tab"
          });
          chrome.tabs.insertCSS(tabId, {
            file: '/lib/content_script_bundle_style.css',
            allFrames: false
          });
        }, 1000);
    }
  });
}

// watch the tab changed
// get ride of most runtime errors, the enviroment is important for the plugins
// check the whitelist
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onCreated.addListener(isH5Page);



// click page action icon event
// it runs after the check 🐳
// http://labs.taobao.net/api/sso?app_name=plugin&auth_back=http://plugin.labs.taobao.net/auth&redirect_url=http://plugin.labs.taobao.net/
function loginSSOToken() {
  chrome.notifications.create(
    'loginTip',
    {
      type: 'basic',
      iconUrl: '../img/plugin_128px.png',
      title: "提示",
      message: "",
      contextMessage: "您还未登录域帐号",
      buttons: [{title:"登录"}],
      requireInteraction: true
    },
    function() {}
  );
  chrome.notifications.onButtonClicked.addListener(function (id, n2){
    if(id === 'loginTip') {
      let createProperties = {
        url: 'http://labs.taobao.net/api/sso?app_name=plugin&auth_back=http://plugin.labs.taobao.net/auth&redirect_url=http://plugin.labs.taobao.net/',
        active: true
      };
      chrome.tabs.create(createProperties, function (){
      })
      setTimeout(function(){
        chrome.notifications.clear(id, function (){});
      }, 300);
    }
  });
}

var main = window.main = function(tab) {
  var pluginJsonFile = configLoader.getPluginAssets();
  // var pluginJsonFile_ = configLoader_.getPluginAssets_();
  if (!pluginJsonFile) {
    console.log('pluginConfig file is empty!');
  }

  try {
    // var backgroundScripts = pluginJsonFile.background.scripts;
    if(pluginJsonFile.login === false) {
      loginSSOToken();
    }
    else {
      var contentScripts = pluginJsonFile.content_scripts;
    }
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

// xctrlCheck();
// chrome.pageAction.onClicked.addListener(main);
