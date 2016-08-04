// var mockAssertUrl = require('./mockConfig.json');
// http://plugin.labs.taobao.net/api/get-plugins-config
// var ajax = require('marmottajax');
// 如何把 promise的值丢出来给外面是个问题， ES7的async await解决了这个问题，外面需要try catch ，因为await拿到的不是promise（不然就没必要使用await），reject的内容以errorThrown出来。注意asyc方法不能作为对象的变量，因为方法被generator包起来了,this 不再是外部对象

// var ppg = require('./printPublicGists.js');
module.exports = {
  getPluginAssets: function() {
    var self = this;
    var env = self.getEnv();
    var url = self.getOptionDomain();
    var pluginJsonFile = {};
    var jqXHR = $.ajax({
      dataType: "json",
      url: url,
      async: false // it must be sync
    });
    jqXHR.done(function(ret, textStatus, jqXHR) {
      if (env === 'local') {
        pluginJsonFile = ret;
      } else {
        pluginJsonFile = ret.configs;
      }
      // pluginJsonFile = {"success":true,"configs":{"name":"get-plugins-config","version":"1.0.0","background":{"scripts":["//g.alicdn.com/kg/cp-tms/0.0.3/background.js"]},"content_scripts":[{"matches":["*://*.taobao.com/*"],"js":["//g.alicdn.com/kg/cp-tms/0.0.3/index.js"]}],"message":"~愈之~启用的插件配置信息获取成功"}};
      // pluginJsonFile = pluginJsonFile.configs;
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('getPluginAssetsConifg failed');
      console.log(jqXHR);
    });
    return pluginJsonFile;
  },
  getOptionDomain: function() {
    var domain = this.getEnv();
    var configlUrl = {
      local: 'http://127.0.0.1:3290/plugin.json',
      prepub: 'https://plugin.labs.taobao.net:6001/api/getPluginsConfig',
      online: 'https://plugin.labs.taobao.net/api/getPluginsConfig'
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
  getEnv: function() {
    return localStorage["plugin-platform-setting-domain"] || "online";
  },
  getP: function() {
    var jqXHR = $.ajax({
      dataType: "json",
      url: 'https://g.alicdn.com/kg/cp-rulers/0.0.1/index.js',
      async: false // it must be sync
    });
    jqXHR.done(function(ret, textStatus, jqXHR) {
      // debugger;
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('获取插件配置文件失败');
      console.log(jqXHR);
      // debugger;
    });
  }
}
