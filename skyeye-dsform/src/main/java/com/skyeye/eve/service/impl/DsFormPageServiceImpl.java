/*******************************************************************************
 * Copyright 卫志强 QQ：598748873@qq.com Inc. All rights reserved. 开源地址：https://gitee.com/doc_wei01/skyeye
 ******************************************************************************/

package com.skyeye.eve.service.impl;

import cn.hutool.json.JSONUtil;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.skyeye.common.constans.Constants;
import com.skyeye.common.object.InputObject;
import com.skyeye.common.object.OutputObject;
import com.skyeye.common.util.DateUtil;
import com.skyeye.common.util.HttpClient;
import com.skyeye.common.util.ToolUtil;
import com.skyeye.eve.dao.DsFormPageDao;
import com.skyeye.eve.service.DsFormPageService;
import com.skyeye.jedis.JedisClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: DsFormPageServiceImpl
 * @Description: 动态表单页面管理服务类
 * @author: skyeye云系列--卫志强
 * @date: 2021/7/6 22:36
 *
 * @Copyright: 2021 https://gitee.com/doc_wei01/skyeye Inc. All rights reserved.
 * 注意：本内容仅限购买后使用.禁止私自外泄以及用于其他的商业目的
 */
@Service
public class DsFormPageServiceImpl implements DsFormPageService {

	@Autowired
	private DsFormPageDao dsFormPageDao;
	
	@Autowired
	public JedisClientService jedisClient;
	
