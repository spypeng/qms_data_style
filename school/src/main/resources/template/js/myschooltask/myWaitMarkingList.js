
var rowId = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
	winui.renderColor();
	
	var $ = layui.$,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate;
	
	laydate.render({
		elem: '#year', //指定元素
		type: 'year',
		max: 'date'
	});
	
	//初始化学校
	showGrid({
		id: "schoolId",
		url: reqBasePath + "schoolmation008",
		params: {},
		pagination: false,
		template: getFileContent('tpl/template/select-option-must.tpl'),
		ajaxSendAfter: function(json){
			form.render('select');
			//加载年级
 			initGradeId();
			initTable();
		}
	});
	
	form.on('select(schoolId)', function(data){
		//加载年级
 		initGradeId();
	});
	
	//所属年级
    function initGradeId(){
	    showGrid({
    	 	id: "gradeId",
    	 	url: reqBasePath + "grademation006",
    	 	params: {schoolId: $("#schoolId").val()},
    	 	pagination: false,
    	 	template: getFileContent('tpl/template/select-option.tpl'),
    	 	ajaxSendLoadBefore: function(hdb){
    	 	},
    	 	ajaxSendAfter:function(json){
    	 		form.render('select');
    	 	}
        });
    }

	function initTable(){
		
		table.render({
	        id: 'messageTable',
	        elem: '#messageTable',
	        method: 'post',
	        url: reqBasePath + 'myschooltask002',
	        where: getTableParams(),
	        even: true,
		    page: true,
		    limits: getLimits(),
	    	limit: getLimit(),
	        cols: [[
	        	{ title: '序号', rowspan: '2', type: 'numbers'},
	        	{ field: 'studentName', rowspan: '2', width: 80, title: '姓名'},
	        	{ field: 'studentNo', rowspan: '2', width: 140, align: 'center', title: '学号'},
		        { field: 'sessionYear', rowspan: '2', width: 80, align: 'center', title: '所属届'},
	            { field: 'schoolName', rowspan: '2', width: 150, title: '学校'},
	            { field: 'gradeName', rowspan: '2', width: 80, align: 'center', title: '年级'},
	            { field: 'surveyName', rowspan: '2', width: 200, title: '试卷名称', templet: function(d){
			        return '<a lay-event="details" class="notice-title-click">' + d.surveyName + '</a>';
			    }},
            	{ title: '答题信息', align: 'center', colspan: '3'},
		        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', rowspan: '2', align: 'center', width: 100, toolbar: '#tableBar'}
	        ],[
		    	{ field: 'bgAnDate', title: '开始时间', align: 'center', width: 120},
		        { field: 'endAnDate', title: '结束时间', align: 'center', width: 120},
		        { field: 'totalTime', title: '耗时(分钟)', align: 'center', width: 100}
		       ]
		    ],
		    done: function(){
		    	matchingLanguage();
		    }
	    });
	    
	    table.on('tool(messageTable)', function (obj) {
	        var data = obj.data;
	        var layEvent = obj.event;
	        if (layEvent === 'examMarkingDetail') { //阅卷
	        	examMarkingDetail(data);
	        }else if (layEvent === 'details') { //详情
	        	details(data);
	        }
	    });
		
	    form.render();
	}
	
	//阅卷
	function examMarkingDetail(data){
		rowId = data.answerId;
		_openNewWindows({
			url: "../../tpl/examMarkingDetail/examMarkingDetail.html", 
			title: "阅卷",
			pageId: "examMarkingDetail",
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
	
	
	form.on('submit(formSearch)', function (data) {
        
        if (winui.verifyForm(data.elem)) {
        	refreshTable();
        }
        return false;
    });
    
    //详情
	function details(data){
		rowId = data.surveyId;
		_openNewWindows({
			url: "../../tpl/examDetail/examPCDetail.html", 
			title: "试卷信息",
			pageId: "examPCDetail",
			area: ['90vw', '90vh'],
			callBack: function(refreshCode){
			}});
	}
	
	//刷新数据
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
    		gradeId: $("#gradeId").val(), 
    		schoolId: $("#schoolId").val(), 
    		year: $("#year").val(),
    		surveyName: $("#surveyName").val(),
    		studentName: $("#studentName").val(),
    		studentNo: $("#studentNo").val()
    	};
    }
    
    exports('myWaitMarkingList', {});
});