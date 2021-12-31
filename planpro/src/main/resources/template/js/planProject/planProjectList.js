
var rowId = "";
var projectName = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		table = layui.table;
	
	authBtn('1561899197930');

	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: reqBasePath + 'planproject001',
	    where: getTableParams(),
	    even: true,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
	        { field:'projectName', width:300, title: '项目名称'},
            { field:'id', width:100, title: '项目简介', templet: function(d){
	        	return '<i class="fa fa-fw fa-html5 cursor" lay-event="projectDesc"></i>';
	        }},
	        { field:'id', width:100, title: '是否共享', templet: function(d){
	        	if(d.isShare == '1'){
	        		return '私人';
	        	}else if(d.isShare == '2'){
	        		return '公开分享';
	        	}
	        }},
	        { field:'childsTypeOneNum', width: 120, title: '目录数量'},
	        { field:'childsTypeTwoNum', width: 120, title: '流程图数量'},
	        { field: 'createTime', title: '创建时间', width: 180 },
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 240, toolbar: '#tableBar'}
	    ]],
	    done: function(){
	    	matchingLanguage();
	    }
	});
	
	table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'del') { //删除
        	del(data, obj);
        }else if (layEvent === 'edit') { //编辑
        	edit(data);
        }else if (layEvent === 'flowChart') { //流程图设计
        	flowChart(data);
        }else if (layEvent === 'projectDesc') { //项目简介
        	layer.open({
	            id: '项目简介',
	            type: 1,
	            title: '项目简介',
	            shade: 0.3,
	            area: ['1200px', '600px'],
	            content: data.projectDesc,
	        });
        }
    });
	
	// 删除
	function del(data, obj){
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index){
			layer.close(index);
            AjaxPostUtil.request({url: reqBasePath + "planproject003", params: {rowId: data.id}, type: 'json', method: "DELETE", callback: function(json){
    			if(json.returnCode == 0){
    				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
    				loadTable();
    			}else{
    				winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
    			}
    		}});
		});
	}
	
	// 编辑
	function edit(data){
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/planProject/planProjectEdit.html",
			title: systemLanguage["com.skyeye.editPageTitle"][languageType],
			pageId: "planProjectEdit",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
                if (refreshCode == '0') {
                	winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                	loadTable();
                } else if (refreshCode == '-9999') {
                	winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
			}});
	}
	
	// 流程图设计
	function flowChart(data){
		rowId = data.id;
		projectName = data.projectName;
		_openNewWindows({
			url: "../../tpl/flowChart/makeFlowChart.html",
			title: "流程图设计",
			pageId: "makeFlowChart",
			area: ['100vw', '100vh'],
			callBack: function(refreshCode){
                if (refreshCode == '0') {
                	winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                	loadTable();
                } else if (refreshCode == '-9999') {
                	winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
			}});
	}
	
    // 新增
    $("body").on("click", "#addBean", function(){
    	_openNewWindows({
			url: "../../tpl/planProject/planProjectAdd.html",
			title: systemLanguage["com.skyeye.addPageTitle"][languageType],
			pageId: "planProjectAdd",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
                if (refreshCode == '0') {
                	winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                	loadTable();
                } else if (refreshCode == '-9999') {
                	winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
			}});
    });

	form.render();
	form.on('submit(formSearch)', function (data) {
		if (winui.verifyForm(data.elem)) {
			refreshTable();
		}
		return false;
	});

	// 刷新数据
	$("body").on("click", "#reloadTable", function(){
		loadTable();
	});

    function loadTable(){
    	table.reload("messageTable", {where: getTableParams()});
    }
    
    function refreshTable(){
    	table.reload("messageTable", {page: {curr: 1}, where: getTableParams()});
    }

    function getTableParams(){
    	return {
			projectName: $("#projectName").val()
		};
	}
    
    exports('planProjectList', {});
});