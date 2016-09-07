> 这是插件平台客户端，Changelog见client文件夹内 Readme
> 官方主页： http://plugin.labs.taobao.net/

### 4.1.0 08/19
1. 优化运行逻辑，新增webnavigation检测，现在对页面运行状态的检测更加准确了。
2. 优化云插件加载逻辑，现在不会多次加载云插件脚本了。
3. 现在插件会常驻浏览器runtime，不会因为新开tab触发eventpage生命周期导致开关不稳定。

### 4.0.0 08/12
1. 安装插件即检测登录状态。避免运行时检测
2. H5模拟现在监听tab的updated事件
3. H5模拟本身会触发tab的updated，所以存在死循环，通过检测页面特征跳出
4. TMS插件不会总是运行，只有在白名单中的页面才会运行云插件。
5. TMS插件运行前增加了一定的延迟，对懒加载的页面来说，体验更好。
6. 对所有chrome API调用增加了回调方法的缓冲时间，暂定为300ms, 可以很大幅度减少对plugin.labs的接口调用量。
7. 新增了助手关闭的Icon，现在打开助手会刷新当前页面。
8. 插件图标开关从PageActino改为浏览器层面的Action, 现在助手的开关在一个Chrome实例范围内有效。

### 3.2.4 07/21
- 增强域名提取正则，现在可以正确提取http://pageview.labs.taobao.net/page?url=http://market.m.taobao.com/apps/wanke/wanke/index 里的域名了

### 3.2.2 07/04
- 无线页面检测规则变更为`.m.taobao. 或 .wapa.taobao.`


### 3.2.1 07/04
- 重构popup

### 3.1.1 07/03
- 增加多个机型切换
- 新特性：页面内后退功能

### 3.0.0 06/20
- 增加popup,取消了pageaction
- 增加多模块，打包配置升级引入xtemplate
- add xtemplate and css file to insert
- 新增浏览器内预览h5功能
- Todo: 分辨率切换和二维码

### 2.0.0 05/02
- All bugs fixed （ajax failed issues）
- 新增：精确指定插件运行于那个tab，防止插件开发者在debug的时候误把脚本插入inspetor界面
- 现在即使chrome dev 没有生成Build目录也能调试了

### 1.2.2 4/29
- 使用新的Logo了
- 修复了插件内容脚本在页面上会多次运行的Bug
- 现在会自动补全请求的协议头，防止出现以chrome://为协议的请求
- TODO: 逐步移除Jquery

### 1.2.1 4/24
- 将所有加载逻辑在background内完成，规避了https页面的安全限制
- 加强错误检测,现在即使配置文件必须字段为空或者文件为空，都会被检测到
- 扩大了默认白名单，现在在以下域名下会点亮插件

### 1.1.3 4/18
- 增加了对本地SDK配置文件中不存在background字段的检测

### 1.1.2
- 线上链路测试通过；
- 现在即使读取配置失败也不用重新加载插件了


### 1.1.1
- 再次修改线上接口地址


### 1.1.0
- 修改了预发和线上的接口地址


### 1.0.0
- 第一个版本，完成了主要加载逻辑
- TODO: 错误处理
- 在插件配置页读取当前环境





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

replace html
http://stackoverflow.com/questions/1236360/how-do-i-replace-the-entire-html-node-using-jquery

custome user agent.
http://stackoverflow.com/questions/12845445/load-iframe-content-with-different-user-agent
