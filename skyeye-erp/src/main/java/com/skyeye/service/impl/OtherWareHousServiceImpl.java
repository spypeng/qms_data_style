/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.service.impl;

import com.skyeye.common.constans.ErpConstants;
import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;
import com.skyeye.common.util.ExcelUtil;
import com.skyeye.dao.OtherWareHousDao;
import com.skyeye.factory.ErpRunFactory;
import com.skyeye.service.OtherWareHousService;
import com.skyeye.annotation.transaction.ActivitiAndBaseTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: OtherWareHousServiceImpl
 * @Description: 其他入库单管理服务类
 * @author: skyeye云系列--卫志强
 * @date: 2021/7/8 21:08
 *
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
@Service
public class OtherWareHousServiceImpl implements OtherWareHousService{
	
	@Autowired
	private OtherWareHousDao otherWareHousDao;
	
	/**
	 * 其他入库单类型
	 */
	private static final String ORDER_TYPE = ErpConstants.DepoTheadSubType.PUT_IS_OTHERS.getType();
	
	/**
     * 获取其他入库列表信息
     * @param inputObject
     * @param outputObject
     * @throws Exception
     */
	@Override
	public void queryOtherWareHousToList(InputObject inputObject, OutputObject outputObject) throws Exception {
		ErpRunFactory.run(inputObject, outputObject, ORDER_TYPE).queryOrderList();
	}

	/**
     * 新增其他入库信息
     * @param inputObject
     * @param outputObject
     * @throws Exception
     */
	@Override
	@ActivitiAndBaseTransaction(value = {"activitiTransactionManager", "transactionManager"})
	public void insertOtherWareHousMation(InputObject inputObject, OutputObject outputObject) throws Exception {
		ErpRunFactory.run(inputObject, outputObject, ORDER_TYPE).insertOrderMation();
	}

	 /**
     * 其他入库信息编辑回显
     * @param inputObject
     * @param outputObject
     * @throws Exception
     */
	@Override
	public void queryOtherWareHousToEditById(InputObject inputObject, OutputObject outputObject) throws Exception {
		ErpRunFactory.run(inputObject, outputObject, ORDER_TYPE).queryOrderMationToEditById();
	}

	/**
     * 编辑其他入库信息
     * @param inputObject
     * @param outputObject
     * @throws Exception
     */
	@Override
	@ActivitiAndBaseTransaction(value = {"activitiTransactionManager", "transactionManager"})
	public void editOtherWareHousMationById(InputObject inputObject, OutputObject outputObject) throws Exception {
		ErpRunFactory.run(inputObject, outputObject, ORDER_TYPE).editOrderMationById();
	}

	/**
     * 导出Excel
     * @param inputObject
     * @param outputObject
     * @throws Exception
     */
	@Override
	public void queryMationToExcel(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> params = inputObject.getParams();
        List<Map<String, Object>> beans = otherWareHousDao.queryMationToExcel(params);
        String[] key = new String[]{"defaultNumber", "supplierName", "materialNames", "totalPrice", "operPersonName", "operTime"};
        String[] column = new String[]{"单据编号", "供应商", "关联产品", "合计金额", "操作人", "单据日期"};
        String[] dataType = new String[]{"", "data", "data", "data", "data", "data"};
        //其他入库单信息导出
        ExcelUtil.createWorkBook("其他入库单", "其他入库单详细", beans, key, column, dataType, inputObject.getResponse()); 
	}
	
}