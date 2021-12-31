var layedit;

var userReturnList = new Array();//选择用户返回的集合或者进行回显的集合
var chooseOrNotMy = "2";//人员列表中是否包含自己--1.包含；其他参数不包含
var chooseOrNotEmail = "2";//人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
var checkType = "1";//人员选择类型，1.多选；其他。单选

var userList = new Array();//选择用户返回的集合或者进行回显的集合

// 我的日报
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'tagEditor'], function (exports) {
	winui.renderColor();
	layui.use(['form', 'layedit'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$;
		    layedit = layui.layedit;
		var reg = new RegExp("<br>", "g");
	    var userId = "";            //日报接收人id
	    
	    layedit.set({
	    	uploadImage: {
	    		url: reqBasePath + "common003", //接口url
    			type: 'post', //默认post
    			data: {
    				type: '13'
    			}
	    	}
	    });
	    
	    var layEditParams = {
	    	tool: [
    	       'html'
    	       ,'strong' //加粗
    	       ,'italic' //斜体
    	       ,'underline' //下划线
    	       ,'del' //删除线
    	       ,'addhr'
    	       ,'|'
    	       ,'removeformat'
    	       ,'fontFomatt'
    	       ,'fontfamily'
    	       ,'fontSize'
    	       ,'colorpicker'
    	       ,'fontBackColor'
    	       ,'face' //表情
    	       ,'|' //分割线
    	       ,'left' //左对齐
    	       ,'center' //居中对齐
    	       ,'right' //右对齐
    	       ,'link' //超链接
    	       ,'unlink' //清除链接
    	       ,'code'
    	       ,'image' //插入图片
    	       ,'attachment'
    	       ,'table'
    	       ,'|'
    	       ,'fullScreen'
    	       ,'preview'
    	       ,'|'
    	       ,'help'
    	     ],
    	     uploadFiles: {
    	 		url: reqBasePath + "common003",
    	 		accept: 'file',
    	 		acceptMime: 'file/*',
    	 		size: '20480',
    	 		data: {
    				type: '13'
    			},
    	 		autoInsert: true, //自动插入编辑器设置
    	 		done: function(data) {
    	 		}
    	 	}
	    };

	    showGrid({
		 	id: "showForm",
		 	url: reqBasePath + "diary016",
		 	params: {rowId:parent.rowId},
		 	pagination: false,
		 	template: getFileContent('tpl/jobdiaryMySend/jobdiaryMySendDayEditTemplate.tpl'),
		 	ajaxSendLoadBefore: function(hdb){
		 		hdb.registerHelper("compare1", function(v1, options){
					return v1.replace(reg, "\n");
				});
		 	},
		 	ajaxSendAfter:function(json){
		 		var userNames = "";
                var userList = json.bean.userInfo;
                $.each(userList, function (i, item) {
                	userNames += item.name + ',';
                });
                //人员选择
                $('#userName').tagEditor({
                	initialTags: userNames.split(','),
                	placeholder: '请选择接收人',
					editorTag: false,
                	beforeTagDelete: function(field, editor, tags, val) {
                		var inArray = -1;
                		$.each(userList, function(i, item) {
                			if(val === item.name) {
                				inArray = i;
                				return false;
                			}
                		});
                		if(inArray != -1) { //如果该元素在集合中存在
                			userList.splice(inArray, 1);
                		}
                	}
                });
		 		var completedContent = layedit.build('completedcontent', layEditParams);
			    var incompleteContent = layedit.build('incompletecontent', layEditParams);
			    var coordinaContent = layedit.build('coordinacontent', layEditParams);
				// 附件回显
				skyeyeEnclosure.initTypeISData({'enclosureUpload': json.bean.enclosureInfo});
                //人员选择
                $("body").on("click", "#userNameSelPeople", function(e){
                    userReturnList = [].concat(userList);
                    _openNewWindows({
                        url: "../../tpl/common/sysusersel.html", 
                        title: "人员选择",
                        pageId: "sysuserselpage",
                        area: ['80vw', '80vh'],
                        callBack: function(refreshCode){
                            if (refreshCode == '0') {
                                //移除所有tag
                                var tags = $('#userName').tagEditor('getTags')[0].tags;
                                for (i = 0; i < tags.length; i++) { 
                                    $('#userName').tagEditor('removeTag', tags[i]);
                                }
                                userList = [].concat(userReturnList);
                                //添加新的tag
                                $.each(userList, function(i, item){
                                    $('#userName').tagEditor('addTag', item.name);
                                });
                            } else if (refreshCode == '-9999') {
                                winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                            }
                        }});
                });
                
                matchingLanguage();
			    form.render();
			    form.on('switch(todycompletedImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#completedtext").parent().hide();
			    		$("#completedcontent").parent().show();
			    		layedit.setContent(completedContent, $("#completedtext").val().replace(/\n|\r\n/g, "<br>"), false);
		 			}else{
		 				$("#completedtext").parent().show();
			    		$("#completedcontent").parent().hide();
			    		$("#completedtext").val(layedit.getContent(completedContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    form.on('switch(todyincompleteImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#incompletetext").parent().hide();
			    		$("#incompletecontent").parent().show();
			    		layedit.setContent(incompleteContent,$("#incompletetext").val().replace(/\n|\r\n/g, "<br>"),false);
		 			}else{
		 				$("#incompletetext").parent().show();
			    		$("#incompletecontent").parent().hide();
			    		$("#incompletetext").val(layedit.getText(incompleteContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    form.on('switch(todycoordinaImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#coordinatext").parent().hide();
			    		$("#coordinacontent").parent().show();
			    		layedit.setContent(coordinaContent,$("#coordinatext").val().replace(/\n|\r\n/g, "<br>"),false);
		 			}else{
		 				$("#coordinatext").parent().show();
			    		$("#coordinacontent").parent().hide();
			    		$("#coordinatext").val(layedit.getText(coordinaContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    
		 	    form.on('submit(daysubmit)', function (data) {
			        if (winui.verifyForm(data.elem)) {
		        		var params = {
		        			jobRemark: encodeURIComponent($("#jobRemark").val()),
		        			jobTitle: $("#jobTitle").val(),
		        			id: json.bean.id,
							enclosureInfo: skyeyeEnclosure.getEnclosureIdsByBoxId('enclosureUpload')
		        		};
		        		if(userList.length == 0 || isNull($('#userName').tagEditor('getTags')[0].tags)){
                            winui.window.msg('请选择收件人', {icon: 2,time: 2000});
                            return false;
                        }else{
                            $.each(userList, function (i, item) {
                                userId += item.id + ',';
                            });
                            params.userId = userId;
                        }
		        		if(data.field.todycompleted === 'true'){
		        			if(isNull(layedit.getContent(completedContent))){
		        				winui.window.msg('请填写今日已完成工作', {icon: 2,time: 2000});
		        				return false;
		        			}else{
		        				params.completedJob = encodeURIComponent(layedit.getContent(completedContent));
		        			}
		        		}else{
		        			if(isNull($("#completedtext").val())){
		        				winui.window.msg('请填写今日已完成工作', {icon: 2,time: 2000});
		        				return false;
		        			}else{
		        				params.completedJob = encodeURIComponent($("#completedtext").val().replace(/\n|\r\n/g, "<br>"));
		        			}
		        		}
		        		if(data.field.todyincomplete === 'true'){
		        			params.incompleteJob = encodeURIComponent(layedit.getContent(incompleteContent));
		        		}else{
		        			params.incompleteJob = encodeURIComponent($("#incompletetext").val().replace(/\n|\r\n/g, "<br>"));
		        		}
		        		if(data.field.todycoordina === 'true'){
		        			params.coordinaJob = encodeURIComponent(layedit.getContent(coordinaContent));
		        		}else{
		        			params.coordinaJob = encodeURIComponent($("#coordinatext").val().replace(/\n|\r\n/g, "<br>"));
		        		}
		        		
		        		AjaxPostUtil.request({url:reqBasePath + "diary017", params:params, type:'json', callback:function(json){
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
		 	}
		});

	    $("body").on("click", "#cancle", function(){
	    	parent.layer.close(index);
	    });
	});
});