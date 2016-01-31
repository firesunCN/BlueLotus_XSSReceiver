# XSS数据接收平台（Sina App Engine版）

## 平台说明
详细说明请查看master分支的README.md，本分支为兼容SAE的修改版，去除了安装脚本install.php与邮件通知

##安装说明

###手动安装
* 如不做二次开发，可直接删除根目录下diff、guide、src目录
* 修改config.php，指定xss数据、我的js、js模板的存放目录，以及数据是否启用加密、加密密码、与加密方法（详细说明见文件注释）
```php
define('PASS', '2a05218c7aa0a6dbd370985d984627b8');
define('DATA_PATH', 'data');
define('JS_TEMPLATE_PATH', 'template');
define('MY_JS_PATH', 'myjs');
define('ENABLE_ENCRYPT', true);
define('ENCRYPT_PASS', "bluelotus");
define('ENCRYPT_TYPE', "RC4");
```
* PASS为登录密码，可用`php -r "$salt='!KTMdg#^^I6Z!deIVR#SgpAI6qTN7oVl';$key='你的密码';$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);echo $key;"`生成密码hash
* 上传所有文件至SAE
* 在SAE的控制面板->存储与CDN服务->Storage，新建一个Bucket，配置如下（公有，名字为bluelotus）
![](./guide/sae.png)
* Bucket名字可自定义，需要与config.php里STORAGE_BUCKET_NAME保持一致
* 当有请求访问/index.php?a=xxx&b=xxxx，所有携带数据包括get，post，cookie，httpheaders，客户端信息都会记录

## keepsession
* 因SAE的io限制，我直接去掉了单例模式，所以可能存在被ddos后频繁的fetch，可以自行修改keepsession.php加上限制，或者关闭keepsession功能

## js地址
* js保存在Storage内，默认地址为http://(app name)-(bucket name).stor.sinaapp.com/myjs/xxx.js，或者http://(app name)-(bucket name).stor.sinaapp.com/template/xxx.js
* 可以直接使用UI上的复制js地址，或者生成payload功能，直接得到js的地址
![](./guide/js.png)

## 其他说明
* 详细说明请查看master分支的README.md

## 特别说明
* 前端使用[Bootstrap](http://getbootstrap.com/)与[jQWidgets](http://www.jqwidgets.com/)开发，（原来用kendo UI，受限于商业许可，改用jQWidgets），`you can use jQWidgets for free under the Creative Commons Attribution-NonCommercial 3.0 License`, 但是不可用于商业用途，如需用于商业用途请购买授权
* 为实现jqxgrid不支持的功能，如固定表格高度实现row高度自动调节，修改了jQWidgets部分代码，具体修改部分可查看diff文件夹
* 使用纯真ip库的函数基于Discuz X3.1 function_misc.php上修改而来, 判断客户端操作系统与浏览器的脚本基于原作者@author  Jea杨写的php版本修改而来，后台整体布局借鉴Kendo UI 的demo NORTHWIND DASH
* js代码格式化使用[js_beautify](https://github.com/beautify-web/js-beautify)库
* js代码压缩采用jsmin.js
* js代码编辑器采用[ace](https://ace.c9.io)
* 安装脚本完全参考[wordpress](https://cn.wordpress.org/)的安装程序
* **Warning: 本工具仅允许使用在CTF比赛等学习、研究场景，严禁用于非法用途**

## 意见与建议

欢迎大家在使用过程中提出各种宝贵的意见和建议，以及各种bug，不胜感激

反馈邮箱firesun.cn`at`gmail.com
