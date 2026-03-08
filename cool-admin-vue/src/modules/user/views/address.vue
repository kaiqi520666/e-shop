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
	name: 'user-address'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import UserSelect from '/$/user/components/user-select.vue';
import { reactive } from 'vue';

const { service } = useCool();
const { t } = useI18n();
const options = reactive({
	isDefault: [
		{ label: t('是'), value: 1, type: 'success' },
		{ label: t('否'), value: 0, type: 'info' }
	]
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('选择用户'),
			prop: 'userId',
			component: {
				vm: UserSelect,
				props: {
					multiple: false,
					immediate: true // 编辑时加这个
				}
			},
			required: true
		},
		{
			label: t('联系人'),
			prop: 'contact',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('手机号'),
			prop: 'phone',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('地址'),
			prop: 'address',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('是否默认'),
			prop: 'isDefault',
			component: { name: 'el-switch', dict: options.isDefault, props: { disabled: true } },
			span: 12,
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('用户名'), prop: 'username', minWidth: 120 },
		{ label: t('联系人'), prop: 'contact', minWidth: 120 },
		{ label: t('手机号'), prop: 'phone', minWidth: 120 },
		{ label: t('地址'), prop: 'address', minWidth: 120 },
		{
			label: t('是否默认'),
			prop: 'isDefault',
			minWidth: 120,
			dict: options.isDefault
		},

		{ type: 'op', buttons: ['edit', 'delete'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.user.address
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
