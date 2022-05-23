<?php
define('IN_XSS_PLATFORM',true);
ignore_user_abort(true);

//检测是否已经安装
if ( file_exists('config.php') ) {
    display_header();
    delTempFiles();
    die( '<h1>已安装</h1><p>请勿重复安装！</p><p class="step"><a href="login.php" class="button button-large">登录</a></p></body></html>' );
}

$step = isset( $_GET['step'] ) ? (int) $_GET['step'] : 0;

switch($step) {
    case 0: // 显示说明
        display_header();
        
?>
<form id="setup" method="post" action="?step=1">
    <h1>欢迎</h1>
    <p>欢迎使用本平台，安装开始前，请仔细阅读以下说明</p>
    <p>手动安装方法：将config-sample.php改名为config.php，删除install.php即可。</p>
    <h2>警告：</h2>
    <p><b>本工具仅允许用于学习、研究场景，严禁用于任何非法用途！</b></p>
    <p>人在做，天在看。善恶终有报，天道好轮回。不信抬头看，苍天饶过谁。</p>
    <p class="step"><input name="submit" type="submit" value="安装" class="button button-large"></p>
</form>
<?php        
        break;
        
    case 1: // 配置
        display_header();
?>

<h1>配置</h1>
<p>请按照下面提示配置xss平台，默认配置可直接下一步</p>

<?php
        display_setup_form();
        break;
        
    case 2: // 写入config.php
        display_header();        
        
        //输入处理：使用stripStr过滤xss，使用json_encode生成最终string
        $encrypt_enable = isset( $_POST['encrypt_enable'] ) ? true : false;
        $keep_session_enable = isset( $_POST['keep_session_enable'] ) ? true : false;
        $admin_ip_check_enable = isset( $_POST['admin_ip_check_enable'] ) ? true : false;
        $xff_enable= isset( $_POST['xff_enable'] ) ? true : false;
        $mail_enable = isset( $_POST['mail_enable'] ) ? true : false;
        
        $pass = isset( $_POST['pass'] ) ? stripStr($_POST['pass']) : '';
        $encrypt_pass = isset( $_POST['encrypt_pass'] ) ? stripStr($_POST['encrypt_pass']) : '';
        $mail_pass = isset( $_POST['mail_pass'] ) ? stripStr($_POST['mail_pass']) : '';
        
        $data_path = isset($_POST['data_path']) ? stripStr(trim( $_POST['data_path'] )) : '';
        $js_template_path = isset( $_POST['js_template_path'] ) ? stripStr(trim( $_POST['js_template_path'] )) : '';
        $my_js_path = isset( $_POST['my_js_path'] ) ? stripStr(trim( $_POST['my_js_path'] )) : '';
        $encrypt_type = isset( $_POST['encrypt_type'] ) ? stripStr(trim( $_POST['encrypt_type'] )) : '';        
        $ipdata_path = isset( $_POST['ipdata_path'] ) ? stripStr(trim( $_POST['ipdata_path'] )) : '';    
        $smtp_server = isset( $_POST['smtp_server'] ) ? stripStr(trim( $_POST['smtp_server'] )) : '';
        $smtp_port = isset( $_POST['smtp_port'] ) ? stripStr(trim( $_POST['smtp_port'] )) : '';
        $smtp_secure = isset( $_POST['smtp_secure'] ) ? stripStr(trim( $_POST['smtp_secure'] )) : '';
        $mail_user = isset( $_POST['mail_user'] ) ? stripStr(trim( $_POST['mail_user'] )) : '';
        $mail_from = isset( $_POST['mail_from'] ) ? stripStr(trim( $_POST['mail_from'] )) : '';
        $mail_recv = isset( $_POST['mail_recv'] ) ? stripStr(trim( $_POST['mail_recv'] )) : '';
    
        $error = false;
            
        if ( $pass==='' ) {
            display_setup_form( '登录密码不可为空' );
            $error = true;
        }
        else if ( !preg_match( '/^[0-9a-zA-Z_\/\\\.]+$/' , $data_path ) ) {
            display_setup_form( 'xss数据存储路径非法' );
            $error = true;
        }
        else if ( !is_dir ( $data_path ) ) {
            
            display_setup_form( 'xss数据存储路径不存在' );
            $error = true;
        }
        else if ( !is_writable ( $data_path ) ) {
            display_setup_form( 'xss数据存储路径不可写' );
            $error = true;
        }
        else if ( glob($js_template_path.'/*')=== glob('static/js'.'/*') ) {
            display_setup_form( 'js模板存储路径非法' );
            $error = true;
        }
        else if ( !preg_match( '/^[0-9a-zA-Z_\/\\\.]+$/' , $js_template_path ) ) {
            display_setup_form( 'js模板存储路径非法' );
            $error = true;
        }
        else if ( !is_dir ( $js_template_path ) ) {
            display_setup_form( 'js模板存储路径不存在' );
            $error = true;
        }
        else if ( !is_writable ( $js_template_path ) ) {
            display_setup_form( 'js模板存储路径不可写' );
            $error = true;
        }
        else if ( glob($my_js_path.'/*')=== glob('static/js'.'/*') ) {
            display_setup_form( '我的js存储路径非法' );
            $error = true;
        }
        else if ( !preg_match( '/^[0-9a-zA-Z_\/\\\.]+$/' , $my_js_path ) ) {
            display_setup_form( '我的js存储路径非法' );
            $error = true;
        }
        else if ( !is_dir ( $my_js_path ) ) {
            display_setup_form( '我的js存储路径不存在' );
            $error = true;
        }
        else if ( !is_writable ( $my_js_path ) ) {
            display_setup_form( '我的js存储路径不可写' );
            $error = true;
        }
        else if ( $encrypt_enable && $encrypt_pass==='' ) {
            display_setup_form( '加密密码不可为空' );
            $error = true;
        }
        else if ( $encrypt_type!=="RC4" && $encrypt_type !== "AES" ) {
            display_setup_form( '加密方式错误' );
            $error = true;
        }
        else if ( !file_exists( $ipdata_path ) ) {
            display_setup_form( 'ip数据库不存在' );
            $error = true;
        }
        else if ( !preg_match( '/^[0-9]*$/' , $smtp_port ) ) {
            display_setup_form( 'SMTP端口不合法' );
            $error = true;
        }
        else
        {
            //生成密码hash
            $salt='!KTMdg#^^I6Z!deIVR#SgpAI6qTN7oVl';
            $pass=md5($salt.$pass.$salt);
            $pass=md5($salt.$pass.$salt);
            $pass=md5($salt.$pass.$salt);
                
            $config_str = <<<CONFIG
<?php
if(!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

CONFIG;
            $config_str .= 'define("PASS", '.json_encode($pass).');//后台登录密码：默认密码bluelotus' . PHP_EOL;
            //正则判断过，不做json_encode处理
            $config_str .= 'define("DATA_PATH", "'.$data_path.'");//xss记录、封禁ip列表存放目录' . PHP_EOL;
            $config_str .= 'define("JS_TEMPLATE_PATH", "'.$js_template_path.'");//js模板存放目录' . PHP_EOL;
            $config_str .= 'define("MY_JS_PATH", "'.$my_js_path.'");//我的js存放目录' . PHP_EOL;
            $config_str .= 'define("ENCRYPT_ENABLE", '.($encrypt_enable?"true":"false").');//是否加密“xss记录，封禁ip列表，js描述”' . PHP_EOL;
            $config_str .= 'define("ENCRYPT_PASS", '.json_encode( $encrypt_pass).');//加密密码' . PHP_EOL;
            $config_str .= 'define("ENCRYPT_TYPE", '.json_encode( $encrypt_type).');//加密方法（AES或RC4）' . PHP_EOL;
            $config_str .= 'define("KEEP_SESSION", '.($keep_session_enable?"true":"false").');//是否启用KEEP_SESSION功能，需要外部定时访问keepsession.php' . PHP_EOL;    
            $config_str .= 'define("ADMIN_IP_CHECK_ENABLE", '.($admin_ip_check_enable?"true":"false").');//是否启用管理员ip认证，启用后，当xss平台发现ip变化，将会踢出管理员要求重新登录，如果发现经常异常退出控制面板，请关闭此项认证' . PHP_EOL;
            $config_str .= 'define("XFF_ENABLE", '.($xff_enable?"true":"false").');//是否使用HTTP_X_FORWARDED_FOR的地址来代替REMOTE_ADDR，当且仅当存在反代的情况下才须开启，开启须谨慎！' . PHP_EOL;
            $config_str .= 'define("IPDATA_PATH", '.json_encode( $ipdata_path).');//ip归属地数据库地址' . PHP_EOL;
            $config_str .= 'define("MAIL_ENABLE", '.($mail_enable?"true":"false").');//开启邮件通知' . PHP_EOL;
            $config_str .= 'define("SMTP_SERVER", '.json_encode( $smtp_server).');//smtp服务器' . PHP_EOL;
            //正则判断过，不做json_encode处理
            $config_str .= 'define("SMTP_PORT", '.$smtp_port.');//端口' . PHP_EOL;
            $config_str .= 'define("SMTP_SECURE", '.json_encode( $smtp_secure).');' . PHP_EOL;
            $config_str .= 'define("MAIL_USER", '.json_encode( $mail_user).');//发件人用户名' . PHP_EOL;
            $config_str .= 'define("MAIL_PASS", '.json_encode( $mail_pass).');//发件人密码' . PHP_EOL;
            $config_str .= 'define("MAIL_FROM", '.json_encode( $mail_from).');//发件人地址（需真实，不可伪造）' . PHP_EOL;
            $config_str .= 'define("MAIL_RECV", '.json_encode( $mail_recv).');//接收通知的邮件地址' . PHP_EOL;
            
            if (file_put_contents("config.php", $config_str)===false)
            {
                display_setup_form( '无法写入配置文件，请确保根目录有写权限' );
                $error = true;
            }
        }

        if ( $error === false ) {
            
            //重加密记录
            modifyJsDesc($my_js_path,true,'bluelotus','RC4',$encrypt_enable,$encrypt_pass, $encrypt_type);
            modifyJsDesc($js_template_path,true,'bluelotus','RC4',$encrypt_enable,$encrypt_pass, $encrypt_type);
            
            //安装完成，自杀
            delTempFiles();
            
?>

<h1>安装成功</h1>
<p>XSS平台安装成功，请点下方链接登录后台！</p>

<p class="step"><a href="login.php" class="button button-large">登录</a></p>
<?php
        }
        break;
}


function display_header() {

?>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="robots" content="noindex,nofollow" />
    <title>安装</title>
    <link rel="stylesheet" href="static/css/install.min.css" type="text/css" />
</head>
<body class="core-ui">
<p id="logo">
    <a href="1" tabindex="-1"></a>
</p>
<?php

} // end display_header()

function display_setup_form( $error = null ) {
    
    $encrypt_enable = isset( $_POST['encrypt_enable'] ) ? true : false;
    $keep_session_enable = isset( $_POST['keep_session_enable'] ) ? true : false;
    $admin_ip_check_enable = isset( $_POST['admin_ip_check_enable'] ) ? true : false;
    $xff_enable= isset( $_POST['xff_enable'] ) ? true : false;
    $mail_enable = isset( $_POST['mail_enable'] ) ? true : false;
    
    $pass = isset( $_POST['pass'] ) ? stripStr($_POST['pass']) : 'bluelotus';
    $encrypt_pass = isset( $_POST['encrypt_pass'] ) ? stripStr($_POST['encrypt_pass']) : 'bluelotus';
    $mail_pass = isset( $_POST['mail_pass'] ) ? stripStr($_POST['mail_pass']) : 'xxxxxx';
    
    $data_path = isset($_POST['data_path']) ? stripStr(trim( $_POST['data_path'] )) : 'data';
    $js_template_path = isset( $_POST['js_template_path'] ) ? stripStr(trim( $_POST['js_template_path'] )) : 'template';
    $my_js_path = isset( $_POST['my_js_path'] ) ? stripStr(trim( $_POST['my_js_path'] )) : 'myjs';
    $encrypt_type = isset( $_POST['encrypt_type'] ) ? stripStr(trim( $_POST['encrypt_type'] )) : 'RC4';        
    $ipdata_path = isset( $_POST['ipdata_path'] ) ? stripStr(trim( $_POST['ipdata_path'] )) : 'qqwry.dat';    
    $smtp_server = isset( $_POST['smtp_server'] ) ? stripStr(trim( $_POST['smtp_server'] )) : 'smtp.xxx.com';
    $smtp_port = isset( $_POST['smtp_port'] ) ? stripStr(trim( $_POST['smtp_port'] )) : '465';
    $smtp_secure = isset( $_POST['smtp_secure'] ) ? stripStr(trim( $_POST['smtp_secure'] )) : 'ssl';
    $mail_user = isset( $_POST['mail_user'] ) ? stripStr(trim( $_POST['mail_user'] )) : 'xxx@xxx.com';
    $mail_from = isset( $_POST['mail_from'] ) ? stripStr(trim( $_POST['mail_from'] )) : 'xxx@xxx.com';
    $mail_recv = isset( $_POST['mail_recv'] ) ? stripStr(trim( $_POST['mail_recv'] )) : 'xxx@xxx.com';
    
    if ( ! is_null( $error ) ) {
?>
<h1>错误</h1>
<p class="message"><?php echo stripStr($error); ?></p>
<?php
    } 
?>
<form id="setup" method="post" action="install.php?step=2" novalidate="novalidate">
    <table class="form-table">
        <tr>
            <th scope="row"><label for="pass">后台登录密码</label></th>
            <td>
                <input name="pass" type="text" id="pass" size="25" value="<?php echo $pass;?>" required="required"  />
                <p>特殊字符会被转义，慎用，下同</p>
            </td>
        </tr>
    
        <tr>
            <th scope="row"><label for="data_path">xss数据存储路径</label></th>
            <td>
                <input name="data_path" type="text" id="data_path" size="25" value="<?php echo $data_path; ?>" required="required" />
                <p>文件夹需要有写权限</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="js_template_path">js模板存储路径</label></th>
            <td>
                <input name="js_template_path" type="text" id="js_template_path" size="25" value="<?php echo $js_template_path;?>" required="required" />
                <p>文件夹需要有写权限</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="my_js_path">我的js存储路径</label></th>
            <td>
                <input name="my_js_path" type="text" id="my_js_path" size="25" value="<?php echo $my_js_path;?>" required="required" />
                <p>文件夹需要有写权限</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="encrypt_enable">启用数据加密</label></th>
            <td>
                <input type="checkbox" name="encrypt_enable" type="text" id="encrypt_enable" size="25" value="1" <?php if( !isset( $_POST['pass'] ) || $encrypt_enable===true ) echo 'checked="checked"';?> />
                <p>对xss记录，js描述文件加密</p>
            </td>
        </tr>    
    
        <tr>
            <th scope="row"><label for="encrypt_pass">数据加密密码</label></th>
            <td>
                <input name="encrypt_pass" type="text" id="encrypt_pass" size="25" value="<?php echo $encrypt_pass;?>" />
                <p>加密数据的密码</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="encrypt_type">加密方式</label></th>
            <td>
                
                
                <select name="encrypt_type" type="text" id="encrypt_type" size="1">
                    <option value ="RC4" <?php if($encrypt_type==='RC4') echo 'selected="selected"';?> >RC4</option>
                    <option value ="AES" <?php if($encrypt_type!=='RC4') echo 'selected="selected"';?> >AES</option>
                </select>
                
            </td>
        </tr>

        <tr>
            <th scope="row"><label for="keep_session_enable">启用keepsession</label></th>
            <td>
                <input type="checkbox" name="keep_session_enable" type="text" id="keep_session_enable" size="25" value="1" <?php if(!isset( $_POST['pass'] ) || $keep_session_enable===true) echo 'checked="checked"';?> />
                
                <p>详见README.md说明</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="admin_ip_check_enable">启用管理员IP校验</label></th>
            <td>
                <input type="checkbox" name="admin_ip_check_enable" type="text" id="admin_ip_check_enable" size="25" value="1" <?php if(!isset( $_POST['pass'] ) || $admin_ip_check_enable===true) echo 'checked="checked"';?> />
                
                <p>详见README.md说明</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="xff_enable">使用XFF识别源ip</label></th>
            <td>
                <input type="checkbox" name="xff_enable" type="text" id="xff_enable" size="25" value="1" <?php if($xff_enable===true) echo 'checked="checked"';?> />
                <p>仅在存在反代的情况下开启</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="ipdata_path">ip数据库位置</label></th>
            <td>
                <input name="ipdata_path" type="text" id="ipdata_path" size="25" value="<?php echo $ipdata_path;?>" required="required" />
                <p>纯真qqwry.dat位置</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="mail_enable">启用邮件通知</label></th>
            <td>
                <input type="checkbox" name="mail_enable" type="text" id="mail_enable" size="25" value="1" <?php if($mail_enable===true) echo 'checked="checked"';?> />
                <p>收到xss消息后邮件通知</p>
            </td>
        </tr>
    
        <tr>
            <th scope="row"><label for="smtp_server">SMTP服务器</label></th>
            <td>
                <input name="smtp_server" type="text" id="smtp_server" size="25" value="<?php echo $smtp_server;?>" />
                <p>SMTP服务器地址</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="smtp_port">SMTP服务器端口</label></th>
            <td>
                <input name="smtp_port" type="text" id="smtp_port" size="25" value="<?php echo $smtp_port;?>" />
                <p>详询服务提供商</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="smtp_secure">SMTP安全项</label></th>
            <td>
                <input name="smtp_secure" type="text" id="smtp_secure" size="25" value="<?php echo $smtp_secure;?>" />
                <p>默认无需修改</p>
            </td>
        </tr>
        
        <tr>
            <th scope="row"><label for="mail_user">SMTP用户名</label></th>
            <td>
                <input name="mail_user" type="text" id="mail_user" size="25" value="<?php echo $mail_user;?>" />
                <p>一般只是邮箱@之前的部分</p>
            </td>
        </tr>
    
        <tr>
            <th scope="row"><label for="mail_pass">SMTP密码</label></th>
            <td>
                <input name="mail_pass" type="text" id="mail_pass" size="25" value="<?php echo $mail_pass;?>" />
                <p>发件邮箱的密码</p>
            </td>
        </tr>
    
        <tr>
            <th scope="row"><label for="mail_from">发件人地址</label></th>
            <td>
                <input name="mail_from" type="text" id="mail_from" size="25" value="<?php echo $mail_from;?>" />
                <p>不可伪造，否者无法发送</p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="mail_recv">收件人地址</label></th>
            <td>
                <input name="mail_recv" type="text" id="mail_recv" size="25" value="<?php echo $mail_recv;?>" />
                <p>接收通知的邮件地址</p>
            </td>
        </tr>
        
    </table>
    <p class="step"><input name="submit" type="submit" value="提交" class="button button-large"></p>
    
</form>
<?php
} // end display_setup_form()

//xss过滤
function stripStr($str) {
    if(get_magic_quotes_gpc())
        $str=stripslashes($str);
    return htmlspecialchars($str,ENT_QUOTES,'UTF-8');
}

//js描述重加密
function modifyJsDesc($path,$old_encrypt_enable,$old_encrypt_pass,$old_encrypt_type,$new_encrypt_enable,$new_encrypt_pass, $new_encrypt_type) {
    $files = glob($path . '/*.js');
    foreach ($files as $file){
        //由于可能有中文名,故使用正则来提取文件名
        $filename=preg_replace('/^.+[\\\\\\/]/', '', $file);
        $filename=substr ( $filename , 0 , strlen ($filename)-3 );
            
        $desc=@file_get_contents(dirname( __FILE__ ).'/'.$path.'/'.$filename.'.desc');

        if($desc!==false)
            $desc=decrypt($desc,$old_encrypt_enable,$old_encrypt_pass,$old_encrypt_type);
        else
            $desc="";

        $desc=encrypt($desc, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
    
        @file_put_contents(dirname( __FILE__ ).'/'.$path.'/'.$filename.'.desc', $desc);
        
    }        
}

//加密
function encrypt($info,$encrypt_enable,$encrypt_pass,$encrypt_type) {
    if($encrypt_enable) {
        if($encrypt_type==='AES') {
            require_once('aes.php');
            $info=AESEncryptCtr($info,$encrypt_pass);
        }
        else {
            require_once('rc4.php');
            $info=base64_encode( rc4($info,$encrypt_pass) );
        }    
    }
    else
        $info=base64_encode($info);
    
    return $info;
}

//解密
function decrypt($info,$encrypt_enable,$encrypt_pass,$encrypt_type) {
    if($encrypt_enable) {
        if($encrypt_type==='AES') {
            require_once('aes.php');
            $info=AESDecryptCtr($info,$encrypt_pass);
            
        }
        else {
            require_once('rc4.php');
            $info=rc4(base64_decode($info),$encrypt_pass);
        }
    }
    else
        $info=base64_decode($info);
    return $info;
}

//删除目录及目录下所有文件
function delTree($dir) {
    $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
        (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir);
}

//删除临时文件
function delTempFiles() {
    @unlink($_SERVER['SCRIPT_FILENAME']);
    @unlink('config-sample.php');
    @unlink('change_encrypt_pass.php');
    @unlink('README.md');
    @unlink('LICENSE');
    @delTree('src/');
    @delTree('diff/');
    @delTree('guide/');
}
?> 