<?php
require_once("aes.php");
function getIP()
{
	if(isset($_SERVER['HTTP_CLIENT_IP'])) {
		$ip = $_SERVER['HTTP_CLIENT_IP'];
	}
	elseif(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	elseif(isset($_SERVER['HTTP_X_FORWARDED'])) {
		$ip = $_SERVER['HTTP_X_FORWARDED'];
	}
	elseif(isset($_SERVER['HTTP_FORWARDED_FOR'])) {
		$ip = $_SERVER['HTTP_FORWARDED_FOR'];
	}
	elseif(isset($_SERVER['HTTP_FORWARDED'])) {
		$ip = $_SERVER['HTTP_FORWARDED']; 
	}
	else {
		$ip = isset($_SERVER['REMOTE_ADDR'])?$_SERVER['REMOTE_ADDR']:"unknown";
	}
	return $ip;
}

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

function tryBase64Decode($arr) 
{
	if(isset($arr)&&count($arr)>0)
	{
		$isChanged=0;
		
		$new_arr = array();
		foreach($arr as $k => $v) 
		{
			if(isBase64Formatted($v))
			{
				$v=base64_decode($v);
				$isChanged=1;
			}
			$new_arr[$k]=$v;
		}
		
		if($isChanged)
			return $new_arr;
		else
			return false;
	}
	else
		return false;
}

function isBase64Formatted($str)
{
	if(preg_match('/^[A-Za-z0-9+\/=]+$/',$str))
	{
		$decoded_str=base64_decode($str);
		if ($str == base64_encode($decoded_str)) 
		{
			if(preg_match('/^[A-Za-z0-9\x00-\x80~!@#$%&_+-=:";\'<>,\/"\[\]\\\^\.\|\?\*\+\(\)\{\}\s]+$/',$decoded_str))
			{
				return true;
			}
		}
	}
    return false;
}

function encrypt($info,$encryptPass) 
{
	return AESEncryptCtr($info,$encryptPass);
}

function decrypt($info,$encryptPass) 
{
	return AESDecryptCtr($info,$encryptPass);
}

?>