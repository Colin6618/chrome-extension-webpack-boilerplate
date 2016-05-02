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
var whiteHosts = [
  '*.taobao.com',
  '*.taohua.com',
  '*.taobao.net',
  '*.taobao.org',
  '*.tw.taobao.com',
  '*.taobao.ali.com',
  '*.tmall.com',
  '*.tmall.hk',
  '*.juhuasuan.com',
  '*.etao.com',
  '*.tao123.com',
  '*.aliyun.com',
  '*.hitao.com',
  '*.alibado.com',
  '*.youshuyuan.com',
  '*.yahoo.com.cn',
  '*.aliloan.com',
  '*.alibaba-inc.com',
  '*.alibaba.com',
  '*.alibaba.com.cn',
  '*.alibaba.net',
  '*.xiami.com',
  '*.1688.com',
  '*.yunos.com',
  '*.atatech.org',
  '*.laiwang.com',
  '*.aliexpress.com',
  '*.koubei.com',
  '*.itao.com',
  '*.alimama.com',
  //淘点点
  '*.tdd.la',
  '*.aliqin.cn',
  '*.itao.com',
  '*.net.cn',
  '*.aliloan.com',
  '*.alibado.com',
  '*.ali.com',
  //淘宝航旅
  '*.alitrip.com',
  '*.dingtalk.com',
  //阿里云备案
  '*.gein.cn',
  //神马搜索
  '*.sm.cn',
  '*.tanx.com',
  //极有家
  '*.jiyoujia.com',
  'gw.alicdn.com',
  '*.miiee.com',
  '*.imaijia.com',
  '*.alidayu.com',
  '*.cainiao.com',
  '*.alihealth.cn'
];
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
chrome.pageAction.onClicked.addListener(function(tab) {
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
    // chrome.tabs.executeScript({
    //   code: '$.getScript("' + jsSrcUrl + '")',
    //   allFrames: true
    // });
    $.ajax({
      url: jsSrcUrl
    }).done(function(jsContent) {
      // response is empty, insertCSS throws error
      if (jsContent) {

        chrome.tabs.executeScript({
          code: jsContent,
          allFrames: true
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
    $.ajax({
      url: cssSrcUrl
    }).done(function(cssContent) {
      // response is empty, insertCSS throws error
      if (cssContent) {
        chrome.tabs.insertCSS({
          code: cssContent,
          allFrames: true
        });
      }
    }).fail(function(info) {
      console.log(info);
    });

  }
});
