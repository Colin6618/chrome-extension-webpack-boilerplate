module.exports = function loginSSOToken() {
  chrome.notifications.create(
    'loginTip',
    {
      type: 'basic',
      iconUrl: '../img/plugin_128px.png',
      title: "助手提示",
      message: "",
      contextMessage: "您还未登录",
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
      chrome.tabs.create(createProperties, function (){})
      setTimeout(function(){
        chrome.notifications.clear(id, function (){});
      }, 300);
    }
  });
}
