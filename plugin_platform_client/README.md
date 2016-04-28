关于拓展content_script的种种限制
https://segmentfault.com/q/1010000002298535

https://developer.chrome.com/extensions/api_index

https://developer.chrome.com/extensions/extension

http://www.php100.com/manual/jquery/jQuery.getScript.html

"matches":["*://*.taobao.com/*"],

### 1.0.0
- 第一个版本，完成了主要加载逻辑
- TODO: 错误处理
- 在插件配置页读取当前环境

### 1.1.0
- 修改了预发和线上的接口地址

### 1.1.1
- 再次修改线上接口地址

### 1.1.2
- 线上链路测试通过；
- 现在即使读取配置失败也不用重新加载插件了

### 1.1.3 4/18
- 增加了对本地SDK配置文件中不存在background字段的检测

### 1.2.1 4/24
- 将所有加载逻辑在background内完成，规避了https页面的安全限制
- 加强错误检测,现在即使配置文件必须字段为空或者文件为空，都会被检测到
- 扩大了默认白名单，现在在以下域名下会点亮插件
```
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
```
