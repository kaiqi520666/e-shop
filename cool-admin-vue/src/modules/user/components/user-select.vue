<template>
	<cl-select-table
		ref="SelectTable"
		:model-value="value"
		@update:model-value="onUpdateValue"
		:title="t('选择用户')"
		:service="service.user.info"
		:columns="columns"
		:multiple="multiple"
		:dict="{ text: 'username', img: '' }"
	/>
</template>

<script setup lang="ts">
defineOptions({
	name: 'user-select'
});

import { ref, useModel, watch, nextTick } from 'vue';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	modelValue: null,
	multiple: Boolean
});

const { service } = useCool();
const { t } = useI18n();

const value = useModel(props, 'modelValue');
const SelectTable = ref();

const currentId = ref<any>(null);

const checkEqual = (a: any, b: any) => {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.every((v, i) => v === b[i]);
	}
	return false;
};

const onUpdateValue = (val: any) => {
	currentId.value = val;
	value.value = val;
};

watch(
	() => props.modelValue,
	async val => {
		if (val && !checkEqual(val, currentId.value)) {
			try {
				if (props.multiple) {
				} else {
					const res = await service.user.info.info({ id: val });
					if (res) {
						currentId.value = val;
						await nextTick();
						SelectTable.value?.set(res);
					}
				}
			} catch (err) {
				console.error('获取回显用户失败', err);
			}
		} else if (!val) {
			currentId.value = null;
			await nextTick();
			SelectTable.value?.set([]);
		}
	},
	{ immediate: true }
);

const columns = ref([
	{
		prop: 'username',
		label: t('姓名'),
		minWidth: 150
	},
	{
		prop: 'avatarUrl',
		label: t('头像'),
		component: {
			name: 'cl-avatar'
		},
		minWidth: 100
	},
	{
		prop: 'phone',
		label: t('手机号'),
		minWidth: 120
	},

	{
		label: t('状态'),
		prop: 'status',
		minWidth: 100,
		dict: [
			{
				label: t('正常'),
				value: 1,
				type: 'success'
			},
			{
				label: t('禁用'),
				value: 0,
				type: 'danger'
			}
		]
	}
]);
</script>
