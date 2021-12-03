/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.factory;

import java.util.List;
import java.util.Map;

/**
 * @ClassName: IfsOrderFactoryResult
 * @Description: IFS财务模块
 * @author: skyeye云系列--卫志强
 * @date: 2021/11/28 22:51
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
public interface IfsOrderFactoryResult {

    /**
     * 获取订单列表
     *
     * @throws Exception
     */
    List<Map<String, Object>> queryOrderList() throws Exception;

    /**
     * 新增订单数据
     *
     * @throws Exception
     */
    void insertOrderMation() throws Exception;

    /**
     * 编辑时获取订单数据进行回显
     *
     * @return 订单数据
     * @throws Exception
     */
    Map<String, Object> queryOrderMationToEditById() throws Exception;

    /**
     * 编辑订单数据
     *
     * @throws Exception
     */
    void editOrderMationById() throws Exception;

    /**
     * 删除订单数据
     *
     * @throws Exception
     */
    void deleteOrderMationById() throws Exception;

    /**
     * 获取订单详情
     *
     * @throws Exception
     */
    Map<String, Object> queryOrderMationDetailsById() throws Exception;

    /**
     * 单据提交审核
     *
     * @throws Exception
     */
    void subOrderToExamineById() throws Exception;

    /**
     * 单据撤销
     *
     * @throws Exception
     */
    void revokeOrder() throws Exception;

}