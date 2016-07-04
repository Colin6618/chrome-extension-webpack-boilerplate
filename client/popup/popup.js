require('./popup.less');
document.addEventListener('DOMContentLoaded', function() {

  // get background js
  var main = chrome.extension.getBackgroundPage().main;
  // event bind enginStart
  document.getElementById('enginStart').addEventListener('click', function() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
      },
      function(tabObjArray) {
				if(tabObjArray.length < 1) {
					alert('getTabIndex faild, please refresh the page and try again ');
					return;
				}
        main(tabObjArray[0].id);
      }
    );
  });

  // event bind viewH5
  document.getElementById('viewH5page').addEventListener('click', signalVewH5);
  // return;
  // var data = chrome.extension.getBackgroundPage().articleData;
});

// 点击viewH5发出的事件
function signalVewH5() {
  chrome.tabs.query({
      currentWindow: true,
      active: true
    },
    function(tabObjArray) {
			if(tabObjArray.length < 1) {
				alert('GetTabIndex faild, please refresh the page and try again ');
				return;
			}
      // tabObjArray[0].id
      chrome.tabs.sendMessage(tabObjArray[0].id, {
        type: "plugin:viewH5",
        msg: "view H5 page in current tab",
        context: "view H5 page in current tab"
      })
      chrome.tabs.insertCSS(tabObjArray[0].id, {
        file: '/lib/content_script_bundle_style.css',
        allFrames: false
      });
    }
  );
}
