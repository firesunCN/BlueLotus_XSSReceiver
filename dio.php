<?php
if ( !defined('IN_XSS_PLATFORM') ) {
    exit('Access Denied');
}
require_once('functions.php');

//时间戳的正则表达式
define('ID_REGEX', '/^[0-9]{10}$/');
//合法文件名的正则表达式
define('FILE_REGEX', '/(?!((^(con)$)|^(con)\..*|(^(prn)$)|^(prn)\..*|(^(aux)$)|^(aux)\..*|(^(nul)$)|^(nul)\..*|(^(com)[1-9]$)|^(com)[1-9]\..*|(^(lpt)[1-9]$)|^(lpt)[1-9]\..*)|^\s+|.*\s$)(^[^\/\\\:\*\?\"\<\>\|]{1,255}$)/');

//对记录的读写操作，无数据库，采用读写文件的方式，文件名即请求时的时间戳，同时也是记录的id
function save_xss_record( $info, $id ) {
    $xss_record_file = dirname(__FILE__) . '/' . DATA_PATH . '/' . $id . '.php';
    
    $info = encrypt( $info );
    
    if ( file_put_contents( $xss_record_file, '<?php exit();?>' . $info ) === false )
        return false;
    else
        return true;
}

//读取某一时间戳的xss记录
function load_xss_record( $id ) {
    if ( preg_match( ID_REGEX, $id ) ) {
        $xss_record_file = dirname(__FILE__) . '/' . DATA_PATH . '/' . $id . '.php';
        if ( !file_exists( $xss_record_file ) )
            return false;
        $info = @file_get_contents( $xss_record_file );
        if ( $info === false )
            return false;
        
        if ( strncmp( $info, '<?php exit();?>', 15 ) != 0 )
            return false;
        
        $info = substr( $info, 15 );
        $info = decrypt( $info );
        
        //只会出现在加密密码错误的时候
        if ( !preg_match( '/^[A-Za-z0-9\x00-\x80~!@#$%&_+-=:";\'<>,\/"\[\]\\\^\.\|\?\*\+\(\)\{\}\s]+$/', $info ) )
            return false;
        
        $info = json_decode( $info, true );
        
        //只会出现在加密密码错误的时候
        if ( $info === false )
            return false;
        
        $isChange = false;
        if ( !isset( $info['location'] ) ) {
            $info['location'] = convertIP( $info['user_IP'], IPDATA_PATH );
            $isChange         = true;
        }
        
        //只会出现在加密密码错误的时候
        if ( !isset( $info['request_time'] ) ) {
            return false;
        }
        
        if ( $isChange )
            save_xss_record( json_encode( $info ), $id );
        
        return $info;
    }
    else
        return false;
}

//删除某一时间戳的xss记录
function delete_xss_record( $id ) {
    if ( preg_match( ID_REGEX, $_GET['id'] ) ) {
        $xss_record_file = dirname(__FILE__) . '/' . DATA_PATH . '/' . $id . '.php';
        return unlink( $xss_record_file );
    }
    else
        return false;
}

//清空xss记录
function clear_xss_record() {
    $files = glob( DATA_PATH . '/*.php' );
    
    foreach ( $files as $file ) {
        unlink( $file );
    }
    return true;
}

//获取xss记录时间戳列表
function list_xss_record_id() {
    $files = glob( DATA_PATH . '/*.php' );
    $list  = array();
    foreach ( $files as $file ) {
        $filename = basename( $file, ".php" );
        if ( preg_match( ID_REGEX, $filename ) )
            $list[] = $filename;
    }
    return $list;
}

//获取所有xss记录
function list_xss_record_detail() {
    $list  = array();
    $files = glob( DATA_PATH . '/*.php' );
    arsort( $files );
    
    foreach ( $files as $file ) {
        $filename = basename( $file, ".php" );
        
        $info = load_xss_record( $filename );
        if ( $info === false )
            continue;
        
        $isChange = false;
        //如果没有设置location，就查询qqwry.dat判断location
        if ( !isset( $info['location'] ) ) {
            $info['location'] = convertIP( $info['user_IP'], IPDATA_PATH );
            $isChange         = true;
        }
        
        if ( $isChange )
            save_xss_record( json_encode( $info ), $filename );
        $list[] = $info;
    
    }
    return $list;
}

