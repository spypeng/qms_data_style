var rowId = "";
var searchType = "";

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
	var selectOption = getFileContent('tpl/template/select-option.tpl');
	
	authBtn('1570454924611');
	
	// 分类
	showGrid({
	 	id: "typeId",
	 	url: reqBasePath + "customertype008",
	 	params: {},
	 	pagination: false,
	 	template: selectOption,
	 	ajaxSendLoadBefore: function(hdb){
	 	},
	 	ajaxSendAfter:function(j){
	 		form.render('select');
	 		customerFrom();
	 	}
	});
	
	// 来源
	function customerFrom(){
		showGrid({
		 	id: "fromId",
		 	url: reqBasePath + "crmcustomerfrom008",
		 	params: {},
		 	pagination: false,
		 	template: selectOption,
		 	ajaxSendLoadBefore: function(hdb){
		 	},
		 	ajaxSendAfter:function(j){
		 		form.render('select');
		 		customerIndustry();
		 	}
		});
	}
	
	// 行业
	function customerIndustry(){
		showGrid({
		 	id: "industryId",
		 	url: reqBasePath + "crmcustomerindustry008",
		 	params: {},
		 	pagination: false,
		 	template: selectOption,
		 	ajaxSendLoadBefore: function(hdb){
		 	},
		 	ajaxSendAfter:function(j){
		 		form.render('select');
		 	}
		});
	}
	
	// 表格渲染
	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: reqBasePath + 'customer001',
	    where: getTableParams(),
	    even: true,
	    page: true,
	    limits: getLimits(),
	    limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
	        { field: 'name', title: '客户名称', align: 'left', width: 300, templet: function(d){
	        	return '<a lay-event="details" class="notice-title-click">' + d.name + '</a>';
	        }},
	        { field: 'typeName', title: '客户分类', align: 'left', width: 120 },
	        { field: 'fromName', title: '客户来源', align: 'left', width: 120 },
	        { field: 'industryName', title: '所属行业', align: 'left', width: 180 },
	        { field: 'createName', title: '创建人', align: 'left', width: 80 },
	        { field: 'createTime', title: '创建时间', align: 'center', width: 100 },
	        { field: 'lastUpdateName', title: '最后修改人', align: 'left', width: 100 },
	        { field: 'lastUpdateTime', title: '最后修改时间', align: 'center', width: 100},
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 150, toolbar: '#tableBar'}
	    ]],
	    done: function(){
	    	matchingLanguage();
	    }
	});
	
	table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') { // 编辑
        	edit(data);
        }else if (layEvent === 'delete'){ // 删除
        	del(data);
        }else if (layEvent === 'details'){ // 详情
        	details(data);
        }
    });
	
	form.render();
	
	// 新增
	$("body").on("click", "#addBean", function(){
    	_openNewWindows({
			url: "../../tpl/customermanage/customeradd.html", 
			title: "新增客户",
			pageId: "customeradd",
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
	
	// 编辑
	function edit(data){
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/customermanage/customeredit.html", 
			title: "编辑客户",
			pageId: "customeredit",
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
	
	// 详情
	function details(data){
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/customermanage/customerdetails.html", 
			title: "客户详情",
			pageId: "customerdetails",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
			}});
	}
	
	// 删除
	function del(data, obj){
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index){
			layer.close(index);
            AjaxPostUtil.request({url: reqBasePath + "customer006", params: {rowId: data.id}, type: 'json', callback: function(json){
    			if(json.returnCode == 0){
    				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1,time: 2000});
    				loadTable();
    			}else{
    				winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
    			}
    		}});
		});
	}
	
	// 搜索表单
	$("body").on("click", "#formSearch", function(){
		refreshTable();
	});
	
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
    		name: $("#customerName").val(),
    		typeId: $("#typeId").val(),
    		fromId: $("#fromId").val(),
    		industryId: $("#industryId").val()
    	};
    }
	
    exports('customerlist', {});
});