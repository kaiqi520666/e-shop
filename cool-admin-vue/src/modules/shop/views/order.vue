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
				<template #slot-detail="{ scope }">
					<el-button type="primary" @click="handleDetail(scope.row)">{{
						t('详情')
					}}</el-button>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" /><order-item :ref="setRefs('orderItem')" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'shop-order'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import UserSelect from '/$/user/components/user-select.vue';
import OrderItem from '../components/orderItem.vue';

const { service, setRefs, refs } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	status: [
		{ label: t('待支付'), value: 0, type: 'info' },
		{ label: t('已支付'), value: 1, type: 'primary' },
		{ label: t('已发货'), value: 2, type: 'warning' },
		{ label: t('已完成'), value: 3, type: 'success' }
	]
});

// 详情
function handleDetail(row: Eps.ShopOrderEntity) {
	refs.orderItem.open(row);
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
			label: t('订单总金额(USDT)'),
			prop: 'totalUSDT',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('订单状态'),
			prop: 'status',
			component: { name: 'el-radio-group', options: options.status },
			value: 0,
			required: true
		},
		{
			label: t('收货地址'),
			prop: 'address',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('手机号'),
			prop: 'phone',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('收货人'),
			prop: 'contact',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('订单号'), prop: 'orderNo', minWidth: 120 },
		{ label: t('订单总金额(USDT)'), prop: 'totalUSDT', minWidth: 120 },
		{
			label: t('订单状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{ label: t('收货地址'), prop: 'address', minWidth: 120 },
		{ label: t('手机号'), prop: 'phone', minWidth: 120 },
		{ label: t('收货人'), prop: 'contact', minWidth: 120 },
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
		{ type: 'op', buttons: ['edit', 'delete', 'slot-detail'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.shop.order
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
