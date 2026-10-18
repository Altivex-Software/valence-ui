<script setup lang="ts">
import { computed, inject, type ComputedRef, type Ref } from 'vue';

export interface RadioOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface RadioProps {
  modelValue?: any;
  value?: any;
  options?: RadioOption[];
  vertical?: boolean;
  label?: string;
  name?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: undefined,
  value: undefined,
  options: () => [],
  vertical: false,
  label: '',
  name: undefined,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void;
  (e: 'change', val: any): void;
}>();

const context = inject<{
  currentValue: Ref<any>;
  groupName: ComputedRef<string>;
  groupDisabled: ComputedRef<boolean>;
  selectValue: (val: any) => void;
} | null>('valRadioGroupContext', null);

const isChecked = computed(() => {
  if (context) {
    return context.currentValue.value === props.value;
  }
  return props.modelValue === props.value;
});

const effectiveDisabled = computed(() => {
  if (context && context.groupDisabled.value) return true;
  return props.disabled;
});

const effectiveName = computed(() => {
  if (context) return context.groupName.value;
  return props.name || `val-radio-${Math.random().toString(36).substr(2, 9)}`;
});

function onChange(val?: any) {
  const chosen = val !== undefined ? val : props.value;
  if (effectiveDisabled.value) return;
  if (context) {
    context.selectValue(chosen);
  } else {
    emit('update:modelValue', chosen);
  }
  emit('change', chosen);
}
</script>

<template>
  <!-- Group Mode when options prop is provided -->
  <div v-if="options && options.length > 0" class="val-radio-group" :class="{ 'val-radio-group--vertical': vertical }">
    <label
      v-for="opt in options"
      :key="String(opt.value)"
      class="val-radio-item"
      :class="{ 'val-radio-item--disabled': disabled || opt.disabled }"
    >
      <input
        type="radio"
        class="val-radio-input"
        :name="effectiveName"
        :value="opt.value"
        :checked="modelValue === opt.value"
        :disabled="disabled || opt.disabled"
        @change="onChange(opt.value)"
      />
      <span class="val-radio-circle" />
      <span class="val-radio-label">{{ opt.label }}</span>
    </label>
  </div>

  <!-- Single Radio Item Mode -->
  <label
    v-else
    class="val-radio-item"
    :class="{ 'val-radio-item--disabled': effectiveDisabled }"
  >
    <input
      type="radio"
      :name="effectiveName"
      :value="value"
      :checked="isChecked"
      :disabled="effectiveDisabled"
      class="val-radio-input"
      @change="onChange"
    />
    <span class="val-radio-circle"></span>
    <span v-if="label || $slots.default" class="val-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
