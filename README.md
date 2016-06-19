> 这是插件平台客户端，Changelog见文件夹内 Readme
> 官网： http://plugin.labs.taobao.net/

## 客户端开发步骤
0. 进入开发目录，npm install
1. 启动模块加载和构建工具：在根目录 npm run dev

## 插件开发：
0. 安装def-chrome
1. 开发 http://yongyi.alidemo.cn/cp-gitbook/_book/use/install.html

## 使用步骤：
0. 猛击 http://plugin.labs.taobao.net/ , 左上角登录，然后勾选启用该示例插件
1. 下载邮件中的插件平台管理插件，将其拖进 chrome://extensions/ 中安装（由于集团安全规定，我们不能将其上传到谷歌商店，所以只能手动安装）
2. 在集团域名内就可以使用了。

## doc
0. manifest doc http://open.chrome.360.cn/extension_dev/pageAction.html
1. api doc https://developer.chrome.com/extensions/extension#method-getBackgroundPage


document.querySelectorAll('div[tms-datakey]')

page:
$('.page-main-content')
data-page-id='13818'
http://tms.alibaba-inc.com/web/pages/13818/design

modules:
http
g.alicdn.com/tb-mod/

preview =>
data-moduleid=66562


模块预览

不可以预览到
http://tms.alibaba-inc.com/web/modules/18793/mock
http://tms.alibaba-inc.com/web/modules/21205/mock

可以预览到
http://tms.alibaba-inc.com/web/modules/20262/mock


module mask:

udata-spm-module


webpack

https://github.com/petehunt/webpack-howto

mp
http://wapp.m.taobao.com/src/mp.html#url=http://h5.m.taobao.com&device=iphone4&env=taobao&scale=one2x
