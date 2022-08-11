
var rowId = "";

var menuId = '';

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'fsCommon', 'fsTree'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		fsTree = layui.fsTree,
		fsCommon = layui.fsCommon,
		table = layui.table;
	var parentId = "";
	
	authBtn('1552958167410');
	
	showGrid({
	 	id: "menuLevel",
	 	url: reqBasePath + "sys021",
	 	params: {},
	 	pagination: false,
	 	template: getFileContent('tpl/template/select-option.tpl'),
	 	ajaxSendLoadBefore: function(hdb){
	 	},
	 	ajaxSendAfter:function (json) {
	 		form.render('select');
	 	}
	});
	
	// 桌面信息
	systemCommonUtil.getSysDesttop(function (json) {
		$("#desktop").html(getDataUseHandlebars(getFileContent('tpl/template/select-option.tpl'), json));
		form.render('select');
	});

	function initLoadTable(){
		table.render({
		    id: 'messageTable',
		    elem: '#messageTable',
		    method: 'post',
		    url: reqBasePath + 'sys006',
		    where: getTableParams(),
		    even:true,
		    page: true,
		    limits: getLimits(),
	    	limit: getLimit(),
		    cols: [[
		        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
		        { field: 'menuName', title: '菜单名称', width: 120, templet: function (d) {
		        	return '<a lay-event="details" class="notice-title-click">' + d.menuName + '</a>';
		        }},
		        { field: 'menuNameEn', title: '英文名称', width: 150},
		        { field: 'id', title: '图标', align: 'center', width: 60, templet: function (d) {
		        	var str = '';
		        	if(d.menuIconType == '1'){
			        	if(isNull(d.menuIconBg)){
			        		str += '<div class="winui-icon winui-icon-font" style="text-align: center;">';
			        	} else {
			        		str += '<div class="winui-icon winui-icon-font" style="text-align: center; background-color:' + d.menuIconBg + '">';
			        	}
			        	if(isNull(d.menuIconColor)){
			        		str += '<i class="fa fa-fw ' + d.menuIcon + '" style="color: white"></i>';
			        	} else {
			        		str += '<i class="fa fa-fw ' + d.menuIcon + '" style="color: ' + d.menuIconColor + '"></i>';
			        	}
			        	str += '</div>';
		        	}else if(d.menuIconType = '2'){
		        		str = '<img src="' + fileBasePath + d.menuIconPic + '" class="photo-img" lay-event="menuIconPic">';
		        	}
		        	return str;
		        }},
		        { field: 'menuLevel', title: '菜单级别', width: 140, templet: function (d) {
		        	if(d.parentId == '0'){
		        		return "创世菜单";
		        	} else {
		        		return "子菜单-->" + d.menuLevel + "级子菜单";
		        	}
		        }},
		        { field: 'desktopName', title: '所属桌面', width: 140},
		        { field: 'isShare', title: '共享', align: 'center', width: 80, templet: function (d) {
		        	if(d.isShare == 0){
		        		return '否';
		        	}else if(d.isShare == 1){
		        		return '是';
		        	} else {
		        		return '参数错误';
		        	}
		        }},
		        { field: 'menuParentName', title: '父菜单', width: 100 },
		        { field: 'menuUrl', title: '菜单链接', width: 160 },
		        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 300, toolbar: '#tableBar'}
		    ]],
		    done: function(){
		    	matchingLanguage();
		    }
		});
		
		table.on('tool(messageTable)', function (obj) {
	        var data = obj.data;
	        var layEvent = obj.event;
			if (layEvent === 'del') { // 删除
				del(data, obj);
			} else if (layEvent === 'edit') { // 编辑
				edit(data);
			} else if (layEvent === 'top') { // 上移
				topOne(data);
			} else if (layEvent === 'lower') { // 下移
				lowerOne(data);
			} else if (layEvent === 'authpoint') { // 权限点
				authpoint(data);
			} else if (layEvent === 'menuIconPic') { // 图片
				systemCommonUtil.showPicImg(fileBasePath + data.menuIconPic);
			} else if (layEvent === 'details') { // 详情
				details(data);
			}
	    });
	}
	
	/********* tree 处理   start *************/
	var tree = fsTree.render({
		id: "treeDemo",
		url: reqBasePath + "querySysEveWinList",
		clickCallback: onClickTree,
		onDblClick: onClickTree
	}, function(id) {
		initLoadTable();
	});

	//异步加载的方法
	function onClickTree(event, treeId, treeNode) {
		if(treeNode == undefined) {
			parentId = "";
		} else {
			parentId = treeNode.id;
		}
		loadTable();
	}
	/********* tree 处理   end *************/
	
	// 刷新数据
    $("body").on("click", "#reloadTable", function() {
    	loadTable();
    });
    
    // 删除
	function del(data, obj){
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index){
			layer.close(index);
            AjaxPostUtil.request({url: reqBasePath + "sys011", params:{rowId: data.id}, type: 'json', callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	
	// 详情
    function details(data){
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/sysevemenu/sysevemenudetails.html", 
            title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
            pageId: "sysevemenudetails",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
            }});
    }
	
	// 编辑
	function edit(data){
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/sysevemenu/sysevemenuedit.html", 
			title: systemLanguage["com.skyeye.editPageTitle"][languageType],
			pageId: "sysevemenuedit",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
	}
	
	// 上移
	function topOne(data){
		AjaxPostUtil.request({url: reqBasePath + "sys022", params:{rowId: data.id}, type: 'json', callback: function (json) {
			winui.window.msg(systemLanguage["com.skyeye.moveUpOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
			loadTable();
		}});
	}
	
	// 下移
	function lowerOne(data){
		AjaxPostUtil.request({url: reqBasePath + "sys023", params:{rowId: data.id}, type: 'json', callback: function (json) {
			winui.window.msg(systemLanguage["com.skyeye.moveDownOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
			loadTable();
		}});
	}
    
    // 新增菜单
    $("body").on("click", "#addBean", function() {
    	_openNewWindows({
			url: "../../tpl/sysevemenu/sysevemenuadd.html", 
			title: systemLanguage["com.skyeye.addPageTitle"][languageType],
			pageId: "sysevemenuadd",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 权限点
    function authpoint(data){
		menuId = data.id;
		_openNewWindows({
			url: "../../tpl/sysEveMenuAuthPoint/sysEveMenuAuthPointList.html",
			title: systemLanguage["com.skyeye.authorityPointPage"][languageType],
			pageId: "sysEveMenuAuthPointList",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
				loadTable();
			}});
	}

	form.render();
	form.on('submit(formSearch)', function (data) {
		if (winui.verifyForm(data.elem)) {
			table.reload("messageTable", {page: {curr: 1}, where: getTableParams()});
		}
		return false;
	});
    
    function loadTable(){
    	table.reload("messageTable", {where: getTableParams()});
    }
    
    function getTableParams(){
		return {
			menuName: $("#menuName").val(),
			menuUrl: $("#menuUrl").val(),
			parentId: parentId,
			menuLevel: $("#menuLevel").val(),
			desktopId: $("#desktop").val(),
			isShare: $("#isShare").val(),
			parentMenuName: $("#parentMenuName").val()
		};
    }
    
    exports('sysevemenulist', {});
});
