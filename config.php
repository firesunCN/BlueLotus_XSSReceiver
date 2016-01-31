<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

define("PASS", "2a05218c7aa0a6dbd370985d984627b8"); //后台登录密码：默认密码bluelotus
define("DATA_PATH", "data"); //xss记录、封禁ip列表存放目录
define("JS_TEMPLATE_PATH", "template"); //js模板存放目录
define("MY_JS_PATH", "myjs"); //我的js存放目录
define("ENCRYPT_ENABLE", true); //是否加密“xss记录，封禁ip列表，js描述”
define("ENCRYPT_PASS", "bluelotus"); //加密密码
define("ENCRYPT_TYPE", "RC4"); //加密方法（AES或RC4）
define("KEEP_SESSION", true); //是否启用KEEP_SESSION功能，需要外部定时访问keepsession.php
define("IPDATA_PATH", "qqwry.dat"); //ip归属地数据库地址

/*SAE相关配置*/
define('STORAGE_BUCKET_NAME', 'bluelotus');//SAE Storage的Bucket Name