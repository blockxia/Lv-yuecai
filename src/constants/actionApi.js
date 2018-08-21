//用户
export const USER = {
	logout: '/mng/api/mng/user/logout.json',
	get_login_user: '/mng/api/mng/user/get_login_user.json',
	get_login_user_purchase: '/mng/api/pimp/purchaser/user/get_login_user_as_purchaser.json',
};

//基础接口
export const BASIC = {
	get_country: '/sys/get_country_code.json',
	get_lang: '/mng/api/mng/sys/get_lang.json',
	get_country_code: '/mng/api/mng/sys/get_country_code.json'
};

//用户权限
export const USER_PRIVILEGE = {
	get: '/mng/api/pimp/vendor/privilege/get_user_privilege.json',
	all: '/mng/api/mng/privilege/res/get_all_privilege.json',
};

//账号管理
export const ACCOUNT = {
	update_account: '/mng/api/mng/user/update_user_info.json',
	update_password: '/mng/api/mng/user/update_password.json',
	validate_user: '/user/get_user.json'
};

//员工接口
export const EMPLOYEES = {
	//添加员工账号接口
	add_exsit: '/mng/api/mng/user/add/account.json',
	//添加员工账号接口(手机号)
	add_new: '/mng/api/mng/user/add/mobile/account.json',
	//删除员工账号接口
	delete: '/mng/api/mng/user/account/delete.json',
	//员工账号列表接口
	list: '/mng/api/mng/user/account/list.json',
	//查询用户信息接口
	check_account: '/mng/api/mng/user/check/account.json',
	//根据真实名字查询用户信息接口
	query_user_by_realname: '/mng/api/mng/user/account/query_user_by_realName.json',
};

//角色接口
export const ROLES = {
	//角色分页查询接口
	get_by_page: '/mng/api/mng/privilege/role/get_by_page.json',
	//添加角色接口
	add: '/mng/api/mng/privilege/role/add.json',
	//修改角色接口
	update: '/mng/api/mng/privilege/role/update.json',
	//删除角色接口
	delete: '/mng/api/mng/privilege/role/delete.json',
	//角色绑定资源接口
	bind_resource: '/mng/api/mng/privilege/role/bind_resource.json',
	//根据角色名称查询角色接口
	get_by_name: '/mng/api/mng/privilege/role/get_by_name.json',
	//角色资源列表查询接口 
	res_list: '/mng/api/mng/privilege/role/res_list.json',
	//授权接口
	privilege_auth: '/mng/api/mng/privilege/auth.json',
	//使用用户id查询角色
	get_by_userid: '/mng/api/mng/privilege/role/get_by_user.json',
};

export const TASK = {
	GET_LAUNCH: "/mng/api/urge/task/my_originated/query.json",
	GET_HANDLE: "/mng/api/urge/task/my_processed/query.json",
	GET_CONFIRM: "/mng/api/urge/task/my_confirmed/query.json",
	GET_TOTAL: "/mng/api/urge/task/total/list.json",//查询全部任务列表
	CREATE_TASK: "/mng/api/urge/task/my_originated/create.json",
	TASK_DETAIL: "/mng/api/urge/task/my_originated/detail.json",
	TASK_USER: "/mng/api/urge/task/my_originated/queryUsers.json",
	TASK_HANDLE: '/mng/api/urge/task/my_processed/settledTask.json',
	TASK_COUNT: '/mng/api/urge/task/my_processed/pendingTaskCount.json',
	TASK_PENDING: '/mng/api/urge/task/my_processed/pendingTask.json',
	TASK_TOTAL_CONFIRM: '/mng/api/urge/task/total/confirmSettled.json',
	TASK_DELAY: '/mng/api/urge/task/my_confirmed/confirmDelay.json',
	TASK_SETTLED: '/mng/api/urge/task/my_confirmed/confirmSettled.json',
	TASK_REJECT: '/mng/api/urge/task/my_confirmed/reject.json',
	TASK_END: '/mng/api/urge/task/my_processed/settledTask.json',
	TASK_EXPORT: '/mng/api/urge/task/total/task/export.json',
	TASK_UPLOAD_FILE: '/mng/api/urge/task/my_processed/uploadFile.json',
	TASK_FILE_DELETE: '/mng/api/urge/task/my_processed/deleteFile.json',
	TASK_JUDGE_USER: '/mng/api/urge/task/my_processed/settledTaskFlag.json'
}
export const PAGERESULT = {
	SETTLED: '/mng/api/urge/task/email/settledTask.json',
	CONFIRMSETTLED: '/mng/api/urge/task/email/confirmSettled.json'
}

