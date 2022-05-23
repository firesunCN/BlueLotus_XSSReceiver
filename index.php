<?php
define('IN_XSS_PLATFORM', true);
ignore_user_abort(true);
error_reporting(0);

//sometimes we only need "referer".

/*
if(count($_GET)==0&&count($_POST)==0&&count($_COOKIE)==0)
exit();
*/
header('Access-Control-Allow-Origin: *');
require_once('functions.php');
require_once('dio.php');

$info = array();

$user_IP        = getRealIP();
$user_port      = isset($_SERVER['REMOTE_PORT']) ? $_SERVER['REMOTE_PORT'] : 'unknown';
$protocol       = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'unknown';
$request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'unknown';
$request_URI    = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : 'unknown';
$request_time   = isset($_SERVER['REQUEST_TIME']) ? $_SERVER['REQUEST_TIME'] : time();

$headers_data = getallheaders();

//如果提交的数据有base64编码的就解码
$get_data            = $_GET;
$decoded_get_data    = tryBase64Decode($_GET);
$post_data           = $_POST;
$decoded_post_data   = tryBase64Decode($_POST);
$cookie_data         = $_COOKIE;
$decoded_cookie_data = tryBase64Decode($_COOKIE);

//防xss过滤，对array要同时处理key与value
$info['user_IP']        = stripStr($user_IP);
$info['user_port']      = stripStr($user_port);
$info['protocol']       = stripStr($protocol);
$info['request_method'] = stripStr($request_method);
$info['request_URI']    = stripStr($request_URI);
$info['request_time']   = stripStr($request_time);
$info['headers_data']   = stripArr($headers_data);

$info['get_data'] = stripArr($get_data);
if ($decoded_get_data)
    $info['decoded_get_data'] = stripArr($decoded_get_data);

$info['post_data'] = stripArr($post_data);
if ($decoded_post_data)
    $info['decoded_post_data'] = stripArr($decoded_post_data);

$info['cookie_data'] = stripArr($cookie_data);
if ($decoded_cookie_data)
    $info['decoded_cookie_data'] = stripArr($decoded_cookie_data);

//判断是否keepsession（判断标准：get或者post或者cookie包含keepsession=1）
$info['keepsession'] = isKeepSession($info) ? true : false;

save_xss_record(json_encode($info), $request_time);

//发送邮件通知
if (MAIL_ENABLE) {
    require_once("mail.php");
    @send_mail($info);
}