//读取名为$filename的js文件内容
function load_js_content( $path, $filename ) {
    if ( preg_match( FILE_REGEX, $filename ) ) {
        $file = dirname(__FILE__) . '/' . $path . '/' . $filename . '.js';
        if ( !file_exists( $file ) )
            return false;
        
        $info = @file_get_contents( $file );
        if ( $info === false )
            $info = "";
        return $info;
    }
    else
        return false;
}

//删除名为$filename的js
function delete_js( $path, $filename ) {
    if ( preg_match( FILE_REGEX, $filename ) ) {
        $file = dirname(__FILE__) . '/' . $path . '/' . $filename . '.desc';
        unlink( $file );
        $file = dirname(__FILE__) . '/' . $path . '/' . $filename . '.js';
        return unlink( $file );
    }
    else
        return false;
    
}

//清空js
function clear_js( $path ) {
    $files = glob( $path . '/*.desc' );
    foreach ( $files as $file ) {
        unlink( $file );
    }
    
    $files = glob( $path . '/*.js' );
    foreach ( $files as $file ) {
        unlink( $file );
    }
    return true;
}

//保存名为$filename的js文件内容
function save_js_content( $path, $content, $filename ) {
    if( preg_match( FILE_REGEX, $filename ) ) {
        $file = dirname(__FILE__) . '/' . $path . '/' . $filename . '.js';
        
        if ( file_put_contents( $file, $content ) === false )
            return false;
        else
            return true;
    }
    else
        return false;
}

//保存名为$filename的js文件描述
function save_js_desc( $path, $desc, $filename ) {
    if( preg_match( FILE_REGEX, $filename ) ) {
        $file = dirname(__FILE__) . '/' . $path . '/' . $filename . '.desc';
        
        $desc = encrypt( $desc );
        
        if ( file_put_contents($file, $desc) === false )
            return false;
        else
            return true;
    }
    else
        return false;

}

//获取js的名字与描述列表
function list_js_name_and_desc( $path ) {
    $list  = array();
    $files = glob( $path . '/*.js' );
    arsort( $files );
    
    foreach ( $files as $file ) {
        //由于可能有中文名，故使用正则来提取文件名
        $item           = array();
        $item['js_uri'] = $file;
        
        $filename             = preg_replace( '/^.+[\\\\\\/]/', '', $file );
        $filename             = substr( $filename, 0, strlen( $filename ) - 3 );
        $item['js_name']      = $filename;
        $item['js_name_abbr'] = htmlspecialchars($filename, ENT_QUOTES, 'UTF-8');
        
        $result = @file_get_contents( dirname(__FILE__) . '/' . $path . '/' . $filename . '.desc' );
        $result = $result ? $result : "";
        
        
        $result = decrypt( $result );
        
        if ( json_encode( $result ) === false )
            $result = "加密密码不符，无法获得描述";
        
        $item['js_description']      = $result;
        $item['js_description_abbr'] = htmlspecialchars($result, ENT_QUOTES, 'UTF-8');
        
        //特别注意：只有js_name_abbr，js_description_abbr经过htmlspecialchars处理
        $list[] = $item;
        
    }
    return $list;
}

//载入封禁的ip
function loadForbiddenIPList() {
    $forbidden_IP_list_file = DATA_PATH . '/forbiddenIPList.dat';
    !file_exists( $forbidden_IP_list_file ) && @touch( $forbidden_IP_list_file );
    $str = @file_get_contents( $forbidden_IP_list_file );
    if ( $str === false )
        return array();
    
    $str = decrypt($str);
    
    if ( $str != '' ) {
        $result = json_decode( $str, true );
        if ( $result != null )
            return $result;
        else
            return array();
    }
    else
        return array();
}

//保存封禁ip
function saveForbiddenIPList( $forbiddenIPList ) {
    $forbidden_IP_list_file = DATA_PATH . '/forbiddenIPList.dat';
    $str = json_encode( $forbiddenIPList );
    $str = encrypt( $str );
    @file_put_contents( $forbidden_IP_list_file, $str );
}