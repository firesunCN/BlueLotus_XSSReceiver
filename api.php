<?php
define("IN_XSS_PLATFORM",true);
require('auth.php');
require_once("functions.php");
require_once("config.php");
require_once("dio.php");
header('Content-Type: application/json');

//时间戳的正则表达式
define('ID_REGEX', '/^[0-9]{10}$/');
//合法文件名的正则表达式
define('FILE_REGEX', '/(?!((^(con)$)|^(con)\..*|(^(prn)$)|^(prn)\..*|(^(aux)$)|^(aux)\..*|(^(nul)$)|^(nul)\..*|(^(com)[1-9]$)|^(com)[1-9]\..*|(^(lpt)[1-9]$)|^(lpt)[1-9]\..*)|^\s+|.*\s$)(^[^\/\\\:\*\?\"\<\>\|]{1,255}$)/');


//与xss记录相关api
if(isset($_GET['cmd']))
{
	switch($_GET['cmd'])
	{
		//获取所有记录包括详细信息
		case 'list':
			echo json_encode(xss_record_detail_list());
			break;
		
		//只获取时间戳（索引id）
		case 'id_list':
			echo json_encode(xss_record_id_list());
			break;
		
		//根据时间戳（索引id）获得单条信息
		case 'get':
			if(isset($_GET['id'])&&preg_match(ID_REGEX,$_GET['id']))
				echo json_encode(load_xss_record($_GET['id']));	
			else
				echo json_encode(false);
			break;
			
		//根据时间戳（索引id）删除单条信息
		case 'del':
			if(isset($_GET['id'])&&preg_match(ID_REGEX,$_GET['id']))
				echo json_encode(delete_xss_record($_GET['id']));	
			else
				echo json_encode(false);
			break;
		
		//清空记录
		case 'clear':
			echo json_encode(clear_xss_record());	
			break;	
			
		default:
			echo json_encode(false);
	}
}
//与js模板相关api
else if(isset($_GET['js_template_cmd']))
{
	switch($_GET['js_template_cmd'])
	{
		//获取所有js模板的名字与描述
		case 'list':
			echo json_encode(js_name_and_desc_list(JS_TEMPLATE_PATH));
			break;
		
		//添加js模板
		case 'add':
			if(isset($_POST['name'])&&isset($_POST['desc'])&&isset($_POST['content'])&&preg_match(FILE_REGEX,$_POST['name']))
			{
				if(!is_writable(JS_TEMPLATE_PATH))
					echo json_encode(false);
				else
				{
					save_js_desc(JS_TEMPLATE_PATH,$_POST['desc'],$_POST['name']);
					save_js_content(JS_TEMPLATE_PATH,$_POST['content'],$_POST['name']);
					echo json_encode(true);	
				}				
			}	
			else
				echo json_encode(false);
		
			break;
		
		//修改js模板
		case 'modify':
			if(isset($_POST['old_name'])&&isset($_POST['name'])&&isset($_POST['desc'])&&isset($_POST['content'])&&preg_match(FILE_REGEX,$_POST['old_name'])&&preg_match(FILE_REGEX,$_POST['name']))
			{
				if(!is_writable(JS_TEMPLATE_PATH))
					echo json_encode(false);
				else
				{
					if($_POST['old_name']!=$_POST['name'])
						delete_js(JS_TEMPLATE_PATH,$_POST['old_name']);
					
					save_js_desc(JS_TEMPLATE_PATH,$_POST['desc'],$_POST['name']);
					save_js_content(JS_TEMPLATE_PATH,$_POST['content'],$_POST['name']);
					echo json_encode(true);	
				}				
			}	
			else
				echo json_encode(false);
		
			break;
			
		//获取某一js模板的内容	
		case 'get':
			if(isset($_GET['name'])&&preg_match(FILE_REGEX,$_GET['name']))
				echo json_encode(load_js_content(JS_TEMPLATE_PATH,$_GET['name']));	
			else
				echo json_encode(false);
			break;
			
		//删除js模板
		case 'del':
			if(isset($_GET['name'])&&preg_match(FILE_REGEX,$_GET['name']))
				echo json_encode(delete_js(JS_TEMPLATE_PATH,$_GET['name']));	
			else
				echo json_encode(false);
			break;
		
		//清空js模板
		case 'clear':
			echo json_encode(clear_js(JS_TEMPLATE_PATH));	
			break;
	
		default:
			echo json_encode(false);
	}
}
//与我的js相关api
else if(isset($_GET['my_js_cmd']))
{
	switch($_GET['my_js_cmd'])
	{
		//获取所有我的js的名字与描述
		case 'list':
			echo json_encode(js_name_and_desc_list(MY_JS_PATH));
			break;
			
		//添加js模板
		case 'add':
			if(isset($_POST['name'])&&isset($_POST['desc'])&&isset($_POST['content'])&&preg_match(FILE_REGEX,$_POST['name']))
			{
				if(!is_writable(MY_JS_PATH))
					echo json_encode(false);
				else
				{
					save_js_desc(MY_JS_PATH,$_POST['desc'],$_POST['name']);
					save_js_content(MY_JS_PATH,$_POST['content'],$_POST['name']);
					echo json_encode(true);	
				}
					
			}	
			else
				echo json_encode(false);
		
			break;
		
		//修改js模板
		case 'modify':
			if(isset($_POST['old_name'])&&isset($_POST['name'])&&isset($_POST['desc'])&&isset($_POST['content'])&&preg_match(FILE_REGEX,$_POST['old_name'])&&preg_match(FILE_REGEX,$_POST['name']))
			{
				if(!is_writable(MY_JS_PATH))
					echo json_encode(false);
				else
				{
					if($_POST['old_name']!=$_POST['name'])
						delete_js(MY_JS_PATH,$_POST['old_name']);
					
					save_js_desc(MY_JS_PATH,$_POST['desc'],$_POST['name']);
					save_js_content(MY_JS_PATH,$_POST['content'],$_POST['name']);
					echo json_encode(true);	
				}				
			}	
			else
				echo json_encode(false);
		
			break;
			
		//获取某一js模板的内容	
		case 'get':
			if(isset($_GET['name'])&&preg_match(FILE_REGEX,$_GET['name']))
				echo json_encode(load_js_content(MY_JS_PATH,$_GET['name']));	
			else
				echo json_encode(false);
			break;
			
		//删除js模板
		case 'del':
			if(isset($_GET['name'])&&preg_match(FILE_REGEX,$_GET['name']))
				echo json_encode(delete_js(MY_JS_PATH,$_GET['name']));	
			else
				echo json_encode(false);
			break;
		
		//清空js模板
		case 'clear':
			echo json_encode(clear_js(MY_JS_PATH));	
			break;
			
		default:
			echo json_encode(false);
	}
}
else
	echo json_encode(false);


