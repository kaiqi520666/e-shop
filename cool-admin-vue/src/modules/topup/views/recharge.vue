<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

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
	name: 'topup-recharge'
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
		{ label: t('待支付'), value: 0, type: 'info' },
		{ label: t('已支付'), value: 1, type: 'success' },
		{ label: t('已超时'), value: 2, type: 'danger' }
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
			label: t('订单号'),
			prop: 'orderNo',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('交易号'),
			prop: 'tradeId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('RMB金额'),
			prop: 'amount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('USDT金额'),
			prop: 'actualAmount',
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
		},
		{
			label: t('Token'),
			prop: 'token',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},

		{
			label: t('支付URL'),
			prop: 'paymentUrl',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('选择区块交易'),
			prop: 'blockTransactionId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('用户名'), prop: 'username', minWidth: 80 },
		{ label: t('订单号'), prop: 'orderNo', minWidth: 120 },
		{ label: t('交易号'), prop: 'tradeId', minWidth: 180 },
		{ label: t('RMB金额'), prop: 'amount', minWidth: 120 },
		{ label: t('USDT金额'), prop: 'actualAmount', minWidth: 120 },
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
		{ type: 'op', buttons: ['delete', 'info'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.topup.recharge
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
