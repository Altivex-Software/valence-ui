<script setup lang="ts">
import { computed } from 'vue';
import ValIcon from '../icon/ValIcon.vue';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'fieldset' | 'oneLine';
export type InputFocusColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface InputProps {
  modelValue?: string | number | null;
  id?: string;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  floatLabel?: boolean;
  focusColor?: InputFocusColor;
  icon?: string;
  iconPos?: 'left' | 'right';
  clearable?: boolean;
  invalid?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  id: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md',
  variant: 'default',
  floatLabel: false,
  iconPos: 'left',
  clearable: false,
  invalid: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void;
  (e: 'input', event: Event): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'clear'): void;
}>();

const effectiveId = computed(() => props.id || `val-input-${Math.random().toString(36).substring(2, 9)}`);
const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined);
const isInvalid = computed(() => props.invalid || !!props.error);

const computedFocusColor = computed(() => {
  if (!props.focusColor) return undefined;
  const colorMap: Record<InputFocusColor, string> = {
    primary: 'var(--val-primary)',
    secondary: 'var(--val-secondary)',
    success: 'var(--val-success)',
    danger: 'var(--val-danger)',
    warning: 'var(--val-warning)',
    info: 'var(--val-info)'
  };
  return colorMap[props.focusColor];
});

const isNativeIcon = computed(() => {
  return props.icon && !props.icon.includes(' ') && !props.icon.startsWith('pi-') && !props.icon.startsWith('fa-');
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
}

function handleBlur(event: FocusEvent) {
  emit('blur', event);
}

function handleClear() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <div
    class="val-input-wrapper"
    :class="[
      `val-input-wrapper--${size}`,
      `val-input-wrapper--${variant}`,
      {
        'val-input-wrapper--disabled': disabled,
        'val-input-wrapper--readonly': readonly,
        'val-input-wrapper--error': isInvalid,
        'val-input-wrapper--float': floatLabel,
        'val-input-wrapper--has-value': hasValue
      }
    ]"
    :style="computedFocusColor ? { '--val-input-focus-color': computedFocusColor } : undefined"
  >
    <!-- Top Label -->
    <label v-if="label && !floatLabel" :for="effectiveId" class="val-input-label">
      {{ label }}
      <span v-if="required" class="val-input-required">*</span>
    </label>

    <div class="val-input-container">
      <!-- Float Label -->
      <label v-if="label && floatLabel" :for="effectiveId" class="val-input-label">
        {{ label }}
        <span v-if="required" class="val-input-required">*</span>
      </label>

      <!-- Left Icon -->
      <span v-if="icon && iconPos === 'left'" class="val-input-icon val-input-icon--left">
        <ValIcon v-if="isNativeIcon" :name="icon" size="1.125rem" />
        <i v-else :class="icon" />
      </span>

      <!-- Input Field -->
      <input
        :id="effectiveId"
        :type="type"
        class="val-input-field"
        :class="{
          'val-input-field--has-icon': !!icon,
          'val-input-field--has-icon-left': icon && iconPos === 'left'
        }"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-describedby="error ? `${effectiveId}-error` : hint ? `${effectiveId}-hint` : undefined"
        :aria-invalid="isInvalid"
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- Clear button -->
      <button
        v-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        class="val-input-clear-btn"
        tabindex="-1"
        aria-label="Limpiar campo"
        @click="handleClear"
      >
        ✕
      </button>

      <!-- Right Icon -->
      <span v-if="icon && iconPos === 'right'" class="val-input-icon val-input-icon--right">
        <ValIcon v-if="isNativeIcon" :name="icon" size="1.125rem" />
        <i v-else :class="icon" />
      </span>
    </div>

    <!-- Error & Hint Subscripts -->
    <div v-if="error" :id="`${effectiveId}-error`" class="val-input-error" role="alert">
      {{ error }}
    </div>
    <div v-else-if="hint" :id="`${effectiveId}-hint`" class="val-input-hint">
      {{ hint }}
    </div>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/input/input.component.scss';
</style>
