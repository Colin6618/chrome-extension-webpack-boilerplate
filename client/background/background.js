(function(){
/*
combined files by gulp-kmc:

sys/main
sys/browser
sys/config
sys/util
sys/storage
sys/handler
sys/status-manager
*/
var sysBrowser, sysConfig, sysUtil, sysStorage, sysStatusManager, sysHandler, sysMain;
sysBrowser = function (exports) {
  //var settings = chrome.proxy && chrome.proxy.settings;
  exports = {
    getCurrentTab: function (callback) {
      chrome.tabs.query({
        active: true,
        windowId: chrome.windows.WINDOW_ID_CURRENT
      }, function (tabs) {
        callback && callback(tabs[0]);
      });
    },
    getActiveTab: function (callback) {
      chrome.tabs.query({ active: true }, function (tabs) {
        tabs.forEach(function (tab) {
          callback && callback(tab);
        });
      });
    },
    setPopup: function (popup) {
      chrome.browserAction.setPopup({ popup: popup });
      return this;
    },
    clearPopUp: function () {
      return this.setPopup('');
    }
  };
  return exports;
}();
sysConfig = function (exports) {
  var hosts = [
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
    ], urls = {
      debug: 'http://g.alicdn.com/udata/udata-pi/debug.html',
      options: 'http://g.alicdn.com/udata/udata-pi/options.html'
    }, STATUS = {
      'ERROR': 0,
      'RUNNING': 1,
      'STOPPED': 2
    }, ICONS = [
      'error.png',
      'running.png',
      'stopped.png'
    ];
  var proxyConfig = {
    mode: 'pac_script',
    pacScript: {
      data: localStorage['proxyConfig'] || function FindProxyForURL(url, host) {
        if (shExpMatch(url, '*udata.html*') && shExpMatch(url, '*uproxy*')) {
          return 'PROXY udata.pre.alibaba-inc.com:80';
        }
        return 'DIRECT';
      }.toString()
    }
  };
  exports = {
    kissy4: 'https://s.tbcdn.cn/g/kissy/k/1.4.1/seed-min.js',
    kissy5: 'http://g.tbcdn.cn/kissy/edge/2014.06.13/seed.js',
    start: localStorage['start_debug'] || 'http://www.taobao.com/go/rgn/udata/init.php',
    runtime: localStorage['runtime_debug'] || 'https://www.taobao.com/go/rgn/udata/runtime.php',
    hosts: hosts.map(function (item) {
      item = item.replace('*.', '*').replace(/\./g, '\\.').replace('*', '.*');
      return new RegExp(item);
    }),
    urls: urls,
    urlList: function () {
      var _urls = [];
      for (var p in urls) {
        _urls.push(urls[p]);
      }
      return _urls;
    }(),
    popup: {
      combine: true,
      packages: {
        'popup': {
          combine: false,
          base: 'https://s.tbcdn.cn/g/udata/userver/0.0.33/popup/',
          ignorePackageNameInUri: true,
          charset: 'utf-8'
        }
      }
    },
    isValidUrl: function (url) {
      var valid = false;
      valid = this.urlList.some(function (page_url) {
        return url.indexOf(page_url) > -1;
      });
      if (valid) {
        return valid;
      }
      var parser = document.createElement('a');
      parser.href = url;
      var host = parser.hostname;
      parser = null;
      return this.hosts.some(function (_host) {
        return _host.test(host);
      });
    },
    isAplus: function (url) {
      if (!url) {
        return false;
      }
      return url.indexOf('dwaplus.taobao.ali.com') > -1 || url.indexOf('apluspre.taobao.ali.com') > -1 || url.indexOf('isAPlus=true') > -1;
    },
    STATUS: STATUS,
    ICONS: ICONS,
    proxyConfig: proxyConfig
  };
  return exports;
}();
sysUtil = function (exports) {
  exports = {
    queryString: function (s) {
      var query = {};
      if (!s) {
        return query;
      }
      s.split('&').map(function (item) {
        var item = item.split('='), val;
        try {
          val = decodeURIComponent(item[1] || '');
        } catch (e) {
          val = null;
        }
        query[item[0]] = val;
      });
      return query;
    },
    ajax: function (url, callback) {
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = function () {
        callback(req.responseText);
      };
      req.send(null);
    },
    injectKISSY: function (kissy, tabId, all, callback) {
      this.ajax(kissy, function (code) {
        chrome.tabs.executeScript(tabId, {
          code: 'if(!window.KISSY){' + code + '}',
          allFrames: all
        }, callback);
      });
    },
    injectScript: function (tabId, request, callback) {
      function handleCode(code) {
        chrome.tabs.executeScript(tabId, {
          code: code,
          allFrames: request.all
        }, callback);
      }
      var key = request.mods && request.mods.length && request.mods[0].name;
      if (key && request.debug && key && localStorage[key]) {
        handleCode(localStorage[key]);
      } else {
        this.ajax(request.path, function (code) {
          handleCode(code);
        });
      }
    },
    isMobile: function (host) {
      return /^(go.|)(h5|m).(\w+\.)?(taobao|tmall).com/gi.test(host);
    }
  };
  return exports;
}();
sysStorage = function (exports) {
  var ls = window.localStorage;
  function Storage(key) {
    this.key = key;
  }
  Storage.prototype = {
    alloc: function (key) {
      this.key = key;
      return this;
    },
    find: function () {
      var s = ls.getItem(this.key);
      return s && JSON.parse(s);
    },
    get: function (k) {
      var that = this, o = that.find(), ret;
      if (o) {
        ret = o[k];
      }
      return ret;
    },
    set: function (k, v) {
      var that = this, o = that.find() || {};
      o[k] = v;
      ls.setItem(this.key, JSON.stringify(o));
    },
    remove: function (k) {
      var that = this, o = that.find();
      if (o) {
        delete o[k];
      }
      ls.setItem(this.key, JSON.stringify(o));
    },
    clear: function () {
      ls.removeItem(this.key);
    }
  };
  var cache = {};
  exports = {
    alloc: function (key) {
      if (!cache[key]) {
        cache[key] = new Storage(key);
      }
      return cache[key];
    }
  };
  return exports;
}();
sysStatusManager = function (exports) {
  var Storage = sysStorage.alloc('udata');
  var set = function (k, v) {
      Storage.set(k, v);
    }, get = function (k) {
      return Storage.get(k);
    }, judge = function (k, v) {
      var status = Storage.get(k);
      return status === v;
    }, remove = function (k) {
      Storage.remove(k);
    };
  exports = {
    isRunningStatus: function () {
      return judge('UDataIsRunning', true);
    },
    changeRunningStatus: function (status) {
      set('UDataIsRunning', status);
    },
    isFirstLoginInCurrentVersion: function () {
      var currentVersion = chrome.app.getDetails().version;
      return !judge('login', currentVersion);
    },
    hasLoginedInCurrentVersion: function () {
      var currentVersion = chrome.app.getDetails().version;
      set('login', currentVersion);
    },
    hasVisited: function (isNew) {
      var version = chrome.app.getDetails().version;
      set('udata-isNew', isNew);
      set('udata-feature', version);
    },
    hasLayout: function (layout) {
      set('udata-layout', layout);
    },
    hasFeature: function () {
      var featureVersions = ['3.2.0'];
      var version = chrome.app.getDetails().version;
      for (var i = 0, l = featureVersions.length; i < l; i++) {
        var v = featureVersions[i];
        if (v == version) {
          if (get('udata-feature') != version) {
            return true;
          }
        }
      }
      return false;
    },
    hasMocked: function () {
      set('hasMocked', true);
    },
    setTimestamp: function (category, timestamp) {
      set('udata-' + category, timestamp);
    },
    getTimestamp: function (category) {
      return get('udata-' + category);
    }
  };
  return exports;
}();
sysHandler = function (exports) {
  var Browser = sysBrowser, Config = sysConfig, STATUS = Config.STATUS, StatusManager = sysStatusManager, Storage = sysStorage, guideStorage = Storage.alloc('guide'), errorStorage = Storage.alloc('error'), sys, data, sender, sendResponse;
  function aplus() {
    function aplus_init() {
      window.TBI && TBI.Aplus.pageClick.processor.showPv();
    }
    var script = document.createElement('script'), head = document.querySelector('head');
    script.text = '(' + aplus_init.toString() + ')()';
    head.appendChild(script);
  }
  var handleMap = {
    '/start': function () {
      Browser.getCurrentTab(function (tab) {
        sys.start(tab);
      });
    },
    '/options/open': function () {
      Browser.getCurrentTab(function (tab) {
        sys.currentTab = tab;
        chrome.tabs.create({ url: Config.urls.options + '?' + Date.now() }, function (tab) {
          sys.optionTab = tab;
        });
      });
    },
    '/options/close': function () {
      Browser.getCurrentTab(function (tab) {
        sys.optionsSaved = true;
        chrome.tabs.remove(tab.id);
      });
    },
    '/layout': function () {
      StatusManager.hasLayout(data.layout);
    },
    '/popup/init': function () {
      var error = errorStorage.get(data.tabId);
      if (error) {
        sendResponse({
          data: error,
          config: Config.popup,
          call: ['popup/index']
        });
      } else if (localStorage['loading']) {
        sendResponse({
          data: { type: 'loading' },
          config: Config.popup,
          call: ['popup/index']
        });
      }
    },
    '/popup/status': function () {
      sendResponse({ data: { status: localStorage['loading'] ? 'loading' : 'complete' } });
    },
    '/captureVisibleTab': function () {
      chrome.tabs.captureVisibleTab(function (dataURL) {
        sendResponse(dataURL);
      });
    },
    '/permissionRequest': function () {
      if (data.command == 'Request') {
        Browser.getCurrentTab(function (tab) {
          sys.currentTab = tab;
          chrome.tabs.create({
            url: '/authorize.html?' + data.params + '&tabId=' + tab.id,
            active: true
          }, function (newTab) {
            sys.permissionTab = newTab;
          });
        });
      }
    },
    '/permissionContains': function () {
      var params = {};
      if (data.origins.length != 0) {
        params['origins'] = data.origins;
      }
      if (data.permissions.length != 0) {
        params['permissions'] = data.permissions;
      }
      chrome.permissions.contains(params, function (result) {
        sendResponse(result);
      });
    },
    '/permissionRemove': function () {
      var params = {};
      if (data.origins.length != 0) {
        params['origins'] = data.origins;
      }
      if (data.permissions.length != 0) {
        params['permissions'] = data.origins;
      }
      chrome.permissions.remove(params, function (removed) {
        sendResponse(removed);
      });
    },
    '/getCookie': function () {
      chrome.cookies.get(data, function (cookie) {
        sendResponse(cookie);
      });
    },
    '/getCookies': function () {
      chrome.cookies.getAll(data, function (cookies) {
        sendResponse(cookies);
      });
    },
    '/setCookie': function () {
      chrome.cookies.set(data, function (cookie) {
        sendResponse(cookie);
      });
    },
    '/removeCookie': function () {
      chrome.cookies.remove(data, function (cookie) {
        sendResponse(cookie);
      });
    },
    '/getCookieStores': function () {
      chrome.cookies.getAllCookieStores(function (cookieStores) {
        sendResponse(cookieStores);
      });
    },
    '/saveToLocalStorage': function () {
      data.finished && guideStorage.set('finished', data.finished);
      data.allDone && guideStorage.set('allDone', data.allDone);
    },
    '/getFromLocalStorage': function () {
      var key = data.key, result = guideStorage.get(key);
      sendResponse(result);
    },
    '/popup': function () {
      var error = errorStorage.get(data.tabId);
      if (error) {
        sendResponse({ data: error });
      }
    },
    '/today/notify': function () {
      var category = data.category, timestamp = data.timestamp, recordTimeStamp = StatusManager.getTimestamp(category), isToday = sys.isToday(recordTimeStamp);
      if (!recordTimeStamp || recordTimeStamp && !isToday) {
        statusMachine.setTimestamp(category, timestamp);
        sendResponse({
          type: 'timesOfToday',
          notified: false
        });
      } else if (isToday) {
        sendResponse({
          type: 'timesOfToday',
          notified: true
        });
      }
    },
    '/close': function () {
      errorStorage.clear();
      sys.close();
      sendResponse();
    },
    '/error': function () {
      sys.setIcon(STATUS.ERROR);
      Browser.getCurrentTab(function (tab) {
        errorStorage.set(tab.id, data);
      });
    },
    '/udata/running': function () {
      var layout = uDataStorage.get('udata-layout'), isNew = uDataStorage.get('udata-isNew') ? false : true, hasMocked = uDataStorage.get('hasMocked') ? true : false, hasFeature = StatusManager.hasFeature();
      var status = sys.isRunning ? STATUS.RUNNING : STATUS.STOPPED;
      sys.setIcon(status);
      sendResponse({
        data: {
          running: sys.isRunning,
          layout: layout,
          isNew: false,
          hasFeature: false,
          hasMocked: hasMocked
        }
      });
    },
    '/storage/get': function () {
      sendResponse({ data: { storage: uDataStorage.find() } });
    },
    '/storage/set': function () {
      uDataStorage.set(data.key, data.value);
      sendResponse({ data: { storage: uDataStorage.find() } });
    },
    '/reload': function () {
      var key = 'background_version', time = uDataStorage.get(key), _time = data.time;
      console.log(time + '/' + _time);
      if (_time) {
        uDataStorage.set(key, _time);
      }
      if (data.reload || time && time !== _time) {
        localStorage.setItem('reload', 'y');
        chrome.runtime.reload();
      }
    },
    '/tool/spmMarkInvalidLinks/open_tab': function () {
      var tab_id;
      var tab_url;
      chrome.tabs.create(data, function (tab) {
        tab_id = tab.id;
        tab_url = tab.url;
        sendResponse({ data: { tab_url: tab_url } });
      });
      return true;
    },
    '/tools/spmFind/tab_opened': function () {
      chrome.tabs.getSelected(null, function (tab) {
        sendResponse();
      });
    },
    '/aplus/init': function () {
      Browser.getCurrentTab(function (tab) {
        chrome.tabs.executeScript({
          code: '(' + aplus.toString() + ')()',
          allFrames: true
        });
      });
    },
    '/debug/module': function () {
      if (data.code) {
        localStorage[data.modname] = data.code;
      } else {
        if (localStorage[data.modname]) {
          localStorage[data.modname] = null;
          delete localStorage[data.modname];
        }
      }
      sendResponse();
    }
  };
  exports = {
    init: function (_sys) {
      sys = _sys;
    },
    handle: function (_request, _sender, _sendResponse) {
      var route = _request.route;
      if (handleMap[route]) {
        data = _request.data;
        sender = _sender;
        sendResponse = _sendResponse;
        handleMap[route]();
      }
    }
  };
  return exports;
}();
sysMain = function (exports) {
  var Browser = sysBrowser, Config = sysConfig, Util = sysUtil, Storage = sysStorage, Handler = sysHandler, StatusManager = sysStatusManager;
  var STATUS = Config.STATUS;
  ICONS = Config.ICONS, errorStorage = Storage.alloc('error'), uDataStorage = Storage.alloc('udata');
  exports = {
    init: function () {
      localStorage['installed'] = 1;
      this.currentTab = null;
      this.isRunning = StatusManager.isRunningStatus();
      if (!StatusManager.isFirstLoginInCurrentVersion()) {
        this.isRunning = true;
        StatusManager.changeRunningStatus(true);
      }
      this.status = StatusManager.isRunningStatus() ? STATUS.RUNNING : STATUS.STOPPED;
      this.setIcon(STATUS.RUNNING);
      Handler.init(this);
      this.initEnv().initEvent();
    },
    initConextMenu: function () {
      function onClickHandler(info, tab) {
        Browser.getActiveTab(function (tab) {
          try {
            chrome.tabs.sendMessage(tab.id, { route: '/udata/click_context_menu' });
          } catch (e) {
            console.log(e);
          }
        });
      }
      chrome.contextMenus.onClicked.addListener(onClickHandler);
      var contexts = [
        'page',
        'selection',
        'link',
        'editable',
        'image',
        'video',
        'audio'
      ];
      for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        var title = 'Test \'' + context + '\' menu item';
        var id = chrome.contextMenus.create({
          'title': title,
          'contexts': [context],
          'id': 'context' + context
        });
        console.log('\'' + context + '\' item:' + id);
      }
      chrome.contextMenus.create({
        'title': 'Test parent item',
        'id': 'parent'
      });
      chrome.contextMenus.create({
        'title': 'Child 1',
        'parentId': 'parent',
        'id': 'child1'
      });
      chrome.contextMenus.create({
        'title': 'Child 2',
        'parentId': 'parent',
        'id': 'child2'
      });
      console.log('parent child1 child2');
      chrome.contextMenus.create({
        'title': 'Radio 1',
        'type': 'radio',
        'id': 'radio1'
      });
      chrome.contextMenus.create({
        'title': 'Radio 2',
        'type': 'radio',
        'id': 'radio2'
      });
      console.log('radio1 radio2');
      chrome.contextMenus.create({
        'title': 'Checkbox1',
        'type': 'checkbox',
        'id': 'checkbox1'
      });
      chrome.contextMenus.create({
        'title': 'Checkbox2',
        'type': 'checkbox',
        'id': 'checkbox2'
      });
      console.log('checkbox1 checkbox2');
      console.log('About to try creating an invalid item - an error about ' + 'duplicate item child1 should show up');
      chrome.contextMenus.create({
        'title': 'Oops',
        'id': 'child1'
      }, function () {
        if (chrome.extension.lastError) {
          console.log('Got expected error: ' + chrome.extension.lastError.message);
        }
      });
    },
    start: function (tab) {
      var id = tab.id || tab.tabId, url = tab.url;
      var all = Config.isAplus(url);
      this.setIcon(STATUS.RUNNING);
      Browser.clearPopUp();
      errorStorage.remove(id);
      this.isRunning = true;
      var query = Util.queryString(url.split('?')[1]);
      var kissy = Config.kissy4;
      if (query.hasOwnProperty('ukissy5')) {
        kissy = Config.kissy5;
      }
      Util.injectKISSY(kissy, id, all, function () {
        Util.injectScript(id, {
          all: all,
          path: Config.start + '?' + Date.now()
        });
      });
    },
    startRunTime: function (tab) {
      var id = tab.id || tab.tabId, url = tab.url;
      Util.injectScript(id, {
        all: true,
        path: Config.runtime + '?' + Date.now()
      });
    },
    polling: function () {
      var self = this;
      if (!StatusManager.isRunningStatus()) {
        return;
      }
      console.info('start polling');
      Util.ajax('http://dev.udata.alibaba-inc.com:6001/polling', function (data) {
        if (data) {
          if (!data.type) {
            try {
              data = JSON.parse(data);
            } catch (err) {
              data = {};
            }
          }
          switch (data.type) {
          case 'openUrl':
            chrome.tabs.create({ url: data.url });
            break;
          }
        }
        self.polling();
      });
    },
    initEnv: function () {
      var self = this, index = 0;
      chrome.webNavigation.onCommitted.addListener(function (tab) {
        var tabId = tab.tabId;
        if (!self.isRunning) {
          return;
        }
        if (tab.frameId !== 0) {
          return;
        }
        var items = tab.url.split('?'), query = Util.queryString(items[1]);
        if (/\.js$/.test(items[0]) && query.hasOwnProperty('udebug')) {
          chrome.tabs.executeScript({
            code: 'location.href="' + Config.urls.debug + '?src=' + encodeURIComponent(tab.url) + '"',
            allFrames: true
          });
          return;
        }
        if (!Config.isValidUrl(tab.url)) {
          self.setIcon(STATUS.ERROR);
          errorStorage.set(tabId, { type: 'spm' });
          return;
        }
        if (tab.frameId == 0) {
          localStorage['loading'] = 'loading';
          Browser.setPopup('popup/popup.html');
          if (!self.timer) {
            self.timer = setInterval(function () {
              if (!localStorage['loading']) {
                return;
              }
              index = ++index % 5;
              var path = '/image/loading/' + (index + 1) + '.png';
              chrome.browserAction.setIcon({ path: path });
            }, 300);
          }
        }
      });
      chrome.webNavigation.onCompleted.addListener(function (tab) {
        console.log(tab.url);
        self.startRunTime(tab);
        if (!self.isRunning) {
          return;
        }
        if (tab.url.indexOf('http://apluspre.alibaba-inc.com/aplus/pub/appPage.htm') > -1) {
          debugger;
        }
        var tabId = tab.tabId, all = Config.isAplus(tab.url);
        if (tab.frameId !== 0 && !all) {
          return;
        }
        var items = tab.url.split('?'), query = Util.queryString(items[1]);
        if (!Config.isValidUrl(tab.url)) {
          self.setIcon(STATUS.ERROR);
          errorStorage.set(tabId, { type: 'spm' });
          return;
        }
        if (self.timer) {
          clearInterval(self.timer);
          self.timer = null;
        }
        delete localStorage['loading'];
        self.start(tab);
      });
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        request.all = Config.isAplus(sender.url);
        var query = sender.url && sender.url.split('?')[1];
        if (request.type == 'loadjs') {
          var tabId = sender.tab.id;
          var wait = true;
          request.debug = query && Util.queryString(query).hasOwnProperty('udebug');
          Util.injectScript(tabId, request, function () {
            sendResponse({ ok: 1 });
            wait = false;
          });
          return wait;
        }
        Handler.handle.apply(self, arguments);
        return true;
      });
      chrome.runtime.onInstalled.addListener(function () {
        Browser.getCurrentTab(function (tab) {
          if (Config.isValidUrl(tab.url)) {
            chrome.tabs.reload(tab.id);
          }
        });
      });
      chrome.runtime.onSuspend.addListener(function () {
        if (self.timer) {
          clearInterval(self.timer);
          self.timer = null;
        }
      });
      if (localStorage.getItem('reload') == 'y') {
        localStorage.removeItem('reload');
        Browser.getCurrentTab(function (tab) {
          if (Config.isValidUrl(tab.url)) {
            chrome.tabs.reload(tab.id);
          }
        });
      }
      return this;
    },
    isToday: function (timestamp) {
      if (!timestamp) {
        return false;
      }
      var today = new Date(), year = today.getFullYear(), month = today.getMonth(), day = today.getDate(), yesterday = +new Date(year, month, day, 0, 0, 0), tomorrow = +new Date(year, month, day, 23, 59, 59);
      if (timestamp >= yesterday && timestamp <= tomorrow) {
        return true;
      } else {
        return false;
      }
    },
    runCurrentTab: function () {
      function startClient() {
        if (!document.querySelector('#udata_running_lock')) {
          if (!window.moment) {
            location.reload();
          } else {
            chrome.runtime.sendMessage({ route: '/start' });
          }
        }
      }
      Browser.getCurrentTab(function (tab) {
        chrome.tabs.executeScript({
          code: '(' + startClient.toString() + ')()',
          allFrames: false
        });
      });
    },
    toggle: function (tab) {
      tab = tab || {};
      if (this.isRunning) {
        this.close();
      } else {
        if (tab.url && !Config.isValidUrl(tab.url)) {
          this.run();
          this.setIcon(STATUS.ERROR);
          errorStorage.set(tab.id, { type: 'spm' });
          return;
        }
        this.polling();
        this.runCurrentTab();
        this.run();
        localStorage['last_time'] = Date.now();
      }
      this.notify();
    },
    initEvent: function () {
      var self = this;
      chrome.browserAction.onClicked.addListener(this.toggle.bind(this));
      chrome.tabs.onActivated.addListener(function () {
        Browser.getCurrentTab(function (tab) {
          if (self.isRunning) {
            if (tab.status == 'complete') {
              localStorage.removeItem('loading');
            } else {
              localStorage['loading'] = 'loading';
            }
            if (!Config.isValidUrl(tab.url)) {
              self.setIcon(STATUS.ERROR);
              errorStorage.set(tab.id, { type: 'spm' });
              return;
            }
            if (errorStorage.get(tab.id)) {
              self.setIcon(STATUS.ERROR);
              return;
            } else {
              self.runCurrentTab();
              self.setIcon(STATUS.RUNNING);
              Browser.clearPopUp();
            }
          } else {
            self.setIcon(STATUS.STOPPED);
            Browser.clearPopUp();
          }
          self.notify();
        });
      });
      chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        errorStorage.remove(tabId);
        if (!self.optionTab && !self.permissionTab) {
          return;
        }
        if (self.optionTab && tabId == self.optionTab.id) {
          if (self.currentTab) {
            chrome.tabs.update(self.currentTab.id, { active: true }, function () {
              if (self.optionsSaved) {
                chrome.tabs.reload(self.currentTab.id, function () {
                  self.currentTab = null;
                });
                self.optionsSaved = false;
              }
              self.currentTab = null;
            });
          }
        }
        if (self.permissionTab && tabId == self.permissionTab.id) {
          if (self.currentTab) {
            chrome.tabs.update(self.currentTab.id, { active: true }, function (tab) {
              self.currentTab = null;
            });
          }
        }
      });
      chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
        errorStorage.remove(removedTabId);
      });
      chrome.windows.onRemoved.addListener(function () {
        errorStorage.clear();
      });
      return this;
    },
    notify: function () {
      var self = this;
      Browser.getActiveTab(function (tab) {
        try {
          chrome.tabs.sendMessage(tab.id, {
            route: '/udata/update_status',
            data: {
              running: self.isRunning,
              last_time: parseInt(localStorage['last_time'] || 0)
            }
          });
        } catch (e) {
          console.log(e);
        }
      });
    },
    run: function () {
      this.isRunning = true;
      this.setIcon(STATUS.RUNNING).updateStatus();
      return this;
    },
    close: function () {
      this.isRunning = false;
      this.setIcon(STATUS.STOPPED).updateStatus();
      Browser.clearPopUp();
    },
    updateStatus: function (status) {
      StatusManager.changeRunningStatus(this.isRunning);
      return this;
    },
    setIcon: function (status) {
      var path = '/image/icon/' + ICONS[status];
      chrome.browserAction.setIcon({ path: path });
      if (status == STATUS.ERROR) {
        Browser.setPopup('popup/popup.html');
      } else {
        Browser.clearPopUp();
      }
      return this;
    }
  };
  return exports;
}();
sysMain.init();
})();