export const NOTICE = {
	FETCH_NOTICE_LIST: "/mng/api/pimp/purchaser/notice/list.json", //公告信息列表查询接口
	FETCH_ATTACHMENT_LIST: "/mng/api/pimp/purchaser/notice/attachment/list.json", // 公告信息附件查询接口
	FETCH_Update_LIST: "/mng/api/pimp/notice/update.json",// 公告信息更新接口
	FETCH_ADD_LIST: "/mng/api/pimp/notice/add.json", //公告新增接口
	UPLOAD_ATTACHEMENT: "/mng/api/pimp/notice/attachment/uploadFile.json", //公告信息附件上传接口
	FETCH_LIST_ISREAD: "/mng/api/pimp/purchaser/notice/update/read.json", //公告信息批量置为已读接口
	FETCH_LIST_DELETE: "/mng/api/pimp/notice/clear.json",//公告信息清空接口
	DELETE_ATTACHMENT: "/mng/api/pimp/notice/attachment/delete.json", // 公告信息附件删除接口
}

// 设置
export const SETTING = {
	FETCH_PRICE_TYPE: '/mng/api/pimp/setting/price/list.json', // 价格类型设置数据
	UPDATE_PRICE_TYPE: '/mng/api/pimp/setting/price/update.json', // 价格类型修改
	ADD_PRICE_TYPE: '/mng/api/pimp/setting/price/add.json', // 价格类型修改
	DELETE_PRICE_TYPE: '/mng/api/pimp/setting/price/delete.json', // 价格类型修改
	FETCH_COMMON_VAR: '/mng/api/pimp/setting/dict/listByTypeName.json', // 获取公共参数
	FETCH_COMMON_VAR_BY_CODE: '/mng/api/pimp/setting/dict/listByTypeCode.json', // 获取公共参数
	FETCH_ACCOUNT: '/mng/api/pimp/setting/bankaccount/list.json', // 查询账户信息
	FETCH_INVOICE: '/mng/api/pimp/setting/invoiceinformation/list.json', // 查询发票信息
	SET_DEFAULT: '/mng/api/pimp/setting/bankaccount/update_default.json', // 设置默认账户
	ADD_ACCOUNT: '/mng/api/pimp/setting/bankaccount/add.json', // 银行账户添加
	UPDATE_ACCOUNT: '/mng/api/pimp/setting/bankaccount/update.json', // 银行账户修改
	ADD_INVOICE: '/mng/api/pimp/setting/invoiceinformation/add.json', // 发票信息添加
	UPDATE_INVOICE: '/mng/api/pimp/setting/invoiceinformation/update.json', // 发票信息修改
	FETCH_ALL_PARAMETERS: '/mng/api/pimp/setting/dict/list.json',
	CREATE_PARAMETERS: '/mng/api/pimp/setting/dict/create.json',
	UPDATE_PARAMETERS: 'mng/api/pimp/setting/dict/update.json',
	DEL_PARAMETERS: '/mng/api/pimp/setting/dict/delete.json',
	PERSONALFILE_DATA: '/mng/api/pimp/purchaser/user/get_login_user_as_purchaser.json', //获取采购商信息
	UPDATE_PROFILE: '/mng/api/pimp/purchaser/shops/purchaser/update.json',//采购商更新
}
//采购端
export const PURCHASE = {
	FETCH_LISTSLIDE_TYPE: "/mng/api/pimp/purchaser/setting/index/listSlide.json", //列出轮播图
	UPDATE_LISTSLIDE_TYPE: "/mng/api/pimp/setting/index/updateSlide.json", //修改轮播图
	ADD_LISTSLIDE_TYPE: "/mng/api/pimp/setting/index/addSlide.json", //新增轮播图
	DELETE_LISTSLIDE_TYPE: "/mng/api/pimp/setting/index/deleteSlide.json", //删除轮播图
	FETCH_HOMEPAGE_TYPE: "/mng/api/pimp/setting/index/listMenu.json", // 列出所有菜单
	DELETE_HOMEPAGE_TYPE: "/mng/api/pimp/setting/index/deleteMenu.json", //删除菜单
	UPDATE_HOMEPAGE_TYPE: "/mng/api/pimp/setting/index/updateMenu.json", //修改菜单名称
	ADD_HOMEPAGE_TYPE: "/mng/api/pimp/setting/index/addMenu.json", //新增菜单名称
	FETCH_TEMPLET_TYPE: "/mng/api/pimp/purchaser/setting/index/listTemplate.json", // 列出所有菜单
	UPDATE_TEMPLET_TYPE: "/mng/api/pimp/setting/index/updateTemplate.json", //修改模板
	ADD_TOSHOPPINGCART: "/mng/api/pimp/purchaser/product/buycart/add.json", //新增商品到购物车
}
// 商户
export const MERCHANT = {
	FETCH_SUPPLIER_LIST: '/mng/api/pimp/shops/supply/list.json', // 查询供应商列表
	FETCH_ITEM_TYPE: '/mng/api/pimp/product/catalog/query_parent.json', // 查询商品一级类目信息
	SUPPLIER_UPLOAD: '/mng/api/pimp/shops/supply/uploadFile.json', //供应商附件上传
	SUPPLIER_ADD: '/mng/api/pimp/shops/supply/add.json', //供应商新增接口
	SUPPLIER_UPDATE: '/mng/api/pimp/shops/supply/update.json', // 供应商修改接口
	FETCH_PURCHASE_LIST: '/mng/api/pimp/shops/purchaser/list.json', // 查询采购商列表
	PURCHASE_ADD: '/mng/api/pimp/shops/purchaser/add.json', //采购商新增接口
	PURCHASE_UPDATE: '/mng/api/pimp/shops/purchaser/update.json', //采购商修改接口
	PURCHASE_UPLOAD: '/mng/api/pimp/shops/purchaser/uploadFile.json', // 采购商 附件上传
	FETCH_SUPPLIER_IMAGES: '/mng/api/pimp/shops/picture/list.json', // 查询供应商资质信息图片接口
	FETCH_SUPPLIER_ACCOUNT: '/mng/api/pimp/setting/bankaccount/supplierList.json', // 查询供应商账户信息
	FETCH_SUPPLIER_ADD_IMAGES: '/mng/api/pimp/shops/picture/add.json', // 添加供应商资质信息图片接口
	FETCH_SUPPLIER_DELETE_IMAGES: '/mng/api/pimp/shops/picture/delete.json', // 删除供应商资质信息图片接口
	FETCH_PURCHASE_INVOICE: '/mng/api/pimp/setting/invoiceinformation/purchaserList.json', // 查询采购商发票信息
	FETCH_PURCHASE_DELIVERY: '/mng/api/pimp/shops/purchaser/delivery/list.json', // 查询采购商 收货地址
	
}
//商品类目
export const CATEGORY = {
	FETCH_COMMODITY_LIST: "/mng/api/pimp/product/catalog/query_all.json", //商品类目列表查询接口
	UPDATE_COMMODITY_TYPE: "/mng/api/pimp/product/catalog/update.json",   //商品类目更新接口
	ADD_COMMODITY_TYPE: "/mng/api/pimp/product/catalog/add.json",   //商品类目添加接口
	FETCH_COMMODITY_PARENT: "/mng/api/pimp/product/catalog/query_parent.json", //商品类目分级查询
	FETCH_ALL_COMMODITY: "/mng/api/pimp/purchaser/product/catalog/query_all.json", // 查询所有类目
}

