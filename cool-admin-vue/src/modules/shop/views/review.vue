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
	name: 'shop-review'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive, onMounted, ref } from 'vue';
import UserSelect from '/$/user/components/user-select.vue';

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	status: [
		{ label: t('隐藏'), value: 0, type: 'danger' },
		{ label: t('显示'), value: 1, type: 'success' }
	]
});
const goodsList = ref<any[]>([]);
// 获取商品列表
async function getGoodsList() {
	try {
		const res = await service.shop.goods.list();
		console.log(res);
		if (res.length > 0) {
			goodsList.value = res.map(item => ({
				label: item.name,
				value: item.id
			}));
		}
	} catch (error) {
		console.error(error);
	}
}

onMounted(() => {
	getGoodsList();
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('选择商品'),
			prop: 'goodsId',
			component: {
				name: 'cl-select',
				props: {
					filterable: true,
					clearable: true,
					options: goodsList
				}
			},
			span: 12,
			required: true
		},
		{
			label: t('选择用户'),
			prop: 'userId',
			component: { vm: UserSelect },
			required: true
		},
		{
			label: t('评分'),
			prop: 'rating',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('评价内容'),
			prop: 'content',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('图片'),
			prop: 'images',
			component: {
				name: 'cl-upload',
				props: {
					text: t('选择图片')
				}
			},
			span: 12
		},
		{
			label: t('点赞数'),
			prop: 'likeCount',
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
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('用户名'), prop: 'username', minWidth: 120 },
		{ label: t('商品名称'), prop: 'goodsName', minWidth: 120 },
		// { label: t('商品ID'), prop: 'goodsId', minWidth: 120 },
		{ label: t('评分'), prop: 'rating', minWidth: 120 },
		{ label: t('评价内容'), prop: 'content', minWidth: 120 },
		{
			label: t('图片'),
			prop: 'images',
			minWidth: 120,
			component: { name: 'cl-image', props: { size: 32 } }
		},
		{ label: t('点赞数'), prop: 'likeCount', minWidth: 120 },
		{ label: t('状态'), prop: 'status', minWidth: 120, dict: options.status },
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
		service: service.shop.review
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
