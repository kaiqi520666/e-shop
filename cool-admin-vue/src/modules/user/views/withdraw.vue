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
				<template #slot-pass="{ scope }">
					<el-button
						v-if="scope.row.status === 0"
						type="primary"
						@click="handleAudit(scope.row, 'pass')"
						>通过</el-button
					>
				</template>
				<template #slot-reject="{ scope }">
					<el-button
						v-if="scope.row.status === 0"
						type="danger"
						@click="handleAudit(scope.row, 'reject')"
						>拒绝</el-button
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
	name: 'user-withdraw'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import UserSelect from '/$/user/components/user-select.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	status: [
		{ label: t('审核中'), value: 0, type: 'default' },
		{ label: t('已完成'), value: 1, type: 'success' },
		{ label: t('已拒绝'), value: 2, type: 'danger' }
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
			label: t('提现金额'),
			prop: 'amount',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('USDT钱包地址'),
			prop: 'walletAddress',
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
			label: t('备注/拒绝原因'),
			prop: 'remark',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ label: t('#'), type: 'index' },
		{ label: t('ID'), prop: 'id', minWidth: 120 },
		{ label: t('用户名'), prop: 'username', minWidth: 120 },
		{ label: t('提现金额'), prop: 'amount', minWidth: 120 },
		{ label: t('USDT钱包地址'), prop: 'walletAddress', minWidth: 150 },
		{
			label: t('状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{ label: t('备注/拒绝原因'), prop: 'remark', minWidth: 120 },
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
		{ type: 'op', buttons: ['delete', 'slot-pass', 'slot-reject'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.user.withdraw
	},
	app => {
		app.refresh();
	}
);

// 审核
const handleAudit = async (row: any, type: string) => {
	if (type === 'pass') {
		ElMessageBox.confirm('确定审核通过该提现申请吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(async () => {
				console.log(row);
				const res = await service.user.withdraw.pass({
					id: row.id
				});
				console.log(res);
				if (res) {
					ElMessage.success('审核通过成功');
					Crud.value?.refresh();
				} else {
					ElMessage.error(res.message);
				}
			})
			.catch(() => {});
	} else {
		ElMessageBox.prompt('确定拒绝该提现申请吗？请输入拒绝原因', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputErrorMessage: '请填写拒绝原因'
		})
			.then(async ({ value }) => {
				if (!value) {
					ElMessage.error('请填写原因');
					return;
				}
				const res = await service.user.withdraw.reject({
					id: row.id,
					remark: value
				});
				console.log(res);
				if (res) {
					ElMessage.success('审核拒绝成功');
					Crud.value?.refresh();
				} else {
					ElMessage.error(res.message);
				}
			})
			.catch(() => {});
	}
};

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
