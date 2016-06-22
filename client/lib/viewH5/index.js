var QRCoder = require("./qr.js");

function generateQR() {
  var qr_coder = new QRCoder($('#qr_container'));
  qr_coder.setMode(1);
  qr_coder.draw(
    location.href,
    'H',
    null,
    function(data) {
      $('#qrwrapper').show();
    });
}

function redefineTheUA() {
  function setUserAgent(window, userAgent) {
    if (window.navigator.userAgent != userAgent) {
        var userAgentProp = { get: function () { return userAgent; } };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
  }
  setUserAgent(document.querySelector('iframe').contentWindow,
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
  );

  console.log('Light Plugin: 当前UA, ' , 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1')

}

var main = function() {
  generateQR();
  redefineTheUA();
};

module.exports = main;
