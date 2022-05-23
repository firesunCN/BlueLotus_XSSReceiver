<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

define('PASS', '2a05218c7aa0a6dbd370985d984627b8'); //后台登录密码：默认密码bluelotus
define('DATA_PATH', 'data'); //xss记录、封禁ip列表存放目录
define('JS_TEMPLATE_PATH', 'template'); //js模板存放目录
define('MY_JS_PATH', 'myjs'); //我的js存放目录
define('ENCRYPT_ENABLE', true); //是否加密“xss记录，封禁ip列表，js描述”
define('ENCRYPT_PASS', 'bluelotus'); //加密密码
define('ENCRYPT_TYPE', 'RC4'); //加密方法（AES或RC4）
define('KEEP_SESSION', true); //是否启用KEEP_SESSION功能，需要外部定时访问keepsession.php
define('ADMIN_IP_CHECK_ENABLE', true);//是否启用管理员ip认证，启用后，当xss平台发现ip变化，将会踢出管理员要求重新登录，如果发现经常异常退出控制面板，请关闭此项认证
define('XFF_ENABLE', false);//是否使用HTTP_X_FORWARDED_FOR的地址来代替REMOTE_ADDR，当且仅当存在反代的情况下才须开启，开启须谨慎！
define('IPDATA_PATH', 'qqwry.dat'); //ip归属地数据库地址

/*邮件通知相关配置*/

define('MAIL_ENABLE', false); //开启邮件通知
define('SMTP_SERVER', 'smtp.xxx.com'); //smtp服务器
define('SMTP_PORT', 465); //端口
define('SMTP_SECURE', 'ssl');
define('MAIL_USER', 'xxx@xxx.com'); //发件人用户名
define('MAIL_PASS', 'xxxxxx'); //发件人密码
define('MAIL_FROM', 'xxx@xxx.com'); //发件人地址（需真实，不可伪造）
define('MAIL_RECV', 'xxxx@xxxx.com'); //接收通知的邮件地址