<script setup lang="ts">
import { computed } from 'vue';

export interface CheckboxProps {
  modelValue?: boolean | any[];
  value?: any;
  label?: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | string;
  severity?: string;
  name?: string;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  value: undefined,
  label: '',
  disabled: false,
  color: 'primary',
  severity: '',
  name: undefined
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean | any[]): void;
  (e: 'change', event: Event): void;
}>();

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    if (props.value === undefined) return false;
    return props.modelValue.some((item) => JSON.stringify(item) === JSON.stringify(props.value));
  }
  return Boolean(props.modelValue);
});

const effectiveColor = computed(() => props.severity || props.color || 'primary');
const colorClass = computed(() => `val-checkbox--${effectiveColor.value}`);

function toggle(event: Event) {
  if (props.disabled) return;

  if (Array.isArray(props.modelValue)) {
    const list = [...props.modelValue];
    const index = list.findIndex((item) => JSON.stringify(item) === JSON.stringify(props.value));
    if (index === -1) {
      list.push(props.value);
    } else {
      list.splice(index, 1);
    }
    emit('update:modelValue', list);
  } else {
    emit('update:modelValue', !props.modelValue);
  }

  emit('change', event);
}
</script>

<template>
  <label
    class="val-checkbox"
    :class="[
      colorClass,
      {
        'val-checkbox-checked': isChecked,
        'val-checkbox-disabled': disabled
      }
    ]"
    @click.prevent="toggle"
  >
    <div class="val-checkbox-box">
      <svg
        v-if="isChecked"
        class="val-checkbox-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <span v-if="label || $slots.default" class="val-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style lang="scss">
.val-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: var(--spacing-sm, 0.5rem);
  vertical-align: middle;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  &-box {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e1;
    border-radius: var(--radius-sm, 4px);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  &-checked {
    .val-checkbox-box {
      background: var(--val-primary, #0066ff);
      border-color: var(--val-primary, #0066ff);
    }
    .val-checkbox-icon {
      color: #ffffff;
    }

    &.val-checkbox--primary .val-checkbox-box {
      background: var(--val-primary, #0066ff);
      border-color: var(--val-primary, #0066ff);
    }
    &.val-checkbox--secondary .val-checkbox-box {
      background: var(--val-secondary, #64748b);
      border-color: var(--val-secondary, #64748b);
    }
    &.val-checkbox--success .val-checkbox-box {
      background: var(--val-success, #22c55e);
      border-color: var(--val-success, #22c55e);
    }
    &.val-checkbox--danger .val-checkbox-box,
    &.val-checkbox--error .val-checkbox-box {
      background: var(--val-danger, #ef4444);
      border-color: var(--val-danger, #ef4444);
    }
    &.val-checkbox--warning .val-checkbox-box,
    &.val-checkbox--warn .val-checkbox-box {
      background: var(--val-warning, #f59e0b);
      border-color: var(--val-warning, #f59e0b);
    }
    &.val-checkbox--info .val-checkbox-box {
      background: var(--val-info, #06b6d4);
      border-color: var(--val-info, #06b6d4);
    }
  }

  &-disabled {
    cursor: not-allowed;
    opacity: 0.6;
    .val-checkbox-box {
      background: #f1f5f9;
      border-color: #e2e8f0;
    }
  }

  &-label {
    font-size: var(--font-size-base, 14px);
    color: var(--val-text-color, #334155);
  }

  &:hover:not(.val-checkbox-disabled) .val-checkbox-box {
    border-color: var(--val-primary-hover, #0052cc);
  }
}

.val-checkbox-icon {
  width: 12px;
  height: 12px;
}
</style>