//商品
export const COMMODITY = {
	FETCH_ALL_COMMODITY_BRAND: "/mng/api/pimp/product/brand/query.json",
	UPLOAD_ATTACHEMENT: "/mng/api/pimp/notice/attachment/uploadFile.json", //公告信息附件上传接口
	FETCH_LIST_ISREAD: "/mng/api/pimp/notice/update/read.json", //公告信息批量置为已读接口
	UPDATE_BRAND: "/mng/api/pimp/product/brand/update.json",//品牌更新
	CREARE_BRAND: "/mng/api/pimp/product/brand/add.json",//品牌添加
	DELETE_BRAND: "/mng/api/pimp/product/brand/delete.json",//品牌删除
	FETCH_ATTRIBUTE: '/mng/api/pimp/product/attribute/query.json', //商品属性列表
	FETCH_ATTRIBUTE_ADD: '/mng/api/pimp/product/attribute/add.json', //商品属性新增
	FETCH_ATTRIBUTE_UPDATE: '/mng/api/pimp/product/attribute/update.json', //商品属性修改
	FETCH_ATTRIBUTE_VALUE_UPDATE: '/mng/api/pimp/product/attribute_value/modifyBatch.json', // 商品属性值 批量修改
	FETCH_SPU_LIST: '/mng/api/pimp/product/spu/query.json', // 查询spu列表
	FETCH_SKU_LIST: '/mng/api/pimp/product/sku/query.json', // 查询sku列表
	SPU_CHANGE_ONSALE: '/mng/api/pimp/product/spu/updateOnSaleBatch.json', // spu 上下架
	SPU_FILE_UPLOAD: '/mng/api/pimp/product/spu/upload.json', // spu 图片上传
	SPU_ADD: '/mng/api/pimp/product/spu/add.json', // SPU新增
	SPU_UPATE: '/mng/api/pimp/product/spu/update.json', // SPU修改
	FETCH_ALL_SKU: '/mng/api/pimp/product/sku/query_all.json', // 查询spu下所有sku
	FETCH_ADD_SKU: '/mng/api/pimp/product/sku/add_batch.json', // 批量添加、更新sku
	SKU_CHANGE_STATUS: '/mng/api/pimp/product/sku/update_status.json', // sku 上下架
	FETCH_SKU_DATA: '/mng/api/pimp/product/sku/queryAllBySkuId.json', //查询单个sku所有信息
	UPDATE_SINGLE_SKU: "/mng/api/pimp/product/sku/update_sku.json", //单个SKU更新接口
	UPDATE_SUPPLIERS: '/mng/api/pimp/product/sku/add_supplier_batch.json', // 添加/修改供应商信息
	
	FETCH_ITEM_LIST: '/mng/api/pimp/purchaser/index/query.json', // 搜索页面查询商品列表
	FETCH_SEARCH_CATALOG: '/mng/api/pimp/purchaser/product/sku/queryCatalogByCommodityName.json', // 根据商品名称查询类目
	FETCH_ITEM_DETAIL: '/mng/api/pimp/purchaser/index/sku_info.json', // 商品详情
	ADD_CART: '/mng/api/pimp/purchaser/product/buycart/add.json', // 添加购物车
}
//订单
export const ORDER = {
  FETCH_ALL_ORDER: "/mng/api/pimp/purchaser/order/purchase/queryOrderByPage.json", // 采购商 订单列表 接口
  FETCH_ORDER_DETAIL: '/mng/api/pimp/purchaser/order/purchase/queryOrderCommodityInfoById.json', // 采购商 查询商品详情页[封装] 接口
  FETCH_TYPE_CODE: '/mng/api/pimp/platform/setting/dict/listByTypeCode.json', // 根据编码查询某些类型的参数
  CANCEL_ORDER: "/mng/api/pimp/purchaser/order/purchase/calcenOrderForPur.json",
  ADD_ORDER_PAY: '/mng/api/pimp/purchaser/order/pay/addPayRecord.json',
  CONFIRM_ORDER_RECEIVED: '/mng/api/pimp/purchaser/order/purchase/confirmReceived.json', // 采购商 订单确认收货 接口
  FETCH_ORDER_NUM: '/mng/api/pimp/purchaser/order/purchase/countOrderNumberByStatus.json', // 采购商 统计不同状态订单 接口
	FETCH_ORDER_AFTER_SALES: "/mng/api/pimp/purchaser/order/after/sale/list.json",//采购商 售后服务单查询列表
	
	FETCH_ALL_AFRER_SALES: "/mng/api/pimp/order/after/sale/list.json",
	AFRER_SALES_UPATE: "/mng/api/pimp/order/after/sale/update.json",
	FETCH_WAIT_ALLOCATE_ORDER: "/mng/api/pimp/platform/queryWaitAllocateOrderByPage.json",
	FETCH_UNALLOT_ORDER: "/mng/api/pimp/order/platform/queryWaitAllocateOrderByPage.json",
	FETCH_UNALLOTD_ORDER: "/mng/api/pimp/order/platform/queryOrderCommodityInfoById.json",
	UPDATE_ORDER: "/mng/api/pimp/order/platform/updateOrderPriceOrNumber.json",
	UPDATE_ORDER_CARRIAGE: "/mng/api/pimp/order/platform/updateOrderFreightCharge.json",
	ALLOT_ORDER: "/mng/api/pimp/order/platform/allocateOrder.json",
	
}

