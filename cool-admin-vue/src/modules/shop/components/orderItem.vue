<template>
	<cl-dialog v-model="visible" :title="title" width="1000px">
		<cl-crud ref="Crud" padding="0">
			<cl-row>
				<!-- 刷新按钮 -->
				<cl-refresh-btn />
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
		</cl-crud>
	</cl-dialog>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'order-item'
});

import { useCrud, useTable } from '@cool-vue/crud';
import { nextTick, reactive, ref } from 'vue';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';

const { service } = useCool();
const { t } = useI18n();

// 是否可见
const visible = ref(false);

// 标题
const title = ref('');

// 选项

// cl-table
const Table = useTable({
	autoHeight: false,
	columns: [
		{
			label: '#',
			type: 'index'
		},
		{
			label: t('订单ID'),
			prop: 'orderId'
		},
		{
			label: t('商品名称'),
			prop: 'productName',
			showOverflowTooltip: true,
			minWidth: 200
		},
		{
			label: t('商品图片'),
			prop: 'productImage',
			minWidth: 120,
			component: { name: 'cl-image', props: { size: 32 } }
		},
		{
			label: t('购买单价(USDT)'),
			prop: 'priceUSDT',
			minWidth: 120
		},
		{
			label: t('购买数量'),
			prop: 'quantity',
			minWidth: 120
		},
		{
			label: t('小计金额(USDT)'),
			prop: 'subtotalUSDT',
			minWidth: 120
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.shop.orderItem,
	dict: {
		api: {
			page: 'page'
		}
	}
});

// 打开
function open(data: Eps.ShopOrderEntity) {
	console.log(data);
	visible.value = true;
	title.value = t('订单详情') + `（${data.orderNo}）`;

	nextTick(() => {
		Crud.value?.refresh({ orderId: data.id, page: 1 });
	});
}

// 关闭
function close() {
	visible.value = false;
}

defineExpose({
	open,
	close
});
</script>
