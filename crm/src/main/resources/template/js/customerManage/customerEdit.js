
var userList = new Array();// 选择用户返回的集合或者进行回显的集合

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'textool'], function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		form = layui.form,
		textool = layui.textool;

	showGrid({
		id: "showForm",
		url: flowableBasePath + "queryCustomerMationById",
		params: {id: parent.rowId},
		pagination: false,
		method: 'GET',
		template: $("#beanTemplate").html(),
		ajaxSendLoadBefore: function(hdb) {},
		ajaxSendAfter: function (json) {
			// 客户分类
			sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["crmCustomerType"]["key"], 'select', "typeId", json.bean.typeId, form);

			// 客户来源
			sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["crmCustomerFrom"]["key"], 'select', "fromId", json.bean.fromId, form);

			// 客户所属行业
			sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["crmCustomerIndustry"]["key"], 'select', "industryId", json.bean.industryId, form);

			// 客户分组
			sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["crmCustomerGroup"]["key"], 'select', "groupId", json.bean.groupId, form);

			teamObjectPermissionUtil.buildTeamTemplate('teamTemplateId', 1, json.bean.teamTemplateId);

			textool.init({eleId: 'addDesc', maxlength: 200});
			if (!isNull(json.bean.chargeUserMation)) {
				userList.push(json.bean.chargeUserMation);
				$.each(userList, function(i, item) {
					$("#relationUserId").val(item.name);
				});
			}

			// 附件回显
			skyeyeEnclosure.initTypeISData({'enclosureUpload': json.bean.enclosureInfo});

			matchingLanguage();
			form.render();
			form.on('submit(formEditBean)', function (data) {
				if (winui.verifyForm(data.elem)) {
					var params = {
						id: parent.rowId,
						name: $("#name").val(),
						combine: $("#combine").val(),
						cusUrl: $("#cusUrl").val(),
						country: $("#country").val(),
						city: $("#city").val(),
						detailAddress: $("#detailAddress").val(),
						postalCode: $("#postalCode").val(),
						fax: $("#fax").val(),
						corRepresentative: $("#corRepresentative").val(),
						regCapital: $("#regCapital").val(),
						addDesc: $("#addDesc").val(),
						bankAccount: $("#bankAccount").val(),
						accountName: $("#accountName").val(),
						bankName: $("#bankName").val(),
						bankAddress: $("#bankAddress").val(),
						dutyParagraph: $("#dutyParagraph").val(),
						financePhone: $("#financePhone").val(),
						mechanicName: $("#mechanicName").val(),
						mechanicPhone: $("#mechanicPhone").val(),
						groupId: $("#groupId").val(),
						typeId: $("#typeId").val(),
						fromId: $("#fromId").val(),
						industryId: $("#industryId").val(),
						teamTemplateId: $("#teamTemplateId").val(),
						chargeUser: '',
						enclosureInfo: JSON.stringify({enclosureInfo: skyeyeEnclosure.getEnclosureIdsByBoxId('enclosureUpload')})
					};
					// 负责人
					if(userList.length > 0 ){
						params.chargeUser = userList[0].id;
					}

					AjaxPostUtil.request({url: flowableBasePath + "writeCustomerMation", params: params, type: 'json', method: 'POST', callback: function (json) {
						parent.layer.close(index);
						parent.refreshCode = '0';
					}});
				}
				return false;
			});
		}
	});

	// 负责人选择
	$("body").on("click", "#userNameSelPeople", function (e) {
		systemCommonUtil.userReturnList = [].concat(userList);
		systemCommonUtil.chooseOrNotMy = "1"; // 人员列表中是否包含自己--1.包含；其他参数不包含
		systemCommonUtil.chooseOrNotEmail = "2"; // 人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
		systemCommonUtil.checkType = "2"; // 人员选择类型，1.多选；其他。单选
		systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList) {
			userList = [].concat(userReturnList);
			//添加选择
			$.each(userList, function(i, item) {
				$("#relationUserId").val(item.name);
			});
		});
	});

	$("body").on("click", "#cancle", function() {
		parent.layer.close(index);
	});
});