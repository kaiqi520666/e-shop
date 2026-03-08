<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-flex1 />

			<!-- 搜索 -->
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
	name: 'user-list'
});

import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useI18n } from 'vue-i18n';
import { useCool } from '/@/cool';
import { reactive } from 'vue';
import { Plugins } from '/#/crud';
const { t } = useI18n();
const { service } = useCool();

const options = reactive({
	status: [
		{
			label: t('禁用'),
			value: 0,
			type: 'danger'
		},
		{
			label: t('正常'),
			value: 1,
			type: 'success'
		},
		{
			label: t('已注销'),
			value: 2,
			type: 'warning'
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: t('用户名'),
			prop: 'username',
			minWidth: 150
		},
		{
			label: t('手机号'),
			prop: 'phone',
			minWidth: 120
		},
		{
			label: t('头像'),
			prop: 'avatarUrl',
			minWidth: 100,
			component: {
				name: 'cl-avatar'
			}
		},
		//inviteCode
		{
			label: t('邀请码'),
			prop: 'inviteCode',
			minWidth: 120
		},
		//commissionRate
		{
			label: t('分成比例'),
			prop: 'commissionRate',
			minWidth: 120
		},
		//balance
		{
			label: t('余额'),
			prop: 'balance',
			minWidth: 120
		},
		//frozen
		{
			label: t('冻结金额'),
			prop: 'frozen',
			minWidth: 120
		},
		//totalIncome
		{
			label: t('累计收入'),
			prop: 'totalIncome',
			minWidth: 120
		},

		{
			label: t('状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{
			label: t('注册时间'),
			prop: 'createTime',
			sortable: 'desc',
			minWidth: 170
		},
		{
			type: 'op',
			buttons: ['edit']
		}
	],
	plugins: [Plugins.Table.toTree()]
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			prop: 'avatarUrl',
			label: t('头像'),
			component: { name: 'cl-upload' }
		},
		{
			prop: 'username',
			label: t('用户名'),
			component: { name: 'el-input', props: { disabled: true } },
			required: true
		},
		{
			prop: 'phone',
			label: t('手机号'),
			component: {
				name: 'el-input',
				props: {
					maxlength: 11,
					disabled: true
				}
			}
		},
		{
			prop: 'inviteCode',
			label: t('邀请码'),
			component: { name: 'el-input', props: { disabled: true } }
		},
		{
			prop: 'commissionRate',
			label: t('分成比例'),
			component: { name: 'el-input' }
		},
		{
			prop: 'balance',
			label: t('余额'),
			component: { name: 'el-input' }
		},
		{
			prop: 'frozen',
			label: t('冻结金额'),
			component: { name: 'el-input' }
		},
		{
			prop: 'totalIncome',
			label: t('累计收入'),
			component: { name: 'el-input' }
		},
		{
			prop: 'walletAddress',
			label: t('钱包地址'),
			component: { name: 'el-input' }
		},
		{
			prop: 'status',
			label: t('状态'),
			value: 1,
			component: {
				name: 'el-radio-group',
				options: options.status
			}
		}
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.user.info
	},
	app => {
		app.refresh();
	}
);
</script>
