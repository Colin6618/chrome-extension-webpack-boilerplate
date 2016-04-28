require("babel-polyfill");
// var $ = require('zepto');
// import request from "request";
// promise returning function
function get(url) {
  // return new Promise(function(resolve, reject) {
  //   var jqXHR = $.ajax({
  //     dataType: "json",
  //     url: url
  //   });
  //   jqXHR.done(function(ret, textStatus, jqXHR) {
  //     resolve(ret);
  //   }).fail(function(jqXHR, textStatus, errorThrown) {
  //     console.log('ffffail');
  //   });
  // });
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        resolve(data);
      } else {
        // We reached our target server, but it returned an error
        reject(request.status)
      }
    };
    request.onerror = function(err) {
      // There was a connection error of some sort
      reject(err)
    };
    request.send();
  });
}


// create a new "async" function so we can use the "await" keyword
var printPublicGists = async function() {
  // "await" resolution or rejection of the promise
  // use try/catch for error handling
  try {
    //see line9597 in bundle packed
    var gists = await get('https://api.github.com/gists/public');

    // now you can write this like syncronous code!
    gists.forEach(function(gist) {
      console.log(gist.description);
    });
  } catch (e) {
    // promise was rejected and we can handle errors with try/catch!
    console.log(e);
  }
}

// var mockAssertUrl = require('./mockConfig.json');
// http://plugin.labs.taobao.net/api/get-plugins-config
// 如何把 promise的值丢出来给外面是个问题， ES7的async await解决了这个问题，外面需要try catch ，因为await拿到的不是promise（不然就没必要使用await），reject的内容以errorThrown出来。注意asyc方法不能作为对象的变量，因为方法被generator包起来了,this 不再是外部对象

// var ppg = require('./printPublicGists.js');

// printPublicGists();

var getPluginAssets = function() {
  var env = getEnv();
  var url = getOptionDomain();
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
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.log('获取插件配置文件失败');
    console.log(jqXHR);
  });
  return pluginJsonFile;
};

var fetch = function() {
  var pluginJsonFile;
  var env = getEnv();
  var url = getOptionDomain();
  debugger;
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var res = JSON.parse(request.responseText);
        if (env === 'local') {
          pluginJsonFile = res;
        } else {
          pluginJsonFile = res.configs;
        }
        resolve(pluginJsonFile);
      } else {
        // We reached our target server, but it returned an error
        reject(request.status)
      }
    };
    request.onerror = function(err) {
      // There was a connection error of some sort
      reject(err)
    };
    request.send();
  });
};

var getPluginAssets_ = async function() {

  var pluginJsonFile;
  try {
    pluginJsonFile = await fetch();
  }
  catch(e) {
    console.log(e);
  }
  return pluginJsonFile;
};

var getOptionDomain = function() {
  var domain = getEnv();
  var configlUrl = {
    local: 'http://127.0.0.1:3290/plugin.json',
    prepub: 'http://plugin.labs.taobao.net:6001/api/getPluginsConfig',
    online: 'http://plugin.labs.taobao.net/api/getPluginsConfig'
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
};

var getEnv = function() {
  return localStorage["plugin-platform-setting-domain"] || "online";
};

module.exports = {
  getPluginAssets: getPluginAssets,
  getPluginAssets_: getPluginAssets_
}
