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
	name: 'user-commission'
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
	status: [
		{ label: t('待结算'), value: 0, type: 'default' },
		{ label: t('已结算'), value: 1, type: 'success' }
	]
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('选择订单'),
			prop: 'orderId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('选择受益代理'),
			prop: 'agentId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('选择消费用户'),
			prop: 'userId',
			component: { vm: UserSelect },
			required: true
		},
		{
			label: t('订单金额'),
			prop: 'orderAmount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('分成比例'),
			prop: 'rate',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('分成金额'),
			prop: 'amount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('距消费者层级数'),
			prop: 'depth',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('状态'),
			prop: 'status',
			component: { name: 'el-radio-group', options: options.status },
			value: 0,
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('订单ID'), prop: 'orderId', minWidth: 120 },
		{ label: t('用户名'), prop: 'username', minWidth: 120 },
		{ label: t('受益代理ID'), prop: 'agentId', minWidth: 120 },
		{ label: t('订单金额'), prop: 'orderAmount', minWidth: 120 },
		{ label: t('分成比例'), prop: 'rate', minWidth: 120 },
		{ label: t('分成金额'), prop: 'amount', minWidth: 120 },
		{ label: t('距消费者层级数'), prop: 'depth', minWidth: 120 },
		{
			label: t('状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
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
		service: service.user.commission
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
