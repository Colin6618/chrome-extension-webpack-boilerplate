var QRCoder = require("./qr.js");

function generateQR() {
  var qr_coder = new QRCoder($('#qr_container'));
  qr_coder.setMode(1);
  qr_coder.draw(
    location.href,
    'M',
    null,
    function(data) {
      $('#qrwrapper').show();
    });
    $('#qrwrapper').show();
}

// 可以设置成功，但是还没用处，TMS页面通过
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
  setUserAgent(document.querySelector('#J_Frame').contentWindow,
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
  );

  // console.log('Light Plugin: 当前设备UA, ' , 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1')

}

function bindPageEvent() {
  $('#J_Fliter .phoneType .item').on('click', function(ev) {
    let $this = $(ev.target);
    if( $this.hasClass('selected') ) return false;
    let phoneTypeInPage = $('#J_Fliter .phoneType .selected').attr('data-name');
    $('#J_Fliter .phoneType .item').removeClass('selected');
    let phoneTypeToChange = $this.attr('data-name');
    $this.addClass('selected');
    $('#J_DemoWrap').removeClass(phoneTypeInPage).addClass(phoneTypeToChange);
  });

}

var main = function() {
  generateQR();
  redefineTheUA();
  bindPageEvent();
};

module.exports = main;