function xss_record_id_list() { 
	$files = glob(DATA_PATH . '/*.php'); 
	$list=array();
	foreach ($files as $file){
		$filename=basename($file,".php");
		if( preg_match(ID_REGEX, $filename) )
			$list[]=$filename;
	}
	return $list;
}

function xss_record_detail_list() { 
	$list=array();
	$files = glob(DATA_PATH . '/*.php'); 
	arsort($files);
	
	foreach ($files as $file) { 
		$filename=basename($file,".php");
		if( preg_match(ID_REGEX, $filename) )
		{
			$info=load_xss_record($filename);
			if($info===false)
				continue;
			
			$isChange=false;
			//如果没有设置location，就查询qqwry.dat判断location
			if(!isset($info['location']))
			{
				$info['location']=stripStr( convertip($info['user_IP'],IPDATA_PATH) );
				$isChange=true;
			}
			
			if($isChange)
				save_xss_record(json_encode($info),$filename);
			$list[]= $info;	
		}
	} 		
	return $list; 
}

//获取js的名字与描述列表
function js_name_and_desc_list($path)
{
	$list=array();
	$files = glob($path . '/*.js'); 
	arsort($files);

	foreach ($files as $file){
		//由于可能有中文名，故使用正则来提取文件名
		$item=array();
		$item['js_uri']=$file;
		
		$filename=preg_replace('/^.+[\\\\\\/]/', '', $file);
		$filename=substr ( $filename , 0 , strlen ($filename)-3 );
		$item['js_name']=$filename;
		$item['js_name_abbr']=stripStr($filename);
		
		$result=@file_get_contents(dirname( __FILE__ ).'/'.$path.'/'.$filename.'.desc');
		$result=$result?$result:"";
		
			
		$result=decrypt($result);
		
		if(json_encode($result)===false)
			$result="加密密码不符，无法获得描述";
		
		$item['js_description']=$result;
		$item['js_description_abbr']=stripStr($result);	
		
		//特别注意：只有js_name_abbr，js_description_abbr经过stripStr处理
		$list[]= $item;
		
	}
	
	return $list; 
}
?>