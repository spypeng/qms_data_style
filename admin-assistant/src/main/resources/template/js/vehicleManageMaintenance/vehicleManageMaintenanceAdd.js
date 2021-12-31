
// 车辆维修保养
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'fileUpload', 'tagEditor', 'laydate'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
	    	laydate = layui.laydate;

		skyeyeEnclosure.init('enclosureUpload');
	    AjaxPostUtil.request({url:reqBasePath + "login002", params:{}, type:'json', callback:function(json){
    		if(json.returnCode == 0) {
    			var userName = json.bean.userName;
    			$("#maintenanceTitle").html("车辆维修保养登记单-" + userName + "-" + (new Date()).getTime()) + Math.floor(Math.random()*100);
    		}else {
    			winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
    		}
	    }});
	    
	    // 车牌号
 		showGrid({
		 	id: "licensePlate",
		 	url: reqBasePath + "vehicle010",
		 	params: {},
		 	pagination: false,
		 	template: getFileContent('tpl/template/select-option-must.tpl'),
		 	ajaxSendLoadBefore: function(hdb){
		 	},
		 	ajaxSendAfter:function(json){
		 		form.render('select');
		 	}
		});
	    
 		// 维修保养时间段选择
		laydate.render({
			elem: '#maintenanceTime',
			type: 'date',
			range: true,
			trigger: 'click'
		});
 		
		matchingLanguage();
 		form.render();
 	    form.on('submit(formAddBean)', function (data) {
 	        if (winui.verifyForm(data.elem)) {
 	        	var params = {
 	        		maintenanceTitle: $("#maintenanceTitle").html(),
 	        		maintenanceCompany: $("#maintenanceCompany").val(),
 	        		maintenancePrice: $("#maintenancePrice").val(),
 	        		startTime: $("#maintenanceTime").val().split(" - ")[0],
 	        		endTime: $("#maintenanceTime").val().split(" - ")[1],
 	        		concreteContent: $("#concreteContent").val(),
 	        		roomAddDesc: $("#roomAddDesc").val(),
					vehicleId: $("#licensePlate").val(),
 	        		maintenanceType: $("input[name='maintenanceType']:checked").val(),
					enclosureInfo: skyeyeEnclosure.getEnclosureIdsByBoxId('enclosureUpload')
 	        	};
 	        	AjaxPostUtil.request({url:reqBasePath + "maintenance002", params:params, type:'json', callback:function(json){
	 	   			if(json.returnCode == 0){
		 	   			parent.layer.close(index);
		 	        	parent.refreshCode = '0';
	 	   			}else{
	 	   				winui.window.msg(json.returnMessage, {icon: 2,time: 2000});
	 	   			}
	 	   		}});
 	        }
 	        return false;
 	    });
 	    
	    $("body").on("click", ".enclosureItem", function(){
	    	download(fileBasePath + $(this).attr("rowpath"), $(this).html());
	    });
 	    
	    $("body").on("click", "#cancle", function(){
	    	parent.layer.close(index);
	    });
	});
});