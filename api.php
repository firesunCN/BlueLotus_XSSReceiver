<?php
error_reporting(0);
define('IN_XSS_PLATFORM', true);
require_once('auth.php');
require_once('dio.php');
header('Content-Type: application/json');

$referer_array = parse_url($_SERVER['HTTP_REFERER']); 
//CSRF防御
if($referer_array['host'] != $_SERVER['HTTP_HOST']) { 
    exit('Access Denied'); 
} 


//与xss记录相关api
if ( isset( $_GET['cmd'] ) ) {
    switch ( $_GET['cmd'] ) {
        //获取所有记录包括详细信息
        case 'list':
            echo json_encode( list_xss_record_detail() );
            break;
        
        //只获取时间戳（索引id）
        case 'id_list':
            echo json_encode( list_xss_record_id() );
            break;
        
        //根据时间戳（索引id）获得单条信息
        case 'get':
            if ( isset( $_GET['id'] ) )
                echo json_encode( load_xss_record( $_GET['id'] ) );
            else
                echo json_encode( false );
            break;
        
        //根据时间戳（索引id）删除单条信息
        case 'del':
            if ( isset( $_GET['id'] ) )
                echo json_encode( delete_xss_record( $_GET['id'] ) );
            else
                echo json_encode( false );
            break;
        
        //清空记录
        case 'clear':
            echo json_encode( clear_xss_record() );
            break;
        
        default:
            echo json_encode( false );
    }
}
//与js模板相关api
else if ( isset( $_GET['js_template_cmd'] ) ) {
    switch ( $_GET['js_template_cmd'] ) {
        //获取所有js模板的名字与描述
        case 'list':
            echo json_encode( list_js_name_and_desc( JS_TEMPLATE_PATH ) );
            break;

        //添加js模板
        case 'add':
            if ( isset( $_POST['name'] ) && isset( $_POST['desc'] ) && isset( $_POST['content'] ) ) {
                if (get_magic_quotes_gpc()) {
                    $_POST['name'] = stripslashes($_POST['name']);
                    $_POST['desc'] = stripslashes($_POST['desc']);
                    $_POST['content'] = stripslashes($_POST['content']);
                }
                $result = save_js_desc( JS_TEMPLATE_PATH, $_POST['desc'], $_POST['name'] ) 
                && save_js_content( JS_TEMPLATE_PATH, $_POST['content'], $_POST['name'] );
                echo json_encode( $result );
            }
            else
                echo json_encode( false );
            
            break;
        
        //修改js模板
        case 'modify':
            if ( isset( $_POST['old_name'] ) && isset( $_POST['name'] ) && isset( $_POST['desc'] ) && isset( $_POST['content'] ) ) {
                if (get_magic_quotes_gpc()) {
                    $_POST['old_name'] = stripslashes($_POST['old_name']);
                    $_POST['name'] = stripslashes($_POST['name']);
                    $_POST['desc'] = stripslashes($_POST['desc']);
                    $_POST['content'] = stripslashes($_POST['content']);
                }
                $result = true;
                if ( $_POST['old_name'] != $_POST['name'] )
                    $result = delete_js( JS_TEMPLATE_PATH, $_POST['old_name'] );
                
                if( $result ) {
                    $result = save_js_desc( JS_TEMPLATE_PATH, $_POST['desc'], $_POST['name'] )
                    && save_js_content( JS_TEMPLATE_PATH, $_POST['content'], $_POST['name'] );
                }
                echo json_encode( $result );    
                
            }
            else
                echo json_encode( false );
            
            break;
        
        //获取某一js模板的内容
        case 'get':
            if ( isset( $_GET['name'] ) ) {
                if (get_magic_quotes_gpc())
                    $_POST['name'] = stripslashes($_POST['name']);
                echo json_encode( load_js_content( JS_TEMPLATE_PATH, $_GET['name'] ) );
            }
            else
                echo json_encode( false );
            break;
        
        //删除js模板
        case 'del':
            if ( isset( $_GET['name'] ) ) {
                if (get_magic_quotes_gpc())
                    $_POST['name'] = stripslashes($_POST['name']);
                echo json_encode( delete_js( JS_TEMPLATE_PATH, $_GET['name'] ) );
            } 
            else
                echo json_encode( false );
            break;
        
        //清空js模板
        case 'clear':
            echo json_encode( clear_js( JS_TEMPLATE_PATH ) );
            break;
        
        default:
            echo json_encode( false );
    }
}
//与我的js相关api
else if ( isset( $_GET['my_js_cmd'] ) ) {
    switch ( $_GET['my_js_cmd'] ) {
        //获取所有我的js的名字与描述
        case 'list':
            echo json_encode( list_js_name_and_desc( MY_JS_PATH ) );
            break;
        
        //添加js模板
        case 'add':
            if ( isset( $_POST['name'] ) && isset( $_POST['desc'] ) && isset( $_POST['content'] ) ) {
                if (get_magic_quotes_gpc()) {
                    $_POST['name'] = stripslashes($_POST['name']);
                    $_POST['desc'] = stripslashes($_POST['desc']);
                    $_POST['content'] = stripslashes($_POST['content']);
                }
                $result = save_js_desc( MY_JS_PATH, $_POST['desc'], $_POST['name'] )
                && save_js_content( MY_JS_PATH, $_POST['content'], $_POST['name'] );
                echo json_encode( $result );
            }
            else
                echo json_encode( false );
            
            break;
        
        //修改js模板
        case 'modify':
            if ( isset( $_POST['old_name'] ) && isset( $_POST['name'] ) && isset( $_POST['desc'] ) && isset( $_POST['content'] ) ) {
                if (get_magic_quotes_gpc()) {
                    $_POST['old_name'] = stripslashes($_POST['old_name']);
                    $_POST['name'] = stripslashes($_POST['name']);
                    $_POST['desc'] = stripslashes($_POST['desc']);
                    $_POST['content'] = stripslashes($_POST['content']);
                }
                $result = true;
                if ( $_POST['old_name'] != $_POST['name'] )
                    $result = delete_js( MY_JS_PATH, $_POST['old_name'] );
                if( $result ) {    
                    $result = save_js_desc( MY_JS_PATH, $_POST['desc'], $_POST['name'] )
                    && save_js_content( MY_JS_PATH, $_POST['content'], $_POST['name'] );
                }
                echo json_encode( $result );
            }
            else
                echo json_encode( false );
            
            break;
        
        //获取某一js模板的内容
        case 'get':
            if ( isset( $_GET['name'] ) ) {
                if (get_magic_quotes_gpc())
                    $_POST['name'] = stripslashes($_POST['name']);
                echo json_encode( load_js_content( MY_JS_PATH, $_GET['name'] ) );
            }
            else
                echo json_encode( false );
            break;
        
        //删除js模板
        case 'del':
            if ( isset( $_GET['name'] ) ) {
                if (get_magic_quotes_gpc())
                    $_POST['name'] = stripslashes($_POST['name']);
                echo json_encode( delete_js( MY_JS_PATH, $_GET['name'] ) );
            }
            else
                echo json_encode( false );
            break;
        
        //清空js模板
        case 'clear':
            echo json_encode( clear_js( MY_JS_PATH ) );
            break;
        
        default:
            echo json_encode( false );
    }
}
else
    echo json_encode( false );
