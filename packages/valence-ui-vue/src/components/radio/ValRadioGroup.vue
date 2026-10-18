<script setup lang="ts">
import { computed, provide, readonly, ref, watch } from 'vue';

export interface RadioOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface RadioGroupProps {
  modelValue?: any;
  options?: RadioOption[];
  name?: string;
  disabled?: boolean;
  vertical?: boolean;
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  modelValue: null,
  options: () => [],
  name: () => `val-radio-${Math.random().toString(36).substring(2, 9)}`,
  disabled: false,
  vertical: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void;
  (e: 'change', val: any): void;
}>();

const currentVal = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    currentVal.value = val;
  }
);

function selectValue(val: any) {
  if (props.disabled) return;
  currentVal.value = val;
  emit('update:modelValue', val);
  emit('change', val);
}

provide('valRadioGroupContext', {
  currentValue: readonly(currentVal),
  groupName: computed(() => props.name),
  groupDisabled: computed(() => props.disabled),
  selectValue
});
</script>

<template>
  <div
    class="val-radio-group"
    :class="{ 'val-radio-group--vertical': vertical }"
    role="radiogroup"
  >
    <!-- Slot mode if children provided -->
    <slot>
      <!-- Options array mode -->
      <label
        v-for="opt in options"
        :key="String(opt.value)"
        class="val-radio-item"
        :class="{ 'val-radio-item--disabled': disabled || opt.disabled }"
      >
        <input
          type="radio"
          :name="name"
          :value="opt.value"
          :checked="currentVal === opt.value"
          :disabled="disabled || opt.disabled"
          class="val-radio-input"
          @change="selectValue(opt.value)"
        />
        <span class="val-radio-circle"></span>
        <span class="val-radio-label">{{ opt.label }}</span>
      </label>
    </slot>
  </div>
</template>

<style lang="scss">
.val-radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  &--vertical {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.val-radio-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.875rem;
  color: #374151;
  position: relative;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.val-radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;

  &:checked + .val-radio-circle {
    border-color: var(--val-primary, #0066ff);

    &::after {
      transform: scale(1);
    }
  }

  &:focus-visible + .val-radio-circle {
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.2);
  }
}

.val-radio-circle {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--val-border-color, #cbd5e1);
  border-radius: 50%;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease-in-out;
  background-color: #ffffff;
  flex-shrink: 0;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 10px;
    background-color: var(--val-primary, #0066ff);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  }
}
</style>
