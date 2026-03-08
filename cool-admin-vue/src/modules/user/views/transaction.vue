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
	name: 'user-transaction'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { h, reactive } from 'vue';

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	type: [
		{ label: t('充值'), value: 0, type: 'success' },
		{ label: t('提现'), value: 1, type: 'danger' },
		{ label: t('下单'), value: 2, type: 'warning' },
		{ label: t('佣金'), value: 3, type: 'info' }
	],
	status: [
		{ label: t('处理中'), value: 0, type: 'warning' },
		{ label: t('成功'), value: 1, type: 'success' },
		{ label: t('失败'), value: 2, type: 'danger' }
	]
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('类型'),
			prop: 'type',
			component: { name: 'el-radio-group', options: options.type },
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
			label: t('变动前余额'),
			prop: 'balanceBefore',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('变动后余额'),
			prop: 'balanceAfter',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('选择关联订单'),
			prop: 'orderId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('备注'),
			prop: 'remark',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
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
		{ label: t('#'), type: 'index' },
		{ label: t('用户'), prop: 'username', minWidth: 120 },
		{ label: t('类型'), prop: 'type', minWidth: 120, dict: options.type },

		{
			label: t('变动前余额'),
			prop: 'balanceBefore',
			minWidth: 120
		},
		{
			label: t('金额'),
			prop: 'amount',
			minWidth: 120,
			render: (row: any) => {
				const bg = Number(row.amount) > 0 ? '#67c23a' : '#f56c6c';
				return h(
					'span',
					{
						style: {
							backgroundColor: bg,
							color: '#fff',
							padding: '4px 8px',
							borderRadius: '4px'
						}
					},
					row.amount
				);
			}
		},
		{ label: t('变动后余额'), prop: 'balanceAfter', minWidth: 120 },
		{ label: t('关联订单ID'), prop: 'orderId', minWidth: 120 },
		{ label: t('备注'), prop: 'remark', minWidth: 120 },
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
		}
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.user.transaction
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
