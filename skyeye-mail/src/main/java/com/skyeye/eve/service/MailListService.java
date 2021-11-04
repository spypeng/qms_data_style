/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.eve.service;

import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;

public interface MailListService {

	public void queryMailMationList(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void insertMailMation(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void deleteMailMationById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void queryMailMationToEditById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void editMailMationById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void queryMailMationDetailsById(InputObject inputObject, OutputObject outputObject) throws Exception;

}