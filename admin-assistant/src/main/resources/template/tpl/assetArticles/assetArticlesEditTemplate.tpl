{{#bean}}
	<div class="layui-form-item">
        <label class="layui-form-label">名称<i class="red">*</i></label>
        <div class="layui-input-block">
            <input type="text" id="articlesName" name="articlesName" win-verify="required" placeholder="请输入用品名称" class="layui-input" value="{{articlesName}}"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">用品类别<i class="red">*</i></label>
        <div class="layui-input-block">
            <select lay-filter="typeId" lay-search="" id="typeId">
                    
			</select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">规格</label>
        <div class="layui-input-block">
        	<input type="text" id="specifications" name="specifications" placeholder="请输入用品规格" class="layui-input" value="{{specifications}}"/>
        	<div class="layui-form-mid layui-word-aux">例如：投影仪、白板、录影设备等</div>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">计量单位<i class="red">*</i></label>
        <div class="layui-input-block">
            <input type="text" id="unitOfMeasurement" name="unitOfMeasurement" win-verify="required" placeholder="请输入计量单位，如：厘米，千克，本，个等" class="layui-input" value="{{unitOfMeasurement}}"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">初始化数量</label>
        <div class="layui-input-block ver-center">
            {{initialNum}}
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">存放区域</label>
        <div class="layui-input-block">
        	<input type="text" id="storageArea" name="storageArea" placeholder="请输入用品的存放区域" class="layui-input" value="{{storageArea}}"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">管理人</label>
        <div class="layui-input-block">
        	<input type="text" id="assetAdmin" name="assetAdmin" placeholder="请选择用品管理人" class="layui-input"/>
		    <i class="fa fa-user-plus input-icon" id="userNameSelPeople"></i>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">相关描述</label>
        <div class="layui-input-block">
        	<textarea id="roomAddDesc" name="roomAddDesc"  placeholder="请输入用品相关描述" class="layui-textarea" style="height: 100px;" maxlength="200">{{roomAddDesc}}</textarea>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">相关附件</label>
        <div class="layui-input-block" id="enclosureUpload">
        </div>
    </div>
    <div class="layui-form-item layui-col-xs12">
        <div class="layui-input-block">
            <button class="winui-btn" id="cancle"><language showName="com.skyeye.cancel"></language></button>
            <button class="winui-btn" lay-submit lay-filter="formEditBean"><language showName="com.skyeye.save"></language></button>
        </div>
    </div>
{{/bean}}