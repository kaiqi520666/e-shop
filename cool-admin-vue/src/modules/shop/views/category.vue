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

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: "shop-category",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { Plugins } from "/#/crud";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	status: [
		{ label: t("隐藏"), value: 0, type: "danger" },
		{ label: t("显示"), value: 1, type: "success" },
	],
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t("分类名称"),
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("分类关键词"),
			prop: "keyword",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("选择父分类"),
			prop: "parentId",
			component: {
				name: "cl-select",
				props: {
					tree: true,
					current: true,
					labelKey: "name",
					valueKey: "id",
					checkStrictly: true,
				},
			},
			span: 12,
		},
		{
			label: t("分类图标"),
			prop: "icon",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("排序"),
			prop: "sort",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("状态"),
			prop: "status",
			component: { name: "el-radio-group", options: options.status },
			value: 1,
			required: true,
		},
	],
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: t("分类名称"), prop: "name", minWidth: 120, align: "left" },
		{ label: t("分类关键词"), prop: "keyword", minWidth: 120 },
		{ label: t("分类图标"), prop: "icon", minWidth: 120 },
		{ label: t("排序"), prop: "sort", minWidth: 120 },
		{
			label: t("状态"),
			prop: "status",
			minWidth: 120,
			dict: options.status,
		},
		{
			label: t("创建时间"),
			prop: "createTime",
			minWidth: 170,
			sortable: "desc",
			component: { name: "cl-date-text" },
		},
		{
			label: t("更新时间"),
			prop: "updateTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" },
		},
		{
			type: "op",
			width: 250,
			buttons: [
				{
					label: t("新增"),
					hidden: !service.shop.category._permission?.add,
					type: "success",
					onClick: ({ scope }) => {
						Crud.value?.rowAppend({ parentId: scope.row.id });
					},
				},
				"edit",
				"delete",
			],
		},
	],
	plugins: [Plugins.Table.toTree()],
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.shop.category,
	},
	(app) => {
		app.refresh();
	},
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