	/**
	 * 
	     * @Title: queryDsFormPageList
	     * @Description: 获取动态表单页面表
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	public void queryDsFormPageList(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		Page pages = PageHelper.startPage(Integer.parseInt(map.get("page").toString()), Integer.parseInt(map.get("limit").toString()));
		List<Map<String, Object>> beans = dsFormPageDao.queryDsFormPageList(map);
		outputObject.setBeans(beans);
		outputObject.settotal(pages.getTotal());
	}
	
	/**
	 * 
	     * @Title: insertDsFormPageMation
	     * @Description: 新增动态表单页面
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	@Transactional(value="transactionManager")
	public void insertDsFormPageMation(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		Map<String, Object> bean = dsFormPageDao.queryDsFormPageMationByName(map);
		if(bean != null && !bean.isEmpty()){
			outputObject.setreturnMessage("该动态表单已存在，请更换");
		}else{
			Map<String, Object> user = inputObject.getLogParams();
			map.put("id", ToolUtil.getSurFaceId());
			map.put("pageNum", ToolUtil.getUniqueKey().substring(10, 20));
			map.put("createId", user.get("id"));
			map.put("createTime", DateUtil.getTimeAndToString());
			dsFormPageDao.insertDsFormPageMation(map);
		}
	}

	/**
	 * 
	     * @Title: insertDsFormPageContent
	     * @Description: 新增控件
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	@Transactional(value="transactionManager")
	public void insertDsFormPageContent(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		Map<String, Object> bean = dsFormPageDao.queryDsFormPageOrderby(map);
		Map<String, Object> user = inputObject.getLogParams();
		map.put("id", ToolUtil.getSurFaceId());
		if(bean ==  null){
			map.put("orderBy", 1);
		}else{
			map.put("orderBy", Integer.parseInt(bean.get("orderBy").toString()) + 1);
		}
		map.put("createId", user.get("id"));
		map.put("createTime", DateUtil.getTimeAndToString());
		map.put("state", "1");
		dsFormPageDao.insertDsFormPageContent(map);
		map.put("name", map.get("id"));
		outputObject.setBean(map);
	}

	/**
	 * 
	     * @Title: selectFormPageContentByPageId
	     * @Description: 查看某个动态表单中的表单控件
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	public void selectFormPageContentByPageId(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		List<Map<String, Object>> beans = dsFormPageDao.selectFormPageContentByPageId(map);
		outputObject.setBeans(beans);
		outputObject.settotal(beans.size());
	}
	
	/**
	 * 
	     * @Title: deleteDsFormPageById
	     * @Description: 删除动态表单
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	@Transactional(value="transactionManager")
	public void deleteDsFormPageById(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		dsFormPageDao.deleteDsFormContentByPageId(map);
		dsFormPageDao.deleteDsFormPageById(map);
	}

	/**
	 * 
	     * @Title: selectDsFormPageById
	     * @Description: 通过id查找对应的动态表单
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	public void selectDsFormPageById(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		Map<String, Object>	bean = dsFormPageDao.selectDsFormPageById(map);
		outputObject.setBean(bean);
		outputObject.settotal(1);
	}

	/**
	 * 
	     * @Title: editDsFormPageMationById
	     * @Description: 通过id编辑对应的动态表单
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	@Transactional(value="transactionManager")
	public void editDsFormPageMationById(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		Map<String, Object> b = dsFormPageDao.queryDsFormPageMationByName(map);
		if(b != null && !b.isEmpty()){
			outputObject.setreturnMessage("该动态表单已存在，请更换");
		}else{
			dsFormPageDao.editDsFormPageMationById(map);
		}
	}

	/**
	 * 
	     * @Title: queryAllDsFormPageContent
	     * @Description: 获取表单内所有控件用于编辑调整
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@Override
	public void queryAllDsFormPageContent(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		List<Map<String,Object>> beans = dsFormPageDao.queryAllDsFormPageContent(map);
		outputObject.setBeans(beans);
		outputObject.settotal(beans.size());
	}

	/**
	 * 
	     * @Title: editDsFormPageContentByPageId
	     * @Description: 编辑表单内容中的控件
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@SuppressWarnings("unchecked")
	@Override
	@Transactional(value="transactionManager")
	public void editDsFormPageContentByPageId(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		if(!ToolUtil.isBlank(map.get("formedit").toString())){
			String formEdit = map.get("formedit").toString();
			List<Map<String, Object>> formEditList = JSONUtil.toList(formEdit, null);
			for(int i = 0; i < formEditList.size(); i++){
				Map<String, Object> bean = formEditList.get(i);
				if(bean.get("state").toString().equals("1")){
					dsFormPageDao.editDsFormPageContentByPageId(bean);
				}else{
					dsFormPageDao.editDsFormPageContentToDelete(bean);
				}
				if(i == 0){
					// 删除该页面控件的redis
					jedisClient.del(Constants.dsFormContentListByPageId(bean.get("pageId").toString()));
				}
			}
		}
	}

	/**
	 * 
	     * @Title: queryInterfaceIsTrueOrNot
	     * @Description: 验证接口是否正确
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@SuppressWarnings("static-access")
	@Override
	public void queryInterfaceIsTrueOrNot(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		map.put("loginPCIp", inputObject.getRequest().getParameter("loginPCIp"));
		map.put("userToken", inputObject.getRequest().getParameter("userToken"));
		String str = HttpClient.doPost(map.get("interfa").toString(), map);
		if(!ToolUtil.isBlank(str)){
			if(ToolUtil.isJson(str)){
				Map<String, Object> json = JSONUtil.toBean(str, null);
				if("0".equals(json.get("returnCode").toString())){
					if(!ToolUtil.isBlank(json.get("rows").toString())){
						map.put("aData", json.get("rows").toString());
						outputObject.setBean(map);
						outputObject.settotal(1);
					}else{
						outputObject.setreturnMessage("该接口没有拿到数据，请重新填写接口！");
					}
				}else{
					outputObject.setreturnMessage("该接口无效，请重新填写接口!");
				}
			}else{
				outputObject.setreturnMessage("接口拿到的不是json串，请重新填写接口!");
			}
		}else{
			outputObject.setreturnMessage("该接口无效，请重新填写接口!");
		}
	}

	/**
	 * 
	     * @Title: queryInterfaceValue
	     * @Description: 获取接口中的值
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@SuppressWarnings("static-access")
	@Override
	public void queryInterfaceValue(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		map.put("loginPCIp", inputObject.getRequest().getParameter("loginPCIp"));
		map.put("userToken", inputObject.getRequest().getParameter("userToken"));
		String str = HttpClient.doPost(map.get("interfa").toString(), map);
		Map<String, Object> json = JSONUtil.toBean(str, null);
		map.put("aData", json.get("rows").toString());
		outputObject.setBean(map);
	}

	/**
	 * 
	     * @Title: queryDsFormContentListByPageId
	     * @Description: 获取redis中的动态表单页
	     * @param inputObject
	     * @param outputObject
	     * @throws Exception    参数
	     * @return void    返回类型
	     * @throws
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void queryDsFormContentListByPageId(InputObject inputObject, OutputObject outputObject) throws Exception {
		Map<String, Object> map = inputObject.getParams();
		List<Map<String, Object>> beans = new ArrayList<>();
		if(ToolUtil.isBlank(jedisClient.get(Constants.dsFormContentListByPageId(map.get("pageId").toString())))){//若缓存中无值
			beans = dsFormPageDao.queryDsFormContentListByPageId(map);	//从数据库中查询
			jedisClient.set(Constants.dsFormContentListByPageId(map.get("pageId").toString()), JSONUtil.toJsonStr(beans));//将从数据库中查来的内容存到缓存中
		}else{
			beans = JSONUtil.toList(jedisClient.get(Constants.dsFormContentListByPageId(map.get("pageId").toString())), null);
		}
		if(!beans.isEmpty()){
			outputObject.setBeans(beans);
			outputObject.settotal(beans.size());
		}
	}

}