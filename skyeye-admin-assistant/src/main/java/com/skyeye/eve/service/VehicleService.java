/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.eve.service;

import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;

/**
 *
 * @ClassName: VehicleService
 * @Description: 车辆管理服务接口层
 * @author: skyeye云系列--卫志强
 * @date: 2021/8/1 18:06
 *
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
public interface VehicleService {

	public void selectAllVehicleMation(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void insertVehicleMation(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void deleteVehicleById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void updateVehicleNormalById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void updateVehicleRepairById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void updateVehicleScrapById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void selectVehicleDetailsById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void queryVehicleMationById(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void editVehicleMationById(InputObject inputObject, OutputObject outputObject) throws Exception;
	
	public void queryAllVehicleToChoose(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void queryTheSuitableVehicleToChoose(InputObject inputObject, OutputObject outputObject) throws Exception;

	public void queryAvailableDrivers(InputObject inputObject, OutputObject outputObject) throws Exception;

}