//结算
export const SETTLEMENT = {
	FETCH_ALL_SETTLEMENT: "/mng/api/pimp/purchaser/order/purchase/balanceOrder.json", //采购商 订单结算页面[封装] 接口
}

//财务
export const FINANCE = {
	FETCH_RECEIVED_LIST: "/mng/api/pimp/order/finance/list.json", //收款待确认订单列表查询接口
	FETCH_ALLORDERS_LIST: "/mng/api/pimp/order/platform/queryOrderCommodityByPage.json", //平台 全部订单 接口
	FETCH_SETTLEMENT_LIST: "/mng/api/pimp/order/finance/list_account.json", //结算待确认单列表查询接口
	FETCH_EXPORT_STATEMENT: "/mng/api/pimp/order/finance/export/statement.json", //导出结算单接口
	FETCH_CONFIRM_GATHERING: "/mng/api/pimp/order/finance/update.json", // 支付订单收款确认状态修改接口
	FETCH_COMMODITY_UPDATE: "/mng/api/pimp/order/finance/commdity/update.json", //修改子订单状态为已结算接口
	FETCH_CONFIRM_EXPORT: "/mng/api/pimp/order/finance/export/confirm.json", // 订单详情结算单确认接口
}


//平台银行账户页面
export const BANK = {
    // PLATFORM_BANK_LISTS:"/mng/api/pimp/purchaser/setting/bankaccount/list.json"//查询平台默认银行账户接口
    PLATFORM_BANK_LISTS:"/mng/api/pimp/purchaser/setting/bankaccount/platformList.json"//查询平台默认银行账户接口
}


