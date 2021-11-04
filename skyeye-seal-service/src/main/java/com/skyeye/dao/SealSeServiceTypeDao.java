/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.dao;

import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: SealSeServiceTypeDao
 * @Description: 售后服务类型管理数据层
 * @author: skyeye云系列--卫志强
 * @date: 2021/8/7 11:19
 *
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
public interface SealSeServiceTypeDao {

    public int insertSealSeServiceType(Map<String, Object> map) throws Exception;

    public List<Map<String, Object>> querySealSeServiceTypeList(Map<String, Object> map) throws Exception;

    public Map<String, Object> querySealSeServiceTypeMationById(Map<String, Object> map) throws Exception;

    public Map<String, Object> queryStateById(Map<String, Object> map) throws  Exception;

    public List<Map<String, Object>> queryStateUpList(Map<String, Object> map) throws Exception;

    public Map<String, Object> querySealSeServiceTypeByName(Map<String, Object> map) throws Exception;

    public Map<String, Object> querySealSeServiceTypeByIdAndName(Map<String, Object> map) throws Exception;

    public int editSealSeServiceTypeById(Map<String, Object> map) throws Exception;

    public int editStateUpById(Map<String, Object> map) throws Exception;

    public int editStateDownById(Map<String, Object> map) throws Exception;

    public int deleteSealSeServiceTypeById(Map<String, Object> map) throws Exception;

}