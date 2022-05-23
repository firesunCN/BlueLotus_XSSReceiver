<?php
define('IN_XSS_PLATFORM', true);

require_once('functions.php');
require_once('dio.php');

//CSP开启
require_once('waf.php');

//设置httponly
ini_set('session.cookie_httponly', 1);
session_start();


//判断是否登陆
if (isset($_SESSION['isLogin']) && $_SESSION['isLogin'] === true) {
    header('Location: admin.php');
    exit();
}

//判断ip是否在封禁列表中
$forbiddenIPList = loadForbiddenIPList();
$ip              = getRealIP();
$is_pass_wrong   = false;
if (!isset($forbiddenIPList[$ip]) || $forbiddenIPList[$ip] <= 5) {
    if (isset($_POST['password']) && $_POST['password'] != "") {
        if (checkPassword($_POST['password'])) {
            $_SESSION['isLogin']    = true;
            $_SESSION['user_IP']    = $ip;
            $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
            if (isset($forbiddenIPList[$ip])) {
                unset($forbiddenIPList[$ip]);
                saveForbiddenIPList($forbiddenIPList);
            }
            header('Location: admin.php');
            exit();
        } else {
            if (isset($forbiddenIPList[$ip]))
                $forbiddenIPList[$ip]++;
            else
                $forbiddenIPList[$ip] = 1;
            saveForbiddenIPList($forbiddenIPList);
            $is_pass_wrong = true;
        }
    }
} else
    $is_pass_wrong = true;

/*
生成密码

php -r '$salt="!KTMdg#^^I6Z!deIVR#SgpAI6qTN7oVl";$key="你的密码";$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);$key=md5($salt.$key.$salt);echo $key;'

*/
function checkPassword($p) {
    if (isset($_POST['firesunCheck']) && isset($_SESSION['firesunCheck']) && $_SESSION['firesunCheck'] != '' && $_POST['firesunCheck'] === $_SESSION['firesunCheck']) {
        //改了这个盐记得改login.js里的，两个要一致
        $salt = '!KTMdg#^^I6Z!deIVR#SgpAI6qTN7oVl';
        $key  = PASS;
        $key  = md5($salt . $key . $_SESSION['firesunCheck'] . $salt);
        $key  = md5($salt . $key . $_SESSION['firesunCheck'] . $salt);
        $key  = md5($salt . $key . $_SESSION['firesunCheck'] . $salt);
        return $key === $p;
    }
    return false;
}

//生成挑战应答的随机值
function generate_password($length = 32) {
    $chars    = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $password = '';
    for ($i = 0; $i < $length; $i++)
        $password .= $chars[mt_rand(0, strlen($chars) - 1)];
    return $password;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>登录</title>
        <link rel="stylesheet" href='static/css/font-awesome.min.css' type="text/css" >
        <link rel="stylesheet" href="static/css/login.min.css" type="text/css" />
        <link rel="shortcut icon" href="favicon.ico" type="image/vnd.microsoft.icon" />
        <link rel="icon" href="favicon.ico" type="image/vnd.microsoft.icon" />
    
        <script type="text/javascript" src="static/js/jquery.min.js" ></script>
        <script type="text/javascript" src="static/js/login.min.js" ></script>
        
<?php
if ($is_pass_wrong)
    echo '<script type="text/javascript" src="static/js/pass_is_wrong.js" ></script>';
?>
    </head>
    
    <body>
        <div id="loginform">
            <div id="logo"></div>
            <div id="mainlogin">
                <h1>
                    登录控制面板
                </h1>
                <form action="" method="post">
                    <input type="password" placeholder="password" id="password" name="password" required="required">
                    <input id="firesunCheck" type="hidden" name="firesunCheck" value=<?php
$firesunCheck             = generate_password(32);
$_SESSION['firesunCheck'] = $firesunCheck;
echo json_encode($_SESSION['firesunCheck']);
?> />
                    
                    <button type="submit" id="submit" disabled="disabled">
                        <i class="fa fa-arrow-right">
                        </i>
                    </button>
                    
                </form>
                <div id="note">
                    <a href="#">
                        忘记密码?
                    </a>
                </div>
            </div>
        </div>
    </body>

</html>