<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
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
	name: 'user-walletlog'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import UserSelect from '/$/user/components/user-select.vue';

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	type: [
		{ label: t('充值'), value: 0 },
		{ label: t('提现'), value: 1 },
		{ label: t('下单'), value: 2 },
		{ label: t('佣金'), value: 3 }
	]
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('选择用户'),
			prop: 'userId',
			component: { vm: UserSelect },
			required: true
		},
		{
			label: t('金额'),
			prop: 'amount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('类型'),
			prop: 'type',
			component: { name: 'el-radio-group', options: options.type },
			required: true
		},
		{
			label: t('描述'),
			prop: 'description',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('选择订单'),
			prop: 'orderId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('选择来源用户'),
			prop: 'fromUserId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('用户名'), prop: 'username', minWidth: 120 },
		{ label: t('金额'), prop: 'amount', minWidth: 120 },
		{ label: t('类型'), prop: 'type', minWidth: 120, dict: options.type },
		{ label: t('描述'), prop: 'description', minWidth: 120 },
		{ label: t('订单ID'), prop: 'orderId', minWidth: 120 },
		{ label: t('来源用户ID'), prop: 'fromUserId', minWidth: 120 },
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
		}
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.user.walletlog
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
