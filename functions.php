<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

require_once('load.php');

//nginx无getallheaders函数
if (!function_exists('getallheaders')) {
    function getallheaders() {
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

//判断该记录是否
function isKeepSession($info) {
    $keepsession = false;
    
    foreach ($info['get_data'] as $k => $v) {
        if ($k === 'keepsession') {
            $keepsession = ($v === "1" ? true : false);
            return $keepsession;
        }
    }
    
    foreach ($info['post_data'] as $k => $v) {
        if ($k === 'keepsession') {
            $keepsession = ($v === "1" ? true : false);
            return $keepsession;
        }
    }
    
    foreach ($info['cookie_data'] as $k => $v) {
        if ($k === 'keepsession') {
            $keepsession = ($v === "1" ? true : false);
            return $keepsession;
        }
    }
    return $keepsession;
}

//xss过滤
function stripStr($str) {
    if (get_magic_quotes_gpc())
        $str = stripslashes($str);
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function stripArr($arr) {
    $new_arr = array();
    foreach ($arr as $k => $v) {
        $new_arr[stripStr($k)] = stripStr($v);
    }
    return $new_arr;
}

//尝试base64解码
function tryBase64Decode($arr) {
    if (isset($arr) && count($arr) > 0) {
        $isChanged = 0;
        
        $new_arr = array();
        foreach ($arr as $k => $v) {
            $decoded_v = '';
            if (isBase64Formatted($v)) {
                $decoded_v = base64_decode($v);
                $isChanged = 1;
            }
            $new_arr[$k] = $decoded_v;
        }
        
        if ($isChanged)
            return $new_arr;
        else
            return false;
    } else
        return false;
}

//判断string是否为base64编码（判断方法：解码后为可见字符串）
function isBase64Formatted($str) {
    if (preg_match('/^[A-Za-z0-9+\/=]+$/', $str))
        if ($str == base64_encode(base64_decode($str)))
            if (preg_match('/^[A-Za-z0-9\x00-\x80~!@#$%&_+-=:";\'<>,\/"\[\]\\\^\.\|\?\*\+\(\)\{\}\s]+$/', base64_decode($str)))
                return true;
    return false;
}

function encrypt($info) {
    if (ENCRYPT_ENABLE) {
        if (ENCRYPT_TYPE === 'AES') {
            require_once('aes.php');
            $info = AESEncryptCtr($info, ENCRYPT_PASS);
        } else {
            require_once('rc4.php');
            $info = base64_encode(rc4($info, ENCRYPT_PASS));
        }
    } else
        $info = base64_encode($info);
    
    return $info;
}

function decrypt($info) {
    if (ENCRYPT_ENABLE) {
        if (ENCRYPT_TYPE === 'AES') {
            require_once("aes.php");
            $info = AESDecryptCtr($info, ENCRYPT_PASS);
            
        } else {
            require_once('rc4.php');
            $info = rc4(base64_decode($info), ENCRYPT_PASS);
        }
    } else
        $info = base64_decode($info);
    return $info;
}

//获得访问者真实ip
function getRealIP(){
    $ip="unknown";
    if (XFF_ENABLE) {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR', 'HTTP_VIA', 'HTTP_FROM', 'REMOTE_ADDR') as $v) {
            if (isset($_SERVER[$v])) {
                if (! preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/', $_SERVER[$v])) {
                    continue;
                }
                $ip = $_SERVER[$v];
				break;
            }
        }
    }
    else {
        if ( isset($_SERVER['REMOTE_ADDR']) )
            $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

//基于Discuz X3.1 function_misc.php 函数已过滤，可直接输出
function convertIP($ip, $ipdatafile) {
    $ipaddr = '未知';
    if (preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/', $ip)) {
        $iparray = explode('.', $ip);
        if ($iparray[0] == 10 || $iparray[0] == 127 || ($iparray[0] == 192 && $iparray[1] == 168) || ($iparray[0] == 172 && ($iparray[1] >= 16 && $iparray[1] <= 31))) {
            $ipaddr = '局域网';
        } elseif ($iparray[0] > 255 || $iparray[1] > 255 || $iparray[2] > 255 || $iparray[3] > 255) {
            $ipaddr = '错误ip';
        } else {
            if (@file_exists($ipdatafile)) {
                if (!$fd = @fopen($ipdatafile, 'rb')) {
                    return 'ip库出错';
                }
                
                $ip    = explode('.', $ip);
                $ipNum = $ip[0] * 16777216 + $ip[1] * 65536 + $ip[2] * 256 + $ip[3];
                
                if (!($DataBegin = fread($fd, 4)) || !($DataEnd = fread($fd, 4)))
                    return;
                @$ipbegin = implode('', unpack('L', $DataBegin));
                if ($ipbegin < 0)
                    $ipbegin += pow(2, 32);
                @$ipend = implode('', unpack('L', $DataEnd));
                if ($ipend < 0)
                    $ipend += pow(2, 32);
                $ipAllNum = ($ipend - $ipbegin) / 7 + 1;
                
                $BeginNum = $ip2num = $ip1num = 0;
                $ipAddr1  = $ipAddr2 = '';
                $EndNum   = $ipAllNum;
                
                while ($ip1num > $ipNum || $ip2num < $ipNum) {
                    $Middle = intval(($EndNum + $BeginNum) / 2);
                    
                    fseek($fd, $ipbegin + 7 * $Middle);
                    $ipData1 = fread($fd, 4);
                    if (strlen($ipData1) < 4) {
                        fclose($fd);
                        return '系统错误';
                    }
                    $ip1num = implode('', unpack('L', $ipData1));
                    if ($ip1num < 0)
                        $ip1num += pow(2, 32);
                    
                    if ($ip1num > $ipNum) {
                        $EndNum = $Middle;
                        continue;
                    }
                    
                    $DataSeek = fread($fd, 3);
                    if (strlen($DataSeek) < 3) {
                        fclose($fd);
                        return '系统错误';
                    }
                    $DataSeek = implode('', unpack('L', $DataSeek . chr(0)));
                    fseek($fd, $DataSeek);
                    $ipData2 = fread($fd, 4);
                    if (strlen($ipData2) < 4) {
                        fclose($fd);
                        return '系统错误';
                    }
                    $ip2num = implode('', unpack('L', $ipData2));
                    if ($ip2num < 0)
                        $ip2num += pow(2, 32);
                    
                    if ($ip2num < $ipNum) {
                        if ($Middle == $BeginNum) {
                            fclose($fd);
                            return '未知';
                        }
                        $BeginNum = $Middle;
                    }
                }
                
                $ipFlag = fread($fd, 1);
                if ($ipFlag == chr(1)) {
                    $ipSeek = fread($fd, 3);
                    if (strlen($ipSeek) < 3) {
                        fclose($fd);
                        return '系统错误';
                    }
                    $ipSeek = implode('', unpack('L', $ipSeek . chr(0)));
                    fseek($fd, $ipSeek);
                    $ipFlag = fread($fd, 1);
                }
                
                if ($ipFlag == chr(2)) {
                    $AddrSeek = fread($fd, 3);
                    if (strlen($AddrSeek) < 3) {
                        fclose($fd);
                        return '系统错误';
                    }
                    $ipFlag = fread($fd, 1);
                    if ($ipFlag == chr(2)) {
                        $AddrSeek2 = fread($fd, 3);
                        if (strlen($AddrSeek2) < 3) {
                            fclose($fd);
                            return '系统错误';
                        }
                        $AddrSeek2 = implode('', unpack('L', $AddrSeek2 . chr(0)));
                        fseek($fd, $AddrSeek2);
                    } else {
                        fseek($fd, -1, SEEK_CUR);
                    }
                    
                    while (($char = fread($fd, 1)) != chr(0))
                        $ipAddr2 .= $char;
                    
                    $AddrSeek = implode('', unpack('L', $AddrSeek . chr(0)));
                    fseek($fd, $AddrSeek);
                    
                    while (($char = fread($fd, 1)) != chr(0))
                        $ipAddr1 .= $char;
                } else {
                    fseek($fd, -1, SEEK_CUR);
                    while (($char = fread($fd, 1)) != chr(0))
                        $ipAddr1 .= $char;
                    
                    $ipFlag = fread($fd, 1);
                    if ($ipFlag == chr(2)) {
                        $AddrSeek2 = fread($fd, 3);
                        if (strlen($AddrSeek2) < 3) {
                            fclose($fd);
                            return '系统错误';
                        }
                        $AddrSeek2 = implode('', unpack('L', $AddrSeek2 . chr(0)));
                        fseek($fd, $AddrSeek2);
                    } else {
                        fseek($fd, -1, SEEK_CUR);
                    }
                    while (($char = fread($fd, 1)) != chr(0))
                        $ipAddr2 .= $char;
                }
                fclose($fd);
                
                $ipAddr1 = iconv('gb18030', "utf-8//IGNORE", $ipAddr1);
                if ($ipAddr2) {
                    if (ord($ipAddr2{0}) == 2)
                        $ipAddr2 = "";
                    else
                        $ipAddr2 = iconv('gb18030', "utf-8//IGNORE", $ipAddr2);
                }
                
                if (preg_match('/http/i', $ipAddr2)) {
                    $ipAddr2 = '';
                }
                
                $ipaddr = $ipAddr1 . $ipAddr2;
                $ipaddr = preg_replace('/CZ88\.NET/is', '', $ipaddr);
                $ipaddr = preg_replace('/^\s*/is', '', $ipaddr);
                $ipaddr = preg_replace('/\s*$/is', '', $ipaddr);
                if (preg_match('/http/i', $ipaddr) || $ipaddr == '') {
                    $ipaddr = '未知';
                }
                return htmlspecialchars($ipaddr, ENT_QUOTES, 'UTF-8');
            }
        }
    }
    return $ipaddr;
}