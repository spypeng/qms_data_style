var rowId = "";
var startTime = "";
var endTime = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
	winui.renderColor();
	
	var $ = layui.$,
		form = layui.form,
		laydate = layui.laydate,
		table = layui.table;
	
	authBtn('1572595572098');
	
	//分类
	showGrid({
	 	id: "typeId",
	 	url: reqBasePath + "crmdocumentarytype008",
	 	params: {},
	 	pagination: false,
	 	template: getFileContent('tpl/template/select-option.tpl'),
	 	ajaxSendLoadBefore: function(hdb){
	 	},
	 	ajaxSendAfter:function(j){
	 		form.render('select');
	 	}
	});
	
	//跟单时间
	laydate.render({
		elem: '#documentaryTime',
		range: '~'
	});
	
	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: reqBasePath + 'documentary001',
	    where: {opportunityName: $("#opportunityName").val(), typeId: $("#typeId").val(), startTime: startTime, endTime: endTime},
	    even: true,
	    page: true,
	    limits: [8, 16, 24, 32, 40, 48, 56],
	    limit: 8,
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
	        { field: 'opportunityName', title: '商机', align: 'left', width: 300, templet: function(d){
	        	return '<a lay-event="details" class="notice-title-click">' + d.opportunityName + '</a>';
	        }},
	        { field: 'typeName', title: '类型', align: 'center', width: 120 },
	        { field: 'documentaryTime', title: '跟单时间', align: 'center', width: 150 },
	        { field: 'createName', title: '跟单人', align: 'center', width: 120 },
	        { field: 'detail', title: '详细内容', align: 'center', width: 220 },
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 200, toolbar: '#tableBar'}
	    ]],
	    done: function(){
	    	matchingLanguage();
	    }
	});
	
	table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') { //编辑
        	edit(data);
        }else if (layEvent === 'delete'){ //删除
        	del(data);
        }else if (layEvent === 'details'){ //详情
        	details(data);
        }
    });
	
	form.render();
	
	
	$("body").on("click", "#formSearch", function(){
		refreshTable();
	});
	
	$("body").on("click", "#reloadTable", function(){
    	loadTable();
    });
    
    function loadTable(){
    	if(isNull($("#documentaryTime").val())){
    		startTime = "";
    		endTime = "";
    	}else{
    		startTime = $("#documentaryTime").val().split('~')[0].trim();
    		endTime = $("#documentaryTime").val().split('~')[1].trim();
    	}
    	table.reload("messageTable", {where: {opportunityName: $("#opportunityName").val(), typeId: $("#typeId").val(), startTime:startTime, endTime:endTime}});
    }
    
    function refreshTable(){
    	if(isNull($("#documentaryTime").val())){
    		startTime = "";
    		endTime = "";
    	}else{
    		startTime = $("#documentaryTime").val().split('~')[0].trim();
    		endTime = $("#documentaryTime").val().split('~')[1].trim();
    	}
    	table.reload("messageTable", {page: {curr: 1}, where: {opportunityName: $("#opportunityName").val(), typeId: $("#typeId").val(), startTime:startTime, endTime:endTime}});
    }

	//新增
	$("body").on("click", "#addBean", function(){
    	_openNewWindows({
			url: "../../tpl/documentarymanage/documentaryadd.html", 
			title: "新增跟单",
			pageId: "documentaryadd",
			area: ['70vw', '70vh'],
			callBack: function(refreshCode){
                if (refreshCode == '0') {
                	winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                	loadTable();
                } else if (refreshCode == '-9999') {
                	winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
			}});
    });
	
	//编辑
	function edit(data){
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/documentarymanage/documentaryedit.html", 
			title: "编辑跟单",
			pageId: "documentaryedit",
			area: ['70vw', '70vh'],
			callBack: function(refreshCode){
                if (refreshCode == '0') {
                	winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                	loadTable();
                } else if (refreshCode == '-9999') {
                	winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
			}});
	}
	
	//详情
	function details(data){
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/documentarymanage/documentarydetails.html", 
			title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
			pageId: "documentarydetails",
			area: ['70vw', '70vh'],
			callBack: function(refreshCode){
			}});
	}
	
	//删除
	function del(data, obj){
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index){
			layer.close(index);
            AjaxPostUtil.request({url: reqBasePath + "documentary006", params: {rowId: data.id}, type: 'json', callback: function(json){
    			if(json.returnCode == 0){
    				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1,time: 2000});
    				loadTable();
    			}else{
    				winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
    			}
    		}});
		});
	}
	
    exports('mydocumentarylist', {});
});