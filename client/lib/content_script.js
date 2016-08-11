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
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type=="plugin:viewH5") {
		if(document.title !== 'viewH5page') {
			viewH5();
		}
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type=="plugin:refreshCurrentTab") {
		location.reload();
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type=="plugin:error") {
    console.log(request.msg);
    console.log(request.context);
	}
});



// require just for loader to compile, the styel injected in popupjs via chrome api
require('./viewH5/content_style.less');
var Xtemplate = require('xtemplate/lib/runtime');
var tpl = require('./viewH5/tpl.xtpl');
var viewH5Main = require('./viewH5/index.js');
// var global = {}


// 启用H5页面预览
var viewH5 = function() {

	// 替换document
	var newDoc = document.open("text/html", "replace");
	var currentUrl = location.href;
	if(/\?/.test(currentUrl)) {
		currentUrl += '&wh_ttid=phone';
	}
	else {
		currentUrl += '?wh_ttid=phone'
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
}