//开票信息
export const Invoice={
    INVOICE_INFO:"/mng/api/pimp/purchaser/setting/invoiceinformation/purchaserList.json",//发票查询采购商接口
    ADD_INVOICE: '/mng/api/pimp/purchaser/setting/invoiceinformation/add.json', // 发票信息添加
    UPDATE_INVOICE: '/mng/api/pimp/purchaser/setting/invoiceinformation/update.json', // 发票信息修改
    SET_DEFAULT: '/mng/api/pimp/setting/bankaccount/update_default.json', // 设置默认账户
    PLATFORM_BANK_LISTS:"/mng/api/pimp/purchaser/setting/bankaccount/queryPlatformDefault.json"//查询平台默认银行账户接口
}

//购物车
export const CART = {
	 FETCH_BUYCART_LIST: "/mng/api/pimp/purchaser/product/buycart/queryAll.json",  //查询购物车中的商品
	 UPDATE_BUYCART_NUM: "/mng/api/pimp/purchaser/product/buycart/update.json" ,    //更新购物车中商品数量
	 DELETE_BUYCART_COMMODITY: "/mng/api/pimp/purchaser/product/buycart/delete.json", //删除购物车商品
	 FETCH_CART_NUM: '/mng/api/pimp/purchaser/product/buycart/queryCount.json', // 查询购物车商品数量
}


//收货地址
export const ADDRESS={
	FETCH_RECEIVE_LIST:"/mng/api/pimp/purchaser/shops/purchaser/delivery/list.json", //查询采购商收获地址
	ADD_ADDRESS:"/mng/api/pimp/purchaser/shops/purchaser/delivery/add.json",//收获地址添加
	DELETE_ADDRESS:"/mng/api/pimp/purchaser/shops/purchaser/delivery/delete.json",//删除收货地址
	// DELETE_ADDRESS:"/mng/api/pimp/purchaser/shops/purchaser/delete.json",//删除收货地址(测试用)
	SET_DEFAULT:"/mng/api/pimp/purchaser/shops/purchaser/delivery/updateDefaults.json",//设置默认地址
    UPDATE_ADDRESS:"/mng/api/pimp/purchaser/shops/purchaser/delivery/update.json",//更新收获地址
}