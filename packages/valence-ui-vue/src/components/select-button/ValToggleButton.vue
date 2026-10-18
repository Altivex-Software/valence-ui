<script setup lang="ts">
import { computed } from 'vue';
import ValIcon from '../icon/ValIcon.vue';

export interface ToggleButtonProps {
  modelValue?: boolean;
  onLabel?: string;
  offLabel?: string;
  onIcon?: string;
  offIcon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  modelValue: false,
  onLabel: 'Yes',
  offLabel: 'No',
  onIcon: '',
  offIcon: '',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const currentLabel = computed(() => (props.modelValue ? props.onLabel : props.offLabel));
const currentIcon = computed(() => (props.modelValue ? props.onIcon : props.offIcon));

function toggle() {
  if (props.disabled) return;
  const newVal = !props.modelValue;
  emit('update:modelValue', newVal);
  emit('change', newVal);
}
</script>

<template>
  <button
    type="button"
    class="val-toggle-button"
    :class="{
      'val-toggle-button-checked': modelValue,
      'val-toggle-button-disabled': disabled
    }"
    :disabled="disabled"
    @click="toggle"
  >
    <span v-if="currentIcon" class="val-toggle-button-icon">
      <ValIcon :name="currentIcon" size="1rem" />
    </span>
    <span v-if="currentLabel" class="val-toggle-button-label">{{ currentLabel }}</span>
  </button>
</template>

<style lang="scss">
.val-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
  background: var(--bg-surface, #ffffff);
  border: 1px solid var(--border-color, #cbd5e1);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  outline: none;

  &:hover:not(.val-toggle-button-disabled):not(.val-toggle-button-checked) {
    background: var(--bg-surface-subtle, #f8fafc);
    border-color: var(--primary-300, #a5b4fc);
  }

  &.val-toggle-button-checked {
    color: #ffffff;
    background: var(--primary-color, #4f46e5);
    border-color: var(--primary-color, #4f46e5);
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.25);

    &:hover:not(.val-toggle-button-disabled) {
      background: var(--primary-600, #4338ca);
      border-color: var(--primary-600, #4338ca);
    }
  }

  &.val-toggle-button-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .val-toggle-button-icon {
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
  }
}
</style>
