<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 条件搜索 -->
			<cl-search ref="Search" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'shop-goods'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useDict } from '/$/dict';
import { useI18n } from 'vue-i18n';
import { reactive, ref, onMounted } from 'vue';

const { service } = useCool();
const { t } = useI18n();
const { dict } = useDict();
const usdtRate = ref(0);

// 分类列表
const categoryList = ref<any[]>([]);
// 选项
const options = reactive({
	status: [
		{ label: t('下架'), value: 0, type: 'danger' },
		{ label: t('上架'), value: 1, type: 'success' }
	]
});

// 获取分类列表
async function getCategoryList() {
	try {
		const res = await service.shop.category.list();
		console.log(res);
		if (res.length > 0) {
			// 转换为树形结构
			categoryList.value = buildTree(res);
		}
	} catch (error) {
		console.error(error);
	}
}

// 构建树形结构
function buildTree(list: any[]): any[] {
	const map: any = {};
	const roots: any[] = [];

	// 先创建所有节点的映射
	list.forEach(item => {
		map[item.id] = {
			label: item.name,
			value: item.id,
			children: []
		};
	});

	// 遍历构建树形结构
	list.forEach(item => {
		if (item.parentId && map[item.parentId]) {
			// 有父节点，加入父节点的 children
			map[item.parentId].children.push(map[item.id]);
		} else {
			// 没有父节点，作为根节点
			roots.push(map[item.id]);
		}
	});

	return roots;
}
onMounted(() => {
	getCategoryList();
	getAppConfigList();
});

async function getAppConfigList() {
	try {
		const res = await service.app.config.list();
		usdtRate.value = Number(res.find(item => item.cKey === 'usdt_rate')?.cValue) || 0;
	} catch (error) {
		console.error(error);
	}
}

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('商品名称'),
			prop: 'name',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('主图URL'),
			prop: 'image',
			component: {
				name: 'cl-upload',
				props: {
					text: t('选择图片')
				}
			},
			required: true,
			span: 12
		},
		{
			label: t('轮播图URL'),
			prop: 'images',
			component: {
				name: 'cl-upload',
				props: {
					multiple: true,
					text: t('选择图片')
				}
			},
			required: true,
			span: 12
		},
		{
			label: t('选择分类（叶子分类）'),
			prop: 'categoryId',
			component: {
				name: 'cl-select',
				props: {
					tree: true,
					options: categoryList
				}
			},
			span: 12,
			required: true
		},
		{
			label: t('人民币价格'),
			prop: 'priceRMB',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('库存'),
			prop: 'stock',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('状态'),
			prop: 'status',
			component: { name: 'el-radio-group', options: options.status },
			value: 1,
			required: true
		},
		{
			label: t('标签'),
			prop: 'tags',
			component: {
				name: 'cl-select',
				props: {
					multiple: true,
					filterable: true,
					clearable: true,
					tree: true,
					checkStrictly: true,
					options: dict.get('goods_tag')
				}
			},
			required: true,
			span: 12
		},
		{
			label: t('商品描述'),
			prop: 'description',
			component: { name: 'cl-editor-wang', props: { clearable: true } },
			span: 24
		},

		{
			label: t('排序'),
			prop: 'sort',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		}
	],
	async onInfo(data, { next, done }) {
		const newData = await next({
			...data,
			tags: data.tags.split(',')
		});
		done({
			...newData,
			tags: newData.tags.split(',')
		});
	},
	onSubmit(data, { next, done }) {
		next({
			...data,
			tags: data.tags.join(',')
		});
		done();
	}
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('分类名称'), prop: 'categoryName', minWidth: 120 },
		{ label: t('商品名称'), prop: 'name', minWidth: 120 },
		// { label: t('分类ID（叶子分类）'), prop: 'categoryId', minWidth: 120 },
		{ label: t('人民币价格'), prop: 'priceRMB', minWidth: 120 },
		{
			label: t('USDT价格'),
			prop: 'priceUSDT',
			minWidth: 120,
			formatter: (row: any) => {
				return Number(row.priceRMB / usdtRate.value).toFixed(4);
			}
		},
		{ label: t('库存'), prop: 'stock', minWidth: 120 },
		{
			label: t('状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{ label: t('标签，逗号分隔'), prop: 'tags', minWidth: 120 },
		// { label: t('商品描述'), prop: 'description', minWidth: 120 },
		{
			label: t('主图URL'),
			prop: 'image',
			minWidth: 120,
			component: { name: 'cl-image', props: { size: 32 } }
		},
		{
			label: t('轮播图URL'),
			prop: 'images',
			minWidth: 120,
			component: { name: 'cl-image', props: { size: 32 } }
		},
		{ label: t('排序'), prop: 'sort', minWidth: 120 },
		{
			label: t('创建时间'),
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			component: { name: 'cl-date-text' }
		},
		{
			label: t('更新时间'),
			prop: 'updateTime',
			minWidth: 170,
			sortable: 'custom',
			component: { name: 'cl-date-text' }
		},
		{ type: 'op', buttons: ['edit', 'delete'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.shop.goods
	},
	app => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
