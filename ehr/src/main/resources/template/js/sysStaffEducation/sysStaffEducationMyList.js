
var rowId = "";

var staffId = "";

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
	
	authBtn('1601784618053');
	// 获取当前登录员工信息
	systemCommonUtil.getSysCurrentLoginUserMation(function (data) {
		staffId = data.bean.staffId;
	});
	initTable();

    function initTable(){
		table.render({
		    id: 'messageTable',
		    elem: '#messageTable',
		    method: 'post',
		    url: sysMainMation.ehrBasePath + 'sysstaffeducation006',
		    where: getTableParams(),
		    even: true,
		    page: true,
		    limits: getLimits(),
	    	limit: getLimit(),
		    cols: [[
		        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
		        { field: 'graductionSchool', title: '毕业院校', align: 'left', width: 160 },
		        { field: 'admissionTime', title: '入学时间', align: 'center', width: 100},
		        { field: 'graduationTime', title: '毕业时间', align: 'center', width: 100},
                { field: 'major', title: '专业', width: 160},
                { field: 'educationName', title: '学历', align: 'left', width: 120 },
                { field: 'jobNumber', title: '员工工号', align: 'left', width: 80 },
                { field: 'userName', title: '员工姓名', align: 'left', width: 100 },
                { field: 'state', title: '员工状态', align: 'center', width: 80, templet: function (d) {
                    if(d.state == '1'){
                        return "在职";
                    }else if(d.state == '2'){
                        return "离职";
                    }else if(d.state == '3'){
                        return "见习";
                    }else if(d.state == '4'){
                        return "试用";
                    }else if(d.state == '5'){
                        return "退休";
                    }
                }},
                { field: 'learningModalityName', title: '学习形式', align: 'left', width: 150 },
                { field: 'schoolNatureName', title: '学校性质', align: 'left', width: 100 },
                { field: 'createTime', title: systemLanguage["com.skyeye.entryTime"][languageType], align: 'center', width: 100},
		        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 100, toolbar: '#tableBar'}
		    ]],
		    done: function(json) {
		    	matchingLanguage();
		    }
		});
		
		table.on('tool(messageTable)', function (obj) {
	        var data = obj.data;
	        var layEvent = obj.event;
	        if (layEvent === 'edit') { // 编辑
	        	edit(data);
	        } else if (layEvent === 'delete') { // 删除
	        	deleteRow(data);
	        }
	    });
    }
	
	form.render();
	
	// 录入教育背景
	$("body").on("click", "#addBean", function() {
    	_openNewWindows({
			url: "../../tpl/sysStaffEducation/sysStaffEducationAdd.html",
			title: "录入教育背景",
			pageId: "sysStaffEducationAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
	});
	
	// 编辑
    function edit(data) {
        rowId = data.id;
        _openNewWindows({
			url: "../../tpl/sysStaffEducation/sysStaffEducationEdit.html",
			title: systemLanguage["com.skyeye.editPageTitle"][languageType],
			pageId: "sysStaffEducationEdit",
            area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}
		});
	}
	
	// 删除
    function deleteRow(data) {
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index){
            layer.close(index);
            AjaxPostUtil.request({url: sysMainMation.ehrBasePath + "sysstaffeducation005", params: {rowId: data.id}, type: 'json', method: "DELETE", callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
				loadTable();
            }});
        });
    }

	// 刷新数据
    $("body").on("click", "#reloadTable", function() {
    	loadTable();
    });

    function loadTable() {
        table.reloadData("messageTable", {where: getTableParams()});
    }

    function getTableParams() {
    	return {
    		staffId: staffId
    	};
	}
    
    exports('sysStaffCertificate', {});
});
