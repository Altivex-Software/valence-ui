<script setup lang="ts">
export interface SelectButtonOption<T = any> {
  label?: string;
  value: T;
  icon?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface SelectButtonProps {
  modelValue?: any;
  options?: SelectButtonOption[] | any[];
  multiple?: boolean;
  unselectable?: boolean;
  disabled?: boolean;
  optionLabel?: string;
  optionValue?: string;
  optionIcon?: string;
  optionDisabled?: string;
}

const props = withDefaults(defineProps<SelectButtonProps>(), {
  modelValue: null,
  options: () => [],
  multiple: false,
  unselectable: true,
  disabled: false,
  optionLabel: 'label',
  optionValue: 'value',
  optionIcon: 'icon',
  optionDisabled: 'disabled'
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void;
  (e: 'change', val: any): void;
}>();

function getOptionLabel(opt: any): string {
  if (typeof opt === 'string' || typeof opt === 'number') return String(opt);
  return opt[props.optionLabel] ?? opt.label ?? '';
}

function getOptionValue(opt: any): any {
  if (typeof opt === 'string' || typeof opt === 'number') return opt;
  return props.optionValue && opt[props.optionValue] !== undefined
    ? opt[props.optionValue]
    : (opt.value ?? opt);
}

function getOptionIcon(opt: any): string | undefined {
  if (typeof opt === 'object' && opt !== null) {
    return opt[props.optionIcon] ?? opt.icon;
  }
  return undefined;
}

function isOptionDisabled(opt: any): boolean {
  if (typeof opt === 'object' && opt !== null) {
    return Boolean(opt[props.optionDisabled] ?? opt.disabled);
  }
  return false;
}

function isSelected(val: any): boolean {
  const current = props.modelValue;
  if (props.multiple) {
    return Array.isArray(current) && current.includes(val);
  }
  return current === val;
}

function selectOption(val: any): void {
  if (props.disabled) return;

  if (props.multiple) {
    let current: any[] = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    if (current.includes(val)) {
      current = current.filter((v) => v !== val);
    } else {
      current.push(val);
    }
    emit('update:modelValue', current);
    emit('change', current);
  } else {
    let next = val;
    if (props.modelValue === val && props.unselectable) {
      next = null;
    }
    emit('update:modelValue', next);
    emit('change', next);
  }
}
</script>

<template>
  <div
    class="val-select-button"
    :class="{ 'val-select-button-disabled': disabled }"
    role="group"
  >
    <button
      v-for="(opt, index) in options"
      :key="index"
      type="button"
      class="val-select-button-item"
      :class="{
        'val-select-button-item-active': isSelected(getOptionValue(opt)),
        'val-select-button-item-disabled': disabled || isOptionDisabled(opt)
      }"
      :disabled="disabled || isOptionDisabled(opt)"
      @click="selectOption(getOptionValue(opt))"
    >
      <span v-if="getOptionIcon(opt)" class="val-select-button-icon">
        <i :class="getOptionIcon(opt)"></i>
      </span>
      <span v-if="getOptionLabel(opt)" class="val-select-button-label">
        {{ getOptionLabel(opt) }}
      </span>
    </button>
  </div>
</template>

<style lang="scss">
.val-select-button {
  display: inline-flex;
  background: var(--bg-surface-subtle, #f1f5f9);
  border: 1px solid var(--val-border-color, #e2e8f0);
  border-radius: var(--radius-md, 8px);
  padding: 3px;
  gap: 2px;
  user-select: none;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 14px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--val-text-secondary, #64748b);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm, 6px);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;

    &:hover:not(.val-select-button-item-disabled):not(.val-select-button-item-active) {
      color: var(--val-text-color, #1e293b);
      background: rgba(255, 255, 255, 0.6);
    }

    &-active {
      color: var(--val-primary, #0066ff) !important;
      background: #ffffff !important;
      font-weight: 600 !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    }

    &-disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &-icon {
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
  }
}
</style>
