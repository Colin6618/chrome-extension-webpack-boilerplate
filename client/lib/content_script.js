// 高能预警：
// 内容脚本不能：
// 调用 chrome.* API，除了以下 API：
// extension（getURL、inIncognitoContext、lastError、onRequest、sendRequest）
// i18n
// runtime（connect、getManifest、getURL、id、onConnect、onMessage、sendMessage）
// storage
// 使用所属扩展程序页面中定义的变量或函数
// 使用网页或其他内容脚本中定义的变量或函数
var tpl = require('./tpl.xtpl');
var Xtemplate = require('xtemplate/lib/runtime');

console.log('plugin client running');
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type=="plugin:error") {
    console.log(request.msg);
    console.log(request.context);
	}
});

var viewH5 = function() {
	var newDoc = document.open("text/html", "replace");
	newDoc.write(new Xtemplate(tpl).render({}));
	newDoc.close();
	// $('html').empty();
	//
	// $('html').html(new Xtemplate(tpl).render({}));// jquery bug , body tag lost
	//
	// $('body').append('<div class="demo" ><iframe id="J_Frame" frameborder="0" src="https://www.taobao.com/markets/hi/hongxing1_copy"></iframe></div>');

}
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type=="plugin:viewH5") {
    viewH5();
	}
});
