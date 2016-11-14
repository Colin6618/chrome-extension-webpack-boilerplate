// cannot
// use chrome.* API，except API：
// extension（getURL、inIncognitoContext、lastError、onRequest、sendRequest）
// i18n
// runtime（connect、getManifest、getURL、id、onConnect、onMessage、sendMessage）

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
		// todo:
});
