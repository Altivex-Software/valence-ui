<script setup lang="ts">
import { computed } from 'vue';

export interface SwitchProps {
  modelValue?: boolean;
  label?: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | string;
  severity?: string;
  name?: string;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  label: '',
  disabled: false,
  color: 'primary',
  severity: '',
  name: undefined
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'change', event: Event): void;
}>();

const effectiveColor = computed(() => props.severity || props.color || 'primary');
const colorClass = computed(() => `val-input-switch--${effectiveColor.value}`);

function toggle(event: Event) {
  if (props.disabled) return;
  const newVal = !props.modelValue;
  emit('update:modelValue', newVal);
  emit('change', event);
}
</script>

<template>
  <div
    class="val-input-switch-wrapper"
    :class="{ 'val-input-switch-wrapper--disabled': disabled }"
    @click="toggle"
  >
    <div
      class="val-input-switch"
      :class="[
        colorClass,
        {
          'val-input-switch-checked': modelValue,
          'val-input-switch-disabled': disabled
        }
      ]"
      role="switch"
      :aria-checked="modelValue"
      :aria-disabled="disabled"
    >
      <div class="val-input-switch-slider"></div>
    </div>
    <span v-if="label || $slots.default" class="val-input-switch-label">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<style lang="scss">
.val-input-switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 0.5rem);
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  &--disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
}

.val-input-switch {
  display: inline-block;
  width: 42px;
  height: 24px;
  background: #cbd5e1;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
  vertical-align: middle;
  flex-shrink: 0;

  &-slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    background: #ffffff;
    border-radius: 50%;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &-checked {
    background-color: var(--val-primary, #0066ff);

    &.val-input-switch--primary {
      background-color: var(--val-primary, #0066ff);
    }
    &.val-input-switch--secondary {
      background-color: var(--val-secondary, #64748b);
    }
    &.val-input-switch--success {
      background-color: var(--val-success, #22c55e);
    }
    &.val-input-switch--danger,
    &.val-input-switch--error {
      background-color: var(--val-danger, #ef4444);
    }
    &.val-input-switch--warning,
    &.val-input-switch--warn {
      background-color: var(--val-warning, #f59e0b);
    }
    &.val-input-switch--info {
      background-color: var(--val-info, #06b6d4);
    }

    .val-input-switch-slider {
      transform: translateX(18px);
    }
  }

  &-disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:hover:not(.val-input-switch-disabled) {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }
}

.val-input-switch-label {
  font-size: var(--font-size-base, 14px);
  color: var(--val-text-color, #334155);
}
</style>
