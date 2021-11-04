/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.factory.impl;

import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;
import com.skyeye.common.util.SpringUtils;
import com.skyeye.dao.SalesReturnsDao;
import com.skyeye.eve.dao.SysEveUserStaffDao;
import com.skyeye.factory.ErpOrderFactory;
import com.skyeye.factory.ErpOrderFactoryResult;
import com.skyeye.service.StoreHouseApprovalService;

import java.util.List;
import java.util.Map;

/**
 * @ClassName: SalesReturnsFactory
 * @Description: 销售退货单工厂类
 * @author: skyeye云系列--卫志强
 * @date: 2021/7/16 20:30
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
public class SalesReturnsFactory extends ErpOrderFactory implements ErpOrderFactoryResult {

    private SalesReturnsDao salesReturnsDao;

    private SysEveUserStaffDao sysEveUserStaffDao;

    private StoreHouseApprovalService storeHouseApprovalService;

    public SalesReturnsFactory(InputObject inputObject, OutputObject outputObject, String orderType){
        super(inputObject, outputObject, orderType);
        this.salesReturnsDao = SpringUtils.getBean(SalesReturnsDao.class);
        this.sysEveUserStaffDao = SpringUtils.getBean(SysEveUserStaffDao.class);
        this.storeHouseApprovalService = SpringUtils.getBean(StoreHouseApprovalService.class);
    }

    /**
     * 获取订单列表的执行sql
     *
     * @param params 入参
     * @return 订单列表
     */
    @Override
    protected List<Map<String, Object>> queryOrderListSqlRun(Map<String, Object> params) throws Exception {
        return salesReturnsDao.querySalesReturnsToList(params);
    }

    /**
     * 编辑时获取订单数据进行回显时，获取其他数据--获取销售人员
     *
     * @param bean 单据信息
     * @param orderId 订单id
     * @throws Exception
     */
    protected void quertOrderOtherMationToEditById(Map<String, Object> bean, String orderId) throws Exception{
        // 获取销售人员
        if(bean.containsKey("salesMan")){
            bean.put("userInfo", sysEveUserStaffDao.queryUserNameList(bean.get("salesMan").toString()));
        }
    }

    @Override
    protected void subOrderMationSuccessAfter(String orderId, String approvalResult) throws Exception{
        storeHouseApprovalService.approvalOrder(orderId, approvalResult);
    }

}