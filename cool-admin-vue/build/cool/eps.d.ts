declare namespace Eps {
	interface AppConfigEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 配置键
		 */
		cKey?: string;

		/**
		 * 配置值
		 */
		cValue?: string;

		/**
		 * 配置名称
		 */
		cName?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysDepartmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门名称
		 */
		name?: string;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 上级部门ID
		 */
		parentId?: number;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 行为
		 */
		action?: string;

		/**
		 * ip
		 */
		ip?: string;

		/**
		 * 参数
		 */
		params?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父菜单ID
		 */
		parentId?: number;

		/**
		 * 菜单名称
		 */
		name?: string;

		/**
		 * 菜单地址
		 */
		router?: string;

		/**
		 * 权限标识
		 */
		perms?: string;

		/**
		 * 类型 0-目录 1-菜单 2-按钮
		 */
		type?: number;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 视图地址
		 */
		viewPath?: string;

		/**
		 * 路由缓存
		 */
		keepAlive?: boolean;

		/**
		 * 是否显示
		 */
		isShow?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 键
		 */
		keyName?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 数据类型 0-字符串 1-富文本 2-文件
		 */
		dataType?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 角色标签
		 */
		label?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 数据权限是否关联上下级
		 */
		relevance?: boolean;

		/**
		 * 菜单权限
		 */
		menuIdList?: any;

		/**
		 * 部门权限
		 */
		departmentIdList?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门ID
		 */
		departmentId?: number;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 密码版本, 作用是改完密码，让原来的token失效
		 */
		passwordV?: number;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 头像
		 */
		headImg?: string;

		/**
		 * 手机
		 */
		phone?: string;

		/**
		 * 邮箱
		 */
		email?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * socketId
		 */
		socketId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 分类
		 */
		type?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 示例图
		 */
		exampleImages?: any;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类型ID
		 */
		typeId?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 值
		 */
		value?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 父ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 标识
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface NoticeNewsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * Key名
		 */
		keyName?: string;

		/**
		 * Hook
		 */
		hook?: string;

		/**
		 * 描述
		 */
		readme?: string;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * Logo(base64)
		 */
		logo?: string;

		/**
		 * 作者
		 */
		author?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * 内容
		 */
		content?: any;

		/**
		 * ts内容
		 */
		tsContent?: any;

		/**
		 * 插件的plugin.json
		 */
		pluginJson?: any;

		/**
		 * 配置
		 */
		config?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 表
		 */
		entityInfo?: any;

		/**
		 * 操作人
		 */
		userId?: number;

		/**
		 * 被删除的数据
		 */
		data?: any;

		/**
		 * 请求的接口
		 */
		url?: string;

		/**
		 * 请求参数
		 */
		params?: any;

		/**
		 * 删除数据条数
		 */
		count?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShopBannerEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 图片URL
		 */
		image?: string;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 链接
		 */
		link?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShopCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 分类关键词
		 */
		keyword?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 分类图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShopGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商品名称
		 */
		name?: string;

		/**
		 * 分类ID（叶子分类）
		 */
		categoryId?: number;

		/**
		 * 人民币价格
		 */
		priceRMB?: number;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 标签，逗号分隔
		 */
		tags?: string;

		/**
		 * 商品描述
		 */
		description?: string;

		/**
		 * 主图URL
		 */
		image?: string;

		/**
		 * 轮播图URL
		 */
		images?: any;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 分类名称
		 */
		categoryName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShopOrderEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * 订单总金额(USDT)
		 */
		totalUSDT?: number;

		/**
		 * 订单状态
		 */
		status?: number;

		/**
		 * 收货地址
		 */
		address?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 收货人
		 */
		contact?: string;

		/**
		 * 支付方式
		 */
		payType?: number;

		/**
		 * Epusdt交易号
		 */
		tradeId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShopOrderItemEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: BigInt;

		/**
		 * 商品ID
		 */
		productId?: BigInt;

		/**
		 * 商品名称
		 */
		productName?: string;

		/**
		 * 商品图片
		 */
		productImage?: string;

		/**
		 * 购买单价(USDT)
		 */
		priceUSDT?: number;

		/**
		 * 购买数量
		 */
		quantity?: number;

		/**
		 * 小计金额(USDT)
		 */
		subtotalUSDT?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ShopReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商品ID
		 */
		goodsId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 评分 1-5
		 */
		rating?: number;

		/**
		 * 评价内容
		 */
		content?: string;

		/**
		 * 图片
		 */
		images?: string;

		/**
		 * 点赞数
		 */
		likeCount?: number;

		/**
		 * 状态 1-显示 0-隐藏
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 商品名称
		 */
		goodsName?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址
		 */
		url?: string;

		/**
		 * 类型
		 */
		type?: string;

		/**
		 * 分类ID
		 */
		classifyId?: number;

		/**
		 * 文件id
		 */
		fileId?: string;

		/**
		 * 文件名
		 */
		name?: string;

		/**
		 * 文件大小
		 */
		size?: number;

		/**
		 * 文档版本
		 */
		version?: number;

		/**
		 * 文件位置
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类别名称
		 */
		name?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 任务ID
		 */
		jobId?: string;

		/**
		 * 任务配置
		 */
		repeatConf?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * cron
		 */
		cron?: string;

		/**
		 * 最大执行次数 不传为无限次
		 */
		limit?: number;

		/**
		 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
		 */
		every?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-停止 1-运行
		 */
		status?: number;

		/**
		 * 开始时间
		 */
		startDate?: Date;

		/**
		 * 结束时间
		 */
		endDate?: Date;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 执行的service实例ID
		 */
		service?: string;

		/**
		 * 状态 0-系统 1-用户
		 */
		type?: number;

		/**
		 * 下一次执行时间
		 */
		nextRunTime?: Date;

		/**
		 * 状态 0-cron 1-时间间隔
		 */
		taskType?: number;

		/**
		 * undefined
		 */
		lastExecuteTime?: Date;

		/**
		 * undefined
		 */
		lockExpireTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TopupBannerEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 图片URL
		 */
		image?: string;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 链接
		 */
		link?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TopupCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 分类关键词
		 */
		keyword?: string;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 折扣
		 */
		discount?: number;

		/**
		 * 分类图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TopupNoticeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 摘要
		 */
		summary?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TopupOrderEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * USDT金额
		 */
		usdtAmount?: number;

		/**
		 * RMB金额
		 */
		rmbAmount?: number;

		/**
		 * 订单状态
		 */
		status?: number;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 银行
		 */
		bank?: string;

		/**
		 * 支行
		 */
		branch?: string;

		/**
		 * 卡号
		 */
		cardNo?: string;

		/**
		 * TG
		 */
		tg?: string;

		/**
		 * 身份证号
		 */
		idCard?: string;

		/**
		 * 详细地址
		 */
		address?: string;

		/**
		 * 分类ID
		 */
		categoryId?: BigInt;

		/**
		 * 户号
		 */
		accountNo?: string;

		/**
		 * 折扣
		 */
		discount?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 分类名称
		 */
		categoryName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TopupRechargeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * Epusdt交易号
		 */
		tradeId?: string;

		/**
		 * 金额
		 */
		amount?: number;

		/**
		 * 实际金额
		 */
		actualAmount?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * Token
		 */
		token?: string;

		/**
		 * 过期时间
		 */
		expirationTime?: BigInt;

		/**
		 * 支付URL
		 */
		paymentUrl?: string;

		/**
		 * 区块交易ID
		 */
		blockTransactionId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TopupWithdrawEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 订单号
		 */
		orderNo?: string;

		/**
		 * 金额
		 */
		amount?: number;

		/**
		 * 实际金额
		 */
		actualAmount?: number;

		/**
		 * 手续费
		 */
		fee?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 提现地址
		 */
		address?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 联系人
		 */
		contact?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 是否默认
		 */
		isDefault?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserCommissionEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: BigInt;

		/**
		 * 受益代理ID
		 */
		agentId?: BigInt;

		/**
		 * 消费用户ID
		 */
		userId?: BigInt;

		/**
		 * 订单金额
		 */
		orderAmount?: number;

		/**
		 * 分成比例
		 */
		rate?: number;

		/**
		 * 分成金额
		 */
		amount?: number;

		/**
		 * 距消费者层级数
		 */
		depth?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 头像
		 */
		avatarUrl?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 邀请码
		 */
		inviteCode?: string;

		/**
		 * 直属上级ID
		 */
		parentId?: BigInt;

		/**
		 * 祖先链
		 */
		ancestorPath?: string;

		/**
		 * 分成比例
		 */
		commissionRate?: number;

		/**
		 * 可用余额
		 */
		balance?: number;

		/**
		 * 冻结金额
		 */
		frozen?: number;

		/**
		 * 累计收入
		 */
		totalIncome?: number;

		/**
		 * TRC20钱包地址
		 */
		walletAddress?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserRechargeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 充值金额
		 */
		amount?: number;

		/**
		 * 实际充值金额
		 */
		actualAmount?: number;

		/**
		 * 充值订单号
		 */
		orderNo?: string;

		/**
		 * Epusdt交易号
		 */
		tradeId?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserTransactionEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 类型
		 */
		type?: number;

		/**
		 * 金额（正数=收入 负数=支出）
		 */
		amount?: number;

		/**
		 * 变动前余额
		 */
		balanceBefore?: number;

		/**
		 * 变动后余额
		 */
		balanceAfter?: number;

		/**
		 * 关联订单ID
		 */
		orderId?: BigInt;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserWalletLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 金额
		 */
		amount?: number;

		/**
		 * 类型
		 */
		type?: number;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 订单ID
		 */
		orderId?: BigInt;

		/**
		 * 来源用户ID
		 */
		fromUserId?: BigInt;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserWithdrawEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: BigInt;

		/**
		 * 提现金额
		 */
		amount?: number;

		/**
		 * USDT钱包地址
		 */
		walletAddress?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 备注/拒绝原因
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	type json = any;

	type DictKey = "brand" | "occupation" | "goods_tag";

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface AppConfigPageResponse {
		pagination: PagePagination;
		list: AppConfigEntity[];
	}

	interface BaseSysLogPageResponse {
		pagination: PagePagination;
		list: BaseSysLogEntity[];
	}

	interface BaseSysMenuPageResponse {
		pagination: PagePagination;
		list: BaseSysMenuEntity[];
	}

	interface BaseSysParamPageResponse {
		pagination: PagePagination;
		list: BaseSysParamEntity[];
	}

	interface BaseSysRolePageResponse {
		pagination: PagePagination;
		list: BaseSysRoleEntity[];
	}

	interface BaseSysUserPageResponse {
		pagination: PagePagination;
		list: BaseSysUserEntity[];
	}

	interface DemoGoodsPageResponse {
		pagination: PagePagination;
		list: DemoGoodsEntity[];
	}

	interface DictInfoPageResponse {
		pagination: PagePagination;
		list: DictInfoEntity[];
	}

	interface DictTypePageResponse {
		pagination: PagePagination;
		list: DictTypeEntity[];
	}

	interface NoticeNewsPageResponse {
		pagination: PagePagination;
		list: NoticeNewsEntity[];
	}

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: RecycleDataEntity[];
	}

	interface ShopBannerPageResponse {
		pagination: PagePagination;
		list: ShopBannerEntity[];
	}

	interface ShopCategoryPageResponse {
		pagination: PagePagination;
		list: ShopCategoryEntity[];
	}

	interface ShopGoodsPageResponse {
		pagination: PagePagination;
		list: ShopGoodsEntity[];
	}

	interface ShopOrderPageResponse {
		pagination: PagePagination;
		list: ShopOrderEntity[];
	}

	interface ShopOrderItemPageResponse {
		pagination: PagePagination;
		list: ShopOrderItemEntity[];
	}

	interface ShopReviewPageResponse {
		pagination: PagePagination;
		list: ShopReviewEntity[];
	}

	interface SpaceInfoPageResponse {
		pagination: PagePagination;
		list: SpaceInfoEntity[];
	}

	interface SpaceTypePageResponse {
		pagination: PagePagination;
		list: SpaceTypeEntity[];
	}

	interface TaskInfoPageResponse {
		pagination: PagePagination;
		list: TaskInfoEntity[];
	}

	interface TopupCategoryPageResponse {
		pagination: PagePagination;
		list: TopupCategoryEntity[];
	}

	interface TopupOrderPageResponse {
		pagination: PagePagination;
		list: TopupOrderEntity[];
	}

	interface TopupRechargePageResponse {
		pagination: PagePagination;
		list: TopupRechargeEntity[];
	}

	interface TopupWithdrawPageResponse {
		pagination: PagePagination;
		list: TopupWithdrawEntity[];
	}

	interface TopupNoticePageResponse {
		pagination: PagePagination;
		list: TopupNoticeEntity[];
	}

	interface TopupBannerPageResponse {
		pagination: PagePagination;
		list: TopupBannerEntity[];
	}

	interface UserAddressPageResponse {
		pagination: PagePagination;
		list: UserAddressEntity[];
	}

	interface UserCommissionPageResponse {
		pagination: PagePagination;
		list: UserCommissionEntity[];
	}

	interface UserInfoPageResponse {
		pagination: PagePagination;
		list: UserInfoEntity[];
	}

	interface UserRechargePageResponse {
		pagination: PagePagination;
		list: UserRechargeEntity[];
	}

	interface UserTransactionPageResponse {
		pagination: PagePagination;
		list: UserTransactionEntity[];
	}

	interface UserWalletlogPageResponse {
		pagination: PagePagination;
		list: UserWalletLogEntity[];
	}

	interface UserWithdrawPageResponse {
		pagination: PagePagination;
		list: UserWithdrawEntity[];
	}

	interface AppConfig {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<AppConfigEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<AppConfigEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<AppConfigPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseCoding {
		/**
		 * 获取模块目录结构
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * 创建代码
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { getModuleTree: string; createCode: string };

		/**
		 * 权限状态
		 */
		_permission: { getModuleTree: boolean; createCode: boolean };

		request: Request;
	}

	interface BaseComm {
		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * 文件上传模式
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * 权限与菜单
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * 编程
		 */
		program(data?: any): Promise<any>;

		/**
		 * 个人信息
		 */
		person(data?: any): Promise<any>;

		/**
		 * 文件上传
		 */
		upload(data?: any): Promise<any>;

		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			program: string;
			person: string;
			upload: string;
			logout: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			program: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};

		request: Request;
	}

	interface BaseOpen {
		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};

		request: Request;
	}

	interface BaseSysDepartment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; order: string; list: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysLog {
		/**
		 * 日志保存时间
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * 获得日志保存时间
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * 清理
		 */
		clear(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysLogPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };

		request: Request;
	}

	interface BaseSysMenu {
		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;

		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;

		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysParam {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			info: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysRole {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysUser {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			move: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DemoGoodsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoTenant {
		/**
		 * 局部不使用多租户
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * 不使用多租户
		 */
		noUse(data?: any): Promise<any>;

		/**
		 * use
		 */
		use(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { noTenant: string; noUse: string; use: string };

		/**
		 * 权限状态
		 */
		_permission: { noTenant: boolean; noUse: boolean; use: boolean };

		request: Request;
	}

	interface DictInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得所有字典类型
		 */
		types(data?: any): Promise<any>;

		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			types: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			types: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DictType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface NoticeNews {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<NoticeNewsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<NoticeNewsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<NoticeNewsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PluginInfo {
		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RecycleData {
		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<RecycleDataPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };

		request: Request;
	}

	interface ShopBanner {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShopBannerEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShopBannerEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShopBannerPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ShopCategory {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShopCategoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShopCategoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShopCategoryPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ShopGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShopGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShopGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShopGoodsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ShopOrder {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShopOrderEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShopOrderEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShopOrderPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ShopOrderItem {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShopOrderItemEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShopOrderItemEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShopOrderItemPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ShopReview {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ShopReviewEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ShopReviewEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ShopReviewPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TaskInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 开始
		 */
		start(data?: any): Promise<any>;

		/**
		 * 执行一次
		 */
		once(data?: any): Promise<any>;

		/**
		 * 停止
		 */
		stop(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * 日志
		 */
		log(data?: any): Promise<any>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			start: string;
			once: string;
			stop: string;
			info: string;
			page: string;
			log: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TopupCategory {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TopupCategoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TopupCategoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TopupCategoryPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TopupOrder {
		/**
		 * success
		 */
		success(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TopupOrderEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TopupOrderEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TopupOrderPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			success: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			success: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TopupRecharge {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TopupRechargeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TopupRechargeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TopupRechargePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; info: string; list: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
		};

		request: Request;
	}

	interface TopupWithdraw {
		/**
		 * success
		 */
		success(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * cancel
		 */
		cancel(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TopupWithdrawPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TopupWithdrawEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TopupWithdrawEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			success: string;
			delete: string;
			cancel: string;
			page: string;
			list: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			success: boolean;
			delete: boolean;
			cancel: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface TopupNotice {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TopupNoticeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TopupNoticeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TopupNoticePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TopupBanner {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TopupBannerEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TopupBannerEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TopupBannerPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserAddress {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserCommission {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserCommissionEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserCommissionEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserCommissionPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserRecharge {
		/**
		 * adminList
		 */
		adminList(data?: any): Promise<any>;

		/**
		 * 确认充值成功
		 */
		complete(data?: any): Promise<any>;

		/**
		 * 标记为超时
		 */
		timeout(data?: any): Promise<any>;

		/**
		 * 充值列表
		 */
		list(data?: any): Promise<UserRechargeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserRechargePageResponse>;

		/**
		 * 权限标识
		 */
		permission: {
			adminList: string;
			complete: string;
			timeout: string;
			list: string;
			page: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			adminList: boolean;
			complete: boolean;
			timeout: boolean;
			list: boolean;
			page: boolean;
		};

		request: Request;
	}

	interface UserTransaction {
		/**
		 * adminGetList
		 */
		adminGetList(data?: any): Promise<any>;

		/**
		 * 获取交易记录列表
		 */
		getList(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserTransactionPageResponse>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserTransactionEntity[]>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserTransactionEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			adminGetList: string;
			getList: string;
			page: string;
			list: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			adminGetList: boolean;
			getList: boolean;
			page: boolean;
			list: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface UserWalletlog {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserWalletLogEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserWalletLogEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserWalletlogPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserWithdraw {
		/**
		 * adminList
		 */
		adminList(data?: any): Promise<any>;

		/**
		 * 完成打款
		 */
		complete(data?: any): Promise<any>;

		/**
		 * 审核拒绝
		 */
		reject(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 提现列表
		 */
		list(data?: any): Promise<UserWithdrawEntity[]>;

		/**
		 * 审核通过
		 */
		pass(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserWithdrawPageResponse>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserWithdrawEntity>;

		/**
		 * 权限标识
		 */
		permission: {
			adminList: string;
			complete: string;
			reject: string;
			delete: string;
			list: string;
			pass: string;
			page: string;
			info: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			adminList: boolean;
			complete: boolean;
			reject: boolean;
			delete: boolean;
			list: boolean;
			pass: boolean;
			page: boolean;
			info: boolean;
		};

		request: Request;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

	type Service = {
		request: Request;

		app: { config: AppConfig };
		base: {
			coding: BaseCoding;
			comm: BaseComm;
			open: BaseOpen;
			sys: {
				department: BaseSysDepartment;
				log: BaseSysLog;
				menu: BaseSysMenu;
				param: BaseSysParam;
				role: BaseSysRole;
				user: BaseSysUser;
			};
		};
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { info: DictInfo; type: DictType };
		notice: { news: NoticeNews };
		plugin: { info: PluginInfo };
		recycle: { data: RecycleData };
		shop: {
			banner: ShopBanner;
			category: ShopCategory;
			goods: ShopGoods;
			order: ShopOrder;
			orderItem: ShopOrderItem;
			review: ShopReview;
		};
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		topup: {
			category: TopupCategory;
			order: TopupOrder;
			recharge: TopupRecharge;
			withdraw: TopupWithdraw;
			notice: TopupNotice;
			banner: TopupBanner;
		};
		user: {
			address: UserAddress;
			commission: UserCommission;
			info: UserInfo;
			recharge: UserRecharge;
			transaction: UserTransaction;
			walletlog: UserWalletlog;
			withdraw: UserWithdraw;
		};
	};
}
