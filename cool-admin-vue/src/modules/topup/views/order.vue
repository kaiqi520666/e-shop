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
			<cl-table ref="Table">
				<template #slot-success="{ scope }">
					<el-button
						v-if="scope.row.status === 1"
						type="success"
						@click="success(scope.row)"
						>成功</el-button
					>
				</template>

				<template #slot-handle="{ scope }">
					<el-button
						v-if="scope.row.status === 0"
						type="primary"
						@click="handle(scope.row, 1)"
						>排队</el-button
					>
				</template>
				<template #slot-cancel="{ scope }">
					<el-button
						v-if="scope.row.status === 1"
						type="primary"
						@click="handle(scope.row, 0)"
						>取消</el-button
					>
				</template>
			</cl-table>
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
	name: 'topup-order'
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
		{ label: t('等待充值'), value: 0, type: 'info' },
		{ label: t('正在充值'), value: 1, type: 'warning' },
		{ label: t('充值成功'), value: 2, type: 'success' },
		{ label: t('订单取消'), value: 3, type: 'danger' }
	],
	category: [
		{ label: t('话费充值'), value: '1', color: '#17362f' },
		{ label: t('电费充值'), value: '2', color: '#46381d' },
		{ label: t('信用卡代还'), value: '3', color: '#312a4c' },
		{ label: t('度小满代还'), value: '4', color: '#21324c' }
	]
});

// 成功
async function success(row: any) {
	console.log(row);
	await service.topup.order.success({ id: row.id });
	refresh();
}
// 处理
async function handle(row: any, status: number) {
	await service.topup.order.update({
		id: row.id,
		status
	});
	refresh();
}
// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('选择用户'),
			prop: 'userId',
			component: { vm: UserSelect, props: { disabled: true } },
			required: true,
			span: 12
		},
		{
			label: t('订单号'),
			prop: 'orderNo',
			component: { name: 'el-input', props: { disabled: true } },
			span: 12,
			required: true
		},
		{
			label: t('USDT金额'),
			prop: 'usdtAmount',
			component: { name: 'el-input', props: { disabled: true } },
			span: 12,
			required: true
		},
		{
			label: t('RMB金额'),
			prop: 'rmbAmount',
			component: { name: 'el-input', props: { disabled: true } },
			span: 12,
			required: true
		},
		{
			label: t('订单状态'),
			prop: 'status',
			component: {
				name: 'el-radio-group',
				options: options.status,
				props: { disabled: true }
			},
			value: 0,
			required: true
		},
		{
			component: {
				name: 'cl-form-card',
				props: {
					label: t('话费充值'),
					expand: true
				}
			},
			hidden: ({ scope }) => {
				return scope.categoryId != '1';
			},
			children: [
				{
					label: t('姓名'),
					prop: 'name',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				},
				{
					label: t('手机号'),
					prop: 'phone',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				}
			]
		},
		{
			component: {
				name: 'cl-form-card',
				props: {
					label: t('电费充值'),
					expand: true
				}
			},
			hidden: ({ scope }) => {
				return scope.categoryId != '2';
			},
			children: [
				{
					label: t('详细地址'),
					prop: 'address',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				},
				{
					label: t('户号'),
					prop: 'accountNo',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				}
			]
		},
		{
			component: {
				name: 'cl-form-card',
				props: {
					label: t('信用卡代还'),
					expand: true
				}
			},
			hidden: ({ scope }) => {
				return scope.categoryId != '3';
			},
			children: [
				{
					label: t('银行'),
					prop: 'bank',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				},
				{
					label: t('支行'),
					prop: 'branch',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				},
				{
					label: t('卡号'),
					prop: 'cardNo',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				}
			]
		},
		{
			component: {
				name: 'cl-form-card',
				props: {
					label: t('度小满代还'),
					expand: true
				}
			},
			hidden: ({ scope }) => {
				return scope.categoryId != '4';
			},
			children: [
				{
					label: t('姓名'),
					prop: 'name',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				},
				{
					label: t('身份证号'),
					prop: 'idCard',
					component: { name: 'el-input', props: { clearable: true } },
					span: 12
				}
			]
		},
		{
			label: t('TG'),
			prop: 'tg',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},

		{
			label: t('折扣'),
			prop: 'discount',
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
		{
			label: t('分类名称'),
			prop: 'categoryId',
			minWidth: 120,
			dict: options.category
		},
		{ label: t('订单号'), prop: 'orderNo', minWidth: 120 },
		{ label: t('USDT金额'), prop: 'usdtAmount', minWidth: 120 },
		{ label: t('RMB金额'), prop: 'rmbAmount', minWidth: 120 },
		{
			label: t('订单状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},

		{ label: t('折扣'), prop: 'discount', minWidth: 120 },
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
		{
			type: 'op',
			buttons: ['info', 'slot-success', 'slot-handle', 'slot-cancel'],
			width: 280
		}
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.topup.order
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
