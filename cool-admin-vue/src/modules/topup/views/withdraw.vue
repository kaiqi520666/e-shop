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
			<cl-table ref="Table">
				<template #slot-cancel="{ scope }">
					<el-button
						v-if="scope.row.status === 0"
						type="danger"
						@click="handleCancel(scope.row)"
						>取消</el-button
					>
				</template>
				<template #slot-success="{ scope }">
					<el-button
						v-if="scope.row.status === 0"
						type="success"
						@click="handleSuccess(scope.row)"
						>成功</el-button
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
	name: 'topup-withdraw'
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
		{ label: t('待处理'), value: 0, type: 'warning' },
		{ label: t('已处理'), value: 1, type: 'success' },
		{ label: t('已取消'), value: 2, type: 'danger' }
	]
});

// 取消
async function handleCancel(row: any) {
	await service.topup.withdraw.cancel({ orderNo: row.orderNo });
	refresh();
}

// 成功
async function handleSuccess(row: any) {
	await service.topup.withdraw.success({ orderNo: row.orderNo });
	refresh();
}
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
			label: t('金额'),
			prop: 'amount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('实际金额'),
			prop: 'actualAmount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('手续费'),
			prop: 'fee',
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
			label: t('备注'),
			prop: 'remark',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('提现地址'),
			prop: 'address',
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
		{ label: t('订单号'), prop: 'orderNo', minWidth: 120 },
		{ label: t('金额'), prop: 'amount', minWidth: 120 },
		{ label: t('实际金额'), prop: 'actualAmount', minWidth: 120 },
		{ label: t('手续费'), prop: 'fee', minWidth: 120 },
		{
			label: t('状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{ label: t('备注'), prop: 'remark', minWidth: 120 },
		{ label: t('提现地址'), prop: 'address', minWidth: 120 },
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
		{ type: 'op', buttons: ['delete', 'slot-cancel', 'slot-success'], width: 280 }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.topup.withdraw
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
