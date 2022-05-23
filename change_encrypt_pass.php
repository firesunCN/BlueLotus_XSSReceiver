<?php
//本文件未鉴权,安全起见默认禁用此php文件,需要时自行注释exit()
exit();


/*
 * 当修改config.php里的加密方式或者加密密码时,可用此文件来重新加密xss记录,js的描述,ip封禁列表
 * 请在修改加密方式或者加密密码后执行此文件（如果选择不加密,加密密码写任意值）
 * 用法：
 * php change_encrypt_pass.php (以前是否加密true/false) (旧加密密码) (旧加密方法AES/RC4) (现在是否加密) (新加密密码) (新加密方法)
 * 举例
 * php change_encrypt_pass.php true bluelotus AES true bluelotus RC4
 * php change_encrypt_pass.php true bluelotus AES false xxxx(任意值) AES
 */

/*
 * 从旧版本升级的方法
 * 1. php change_encrypt_pass.php update (以前是否加密true/false) (旧加密密码)
 *    此时所有xss记录转化为加密开启，密码bluelotus，加密方法RC4
 * 2. 修改config.php，修改加密开关，新密码，加密方式
 * 3. php change_encrypt_pass.php true bluelotus rc4 (现在是否加密) (新加密密码) (新加密方法)
 * 4. 升级完成
 */
define('IN_XSS_PLATFORM', true);
require_once('config.php');

if( isset( $argv[1] ) ) {
	if ($argv[1] === 'update')
		update_from_old_version($argv[2], $argv[3]);
	else
		change_pass($argv[1], $argv[2], $argv[3], $argv[4], $argv[5], $argv[6]);	
}

function update_from_old_version($old_encrypt_enable, $old_encrypt_pass) {
    //如果从旧版本升级，就统一先切换为RC4，密码bluelotus
    modify_ForbiddenIPList($old_encrypt_enable, $old_encrypt_pass, 'AES', 'true', 'bluelotus', 'RC4');
    modify_xss_record($old_encrypt_enable, $old_encrypt_pass, 'AES', 'true', 'bluelotus', 'RC4');
}

function change_pass($old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type) {
    modify_ForbiddenIPList($old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
    modify_xss_record($old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
    modify_js_desc(MY_JS_PATH, $old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
    modify_js_desc(JS_TEMPLATE_PATH, $old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
}

function modify_ForbiddenIPList($old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type) {
    $logfile = DATA_PATH . '/forbiddenIPList.dat';
    
    $str = @file_get_contents($logfile);
    if ($str === false)
        return;
    
    $str = decrypt($str, $old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type);
    $str = encrypt($str, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
    
    if (@file_put_contents($logfile, $str))
        echo "修改封禁ip成功\n";
    else
        echo "修改封禁ip失败，可能是没有权限，chmod 777！\n";
}

function modify_xss_record($old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type) {
    $files = glob(DATA_PATH . '/*.php');
    
    foreach ($files as $file) {
        $filename = basename($file, ".php");
        if (preg_match('/^[0-9]{10}$/', $filename)) {
            $logFile = dirname(__FILE__) . '/' . DATA_PATH . '/' . $filename . '.php';
            $info    = @file_get_contents($logFile);
            
            if ($info !== false && strncmp($info, '<?php exit();?>', 15) === 0) {
                $info = substr($info, 15);
                $info = decrypt($info, $old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type);
            } else
                $info = "";
            $info = encrypt($info, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
            
            if (@file_put_contents($logFile, '<?php exit();?>' . $info))
                echo "修改一条xss记录成功\n";
            else
                echo "修改一条xss记录失败，可能是没有权限，chmod 777！\n";
            
        }
    }
}

function modify_js_desc($path, $old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type) {
    $files = glob($path . '/*.js');
    foreach ($files as $file) {
        //由于可能有中文名,故使用正则来提取文件名
        $filename = preg_replace('/^.+[\\\\\\/]/', '', $file);
        $filename = substr($filename, 0, strlen($filename) - 3);
        
        $desc = @file_get_contents(dirname(__FILE__) . '/' . $path . '/' . $filename . '.desc');
        
        if ($desc !== false)
            $desc = decrypt($desc, $old_encrypt_enable, $old_encrypt_pass, $old_encrypt_type);
        else
            $desc = "";
        
        $desc = encrypt($desc, $new_encrypt_enable, $new_encrypt_pass, $new_encrypt_type);
        
        if (@file_put_contents(dirname(__FILE__) . '/' . $path . '/' . $filename . '.desc', $desc))
            echo "修改一条js描述成功\n";
        else
            echo "修改一条js描述失败，可能是没有权限，chmod 777！\n";
    }
}

function encrypt($info, $encrypt_enable, $encrypt_pass, $encrypt_type) {
    if ($encrypt_enable) {
        if ($encrypt_type === 'AES') {
            require_once('aes.php');
            $info = AESEncryptCtr($info, $encrypt_pass);
        } else {
            require_once('rc4.php');
            $info = base64_encode(rc4($info, $encrypt_pass));
        }
    } else
        $info = base64_encode($info);
    
    return $info;
}

function decrypt($info, $encrypt_enable, $encrypt_pass, $encrypt_type) {
    if ($encrypt_enable) {
        if ($encrypt_type === 'AES') {
            require_once('aes.php');
            $info = AESDecryptCtr($info, $encrypt_pass);
            
        } else {
            require_once('rc4.php');
            $info = rc4(base64_decode($info), $encrypt_pass);
        }
    } else
        $info = base64_decode($info);
    return $info;
}