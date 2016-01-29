var unreadNum=0;
var oldTitle=document.title;
document.documentElement.style.overflow="hidden";

function readNotification(){
	unreadNum=0;
	if(document.title)
		document.title=oldTitle;
	$(this).parent().fadeOut(200);
	
	$("#xss_panel_tab").tab('show');
	//重新载入数据
	$('#panelGrid').jqxGrid('updatebounddata');
	
}

function showNotification(newUnreadNum,lastedID,interval){
	unreadNum+=newUnreadNum;
	$.ajax({
		url: urlbase+"?cmd=get&id="+lastedID,
		dataType: "json",
		timeout : interval,	
		success: function(data)
		{
			
			if(document.title)
				document.title='【收到'+unreadNum+"封消息】"+oldTitle;

			var notificationHTML='<div id="webpushtipcontainer" class="webpushtipoutter" ><div class="webpushtipinner"><div id="webpushtip1" style="visibility: visible; bottom: 0px;" class="newmailNotifyItem notify_mail"><div class="newmailNotify" id="newNotification"><a nocheck="true" id="webpushtip1close" class="notify_close"title="关闭"></a><div class="notify_type"><span></span><label><em id="unreadNum">1</em></label></div><div class="notify_content"><p class="notify_location">未知</p><p class="notify_title">0.0.0.0</p><p class="notify_digest">GET:0个 POST:0个 Cookie:0个</p></div></div></div></div></div>';
			$("#webpushtipcontainer").remove();
			$("#notifications-bottom-right").append(notificationHTML);
			$("#webpushtipcontainer").addClass('animated bounceInUp');
			$('#webpushtip1close').click(function(event){$(this).parent().parent().fadeOut(200);event.stopPropagation();});
			$("#newNotification").click(readNotification);
			
			$('#unreadNum').text(unreadNum);
			$('.notify_location').text(data.location);
			$('.notify_title').text(data.user_IP);
			$('.notify_digest').text("GET:"+Object.keys(data.get_data).length+"个 POST:"+Object.keys(data.post_data).length+"个 Cookie:"+Object.keys(data.cookie_data).length+"个");
			$("#notifications-bottom-right").addClass('animated bounceInUp');
		
		},
		complete : function(XMLHttpRequest,status){
			if(status=='timeout'){
				var notificationHTML='<div id="webpushtipcontainer" class="webpushtipoutter" ><div class="webpushtipinner"><div id="webpushtip1" style="visibility: visible; bottom: 0px;" class="newmailNotifyItem notify_mail"><div class="newmailNotify" id="newNotification"><a nocheck="true" id="webpushtip1close" class="notify_close"title="关闭"></a><div class="notify_type"><span></span><label><em id="unreadNum">1</em></label></div><div class="notify_content"><p class="notify_location">未知来源</p><p class="notify_title">网络错误</p><p class="notify_digest">请检查网络连接</p></div></div></div></div></div>';
				$("#webpushtipcontainer").remove();
				$("#notifications-bottom-right").append(notificationHTML);
				$("#webpushtipcontainer").addClass('animated bounceInUp');
				$('#webpushtip1close').click(function(event){$(this).parent().parent().fadeOut(200);event.stopPropagation();});
				$("#newNotification").click(readNotification);
				
				$('#unreadNum').text(unreadNum);
				$("#notifications-bottom-right").addClass('animated bounceInUp');
			}
		}
	});	
}
