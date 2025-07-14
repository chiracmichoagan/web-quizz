<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import type { ISelectedItem } from '../types';

const props = defineProps({
  options: {
    type: Array as PropType<ISelectedItem[]>,
    default: () => [],
  },
  selectedOption: {
    type: Object as PropType<ISelectedItem>,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: 'Sélectionnez une option',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
});

const selectedItem = ref<ISelectedItem | null>(null);

watch(
  () => props.selectedOption,
  (newValue) => {
    selectedItem.value = newValue;
  },
  { immediate: true }
);

watch(
  () => selectedItem.value,
  (value) => {
    if (value) {
      emit('selected', value);
    } else if (props.clearable) {
      emit('selected', {});
    }
  }
);

const emit = defineEmits<{
  (e: 'selected', value: ISelectedItem): void;
}>();
</script>

<template>
  <select v-model="selectedItem" class="custom-select">
    <option v-if="placeholder" disabled value="">
      {{ placeholder }}
    </option>

    <option v-for="option in props.options" :key="option.id" :value="option">
      {{ option.name }}
    </option>
  </select>
</template>

<style lang="scss" scoped>
@import '@/scss/local/_mixins.scss';

:deep(.vs__dropdown-toggle) {
  padding: 8px;
}

.custom-select :deep(*) {
  font-size: 12px;
  @include breakpoint('md') {
    font-size: 15px;
  }
  @include breakpoint('2xl') {
    font-size: 16px;
  }
}
</style>
