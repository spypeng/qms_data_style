/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.eve.dao;

import java.util.List;
import java.util.Map;

public interface CodeModelHistoryDao {

	public List<Map<String, Object>> queryCodeModelHistoryList(Map<String, Object> map) throws Exception;

	public List<Map<String, Object>> queryCodeModelHistoryListByFilePath(Map<String, Object> map) throws Exception;

}