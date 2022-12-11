var rowId = "";
var searchType = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	// 加载列表数据权限
	loadAuthBtnGroup('messageTable', '1570455037177');

	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: flowableBasePath + 'customer001',
	    where: getTableParams(),
	    even: true,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	    	{ type: 'radio'},
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
	        { field: 'name', title: '客户名称', align: 'left', width: 200, templet: function (d) {
	        	return '<a lay-event="details" class="notice-title-click">' + d.name + '</a>';
	        }},
	        { field: 'typeName', title: '客户分类', align: 'left', width: 120 },
	        { field: 'fromName', title: '客户来源', align: 'left', width: 120 },
	        { field: 'industryName', title: '所属行业', align: 'left', width: 180 }
	    ]],
	    done: function(res, curr, count){
	    	matchingLanguage();
	    	$('#messageTable').next().find('.layui-table-body').find("table" ).find("tbody").children("tr").on('dblclick',function(){
				var dubClick = $('#messageTable').next().find('.layui-table-body').find("table").find("tbody").find(".layui-table-hover");
				dubClick.find("input[type='radio']").prop("checked", true);
				form.render();
				var id = JSON.stringify(dubClick.data('index'));
				var obj = res.rows[id];
				var customerMation = {
					id: obj.id,
					customName: obj.name,
					contacts: obj.contacts,
					mobilePhone: obj.mobilePhone,
					email: obj.email,
					qq: obj.qq,
					city: obj.city,
					detailAddress: obj.detailAddress,
					workPhone: obj.workPhone,
					industryName: obj.industryName,
					department: obj.department,
					job: obj.job
				}
				parent.customerMation = customerMation;
				parent.sysCustomerUtil.customerMation = customerMation;
				parent.layer.close(index);
				parent.refreshCode = '0';
			});
			
			$('#messageTable').next().find('.layui-table-body').find("table" ).find("tbody").children("tr").on('click',function(){
				var click = $('#messageTable').next().find('.layui-table-body').find("table").find("tbody").find(".layui-table-hover");
				click.find("input[type='radio']").prop("checked", true);
				form.render();
			});

			initTableSearchUtil.initAdvancedSearch(this, res.searchFilter, form, "请输入客户名称", function () {
				table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
			});
	    }
	});
	
	form.render();
	$("body").on("click", "#reloadTable", function() {
		loadTable();
	});

	function loadTable() {
		table.reloadData("messageTable", {where: getTableParams()});
	}

	function getTableParams() {
		return $.extend(true, {}, initTableSearchUtil.getSearchValue("messageTable"));
	}

    exports('customerChoose', {});
});