# XSS数据接收平台（无SQL版）
## 使用说明
本平台设计理念，基本无需配置即可使用，故设计为无需数据库，无需其他组件支持，可直接在php虚拟空间使用，使用步骤：

![](./guide/mainpanel.png)

* 上传所有文件至空间根目录
* 修改config.php，指定数据存放目录，数据是否启用AES加密及加密密码
```php
define('PASS', '2a05218c7aa0a6dbd370985d984627b8');
define('DATA_PATH', 'data');
define('ENABLE_ENCRYPT', true);
define('ENCRYPT_PASS', "bluelotus");
```
可用php -r "$salt='!KTMdg#^^I6Z!deIVR#SgpAI6qTN7oVl';$key='你的密码';$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);echo $key;"生成密码hash
* 赋予`DATA_PATH`目录写权限
* 当有请求访问/index.php?a=xxx&b=xxxx，所有携带数据包括get，post，cookie，httpheaders，客户端信息都会记录
* 可访问login.php登录查看记录的数据

![](./guide/login.png)

## 目前支持功能
* 自动判断携带数据是否base64编码，可自动解码

![](./guide/base64.png)

* 记录所有可记录的数据，并可根据ip判断位置，根据useragent判断操作系统与浏览器

![](./guide/info.png)

* 新消息提醒，仿QQ邮箱新消息提醒框，可实时获得数据

![](./guide/newmessage.png)


* 支持简单的查找功能
* 除了style允许unsafe-inline外启用CSP
* 挑战应答式的登录校验，session绑定ip与useragent

## TODO
* keepsession
* 完全启用CSP
* 我的js
* js模板
* 多用户（SQL版）
* WebSocket（新消息推送模式）

## 特别说明
* 前端使用Bootstrap与jQWidgets开发，（原来用kendo UI，受限于商业许可，改用jQWidgets），`you can use jQWidgets for free under the Creative Commons Attribution-NonCommercial 3.0 License`, 但是不可用于商业用途，如需用于商业用途请购买授权
* 为实现jqxgrid不支持的功能，如固定表格高度实现row高度自动调节，修改了jQWidgets部分代码，具体修改部分可查看diff文件夹
* 为方便开发与调试，未合并压缩js与css，待最终版发布后合并
* 使用纯真ip库的函数基于Discuz X3.1 function_misc.php上修改而来, 判断客户端操作系统与浏览器的脚本基于原作者@author  Jea杨写的php版本修改而来，后台整体布局借鉴Kendo UI 的demo NORTHWIND DASH
* `本工具仅允许使用在CTF比赛等学习、研究场景，严禁用于非法用途`