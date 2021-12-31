var enclosureList = new Array();//附件

layui.config({
	base: basePath,
	version: skyeyeVersion
}).extend({
	window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function(exports) {
	winui.renderColor();
	layui.use(['form'], function(form) {
		var index = parent.layer.getFrameIndex(window.name);
		var $ = layui.$;
		
		AjaxPostUtil.request({url: reqBasePath + "feedback002", params: {serviceId: parent.serviceId}, type: 'json', callback: function(json) {
			if(json.returnCode == 0) {
				$("#orderNum").html(json.bean.orderNum);
				$("#customerName").html(json.bean.customerName);
				$("#productName").html(json.bean.productName);
				
		 		//获取反馈信息
		 		AjaxPostUtil.request({url: reqBasePath + "feedback007", params: {rowId: parent.rowId}, type: 'json', callback: function(j) {
					if(j.returnCode == 0) {
						$("#createName").html(j.bean.createName);
						$("#typeName").html(j.bean.typeName);
						$("#content").html(j.bean.content);
						//附件回显
					    if(j.bean.enclosureInfo.length != 0 && j.bean.enclosureInfo != ""){
					    	enclosureList = j.bean.enclosureInfo;
					    	var str = "";
			    			$.each([].concat(enclosureList), function(i, item){
			    				str += '<a rowid="' + item.id + '" class="enclosureItem" rowpath="' + item.fileAddress + '" href="javascript:;" style="color:blue;">' + item.name + '</a><br>';
			    			});
			    			$("#enclosureUploadBox").html(str);
			        	}
					} else {
						winui.window.msg(j.returnMessage, {icon: 2, time: 2000});
					}
				}});
				matchingLanguage();
			} else {
				winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
			}
		}});
		
	});
});