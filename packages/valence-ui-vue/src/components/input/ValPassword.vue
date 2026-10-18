<script setup lang="ts">
import { ref, computed } from 'vue';

export interface PasswordProps {
  modelValue?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'fieldset' | 'oneLine';
  floatLabel?: boolean;
  toggleMask?: boolean;
}

const props = withDefaults(defineProps<PasswordProps>(), {
  modelValue: '',
  id: () => `val-pwd-${Math.random().toString(36).substring(2, 9)}`,
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  hint: '',
  error: '',
  size: 'md',
  variant: 'default',
  floatLabel: false,
  toggleMask: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'change', event: Event): void;
}>();

const showPassword = ref(false);
const isFocused = ref(false);

const hasValue = computed(() => !!props.modelValue && props.modelValue.length > 0);

function togglePassword() {
  if (props.disabled) return;
  showPassword.value = !showPassword.value;
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit('blur', event);
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit('focus', event);
}

function handleChange(event: Event) {
  emit('change', event);
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
        'val-input-wrapper--error': !!error,
        'val-input-wrapper--float': floatLabel,
        'val-input-wrapper--has-value': hasValue,
        'val-input-wrapper--focused': isFocused
      }
    ]"
  >
    <!-- Label outside if not fieldset and not floatLabel -->
    <label
      v-if="label && variant !== 'fieldset' && !floatLabel"
      :for="id"
      class="val-input-label"
    >
      {{ label }}
      <span v-if="required" class="val-input-required">*</span>
    </label>

    <div class="val-input-container">
      <!-- Label inside container for fieldset or floatLabel -->
      <label
        v-if="label && (variant === 'fieldset' || floatLabel)"
        :for="id"
        class="val-input-label"
      >
        {{ label }}
        <span v-if="required" class="val-input-required">*</span>
      </label>

      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="floatLabel && !hasValue && !isFocused ? '' : placeholder"
        :disabled="disabled"
        :required="required"
        class="val-input-field val-password-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
      />

      <button
        v-if="toggleMask"
        type="button"
        class="val-password-toggle"
        :disabled="disabled"
        tabindex="-1"
        :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        @click="togglePassword"
      >
        <!-- Eye Off Icon -->
        <svg
          v-if="showPassword"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
          />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>

        <!-- Eye Icon -->
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>

    <div v-if="error" class="val-input-error" role="alert">
      {{ error }}
    </div>
    <div v-else-if="hint" class="val-input-hint">
      {{ hint }}
    </div>
  </div>
</template>

<style lang="scss">
.val-password-field {
  padding-right: 2.5rem !important;
}

.val-password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--val-text-hint, #6b7280);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s;
  z-index: 3;

  &:hover:not(:disabled) {
    color: var(--val-text-color, #374151);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.val-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &--sm {
    --val-input-height: 2rem;
    --val-input-font-size: 0.875rem;
    --val-input-padding: 0 0.5rem;
  }

  &--md {
    --val-input-height: 2.5rem;
    --val-input-font-size: 1rem;
    --val-input-padding: 0 0.75rem;
  }

  &--lg {
    --val-input-height: 3rem;
    --val-input-font-size: 1.125rem;
    --val-input-padding: 0 1rem;
  }

  .val-input-label {
    font-weight: 500;
    color: var(--val-text-color, #374151);
    font-size: 0.875rem;

    .val-input-required {
      color: var(--val-danger-color, #ef4444);
      margin-left: 0.125rem;
    }
  }

  .val-input-container {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .val-input-field {
    width: 100%;
    height: var(--val-input-height, 2.5rem);
    padding: var(--val-input-padding, 0 0.75rem);
    font-size: var(--val-input-font-size, 1rem);
    color: var(--val-text-color, #111827);
    background-color: var(--val-bg-color, #ffffff);
    border: 1px solid var(--val-border-color, #d1d5db);
    border-radius: var(--radius-md, 0.375rem);
    transition: all 0.2s ease-in-out;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
      color: var(--val-placeholder-color, #9ca3af);
    }

    &:hover:not(:disabled):not([readonly]) {
      border-color: var(--val-primary-color, #0066ff);
    }

    &:focus:not(:disabled):not([readonly]) {
      border-color: var(--val-primary-color, #0066ff);
      box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
    }

    &:disabled {
      background-color: var(--val-disabled-bg, #f3f4f6);
      color: var(--val-disabled-text, #9ca3af);
      cursor: not-allowed;
    }
  }

  &--error {
    .val-input-field {
      border-color: var(--val-danger-color, #ef4444) !important;
      &:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
    }
    .val-input-label {
      color: var(--val-danger-color, #ef4444);
    }
  }

  .val-input-hint,
  .val-input-error {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .val-input-hint {
    color: var(--val-text-hint, #6b7280);
  }

  .val-input-error {
    color: var(--val-danger-color, #ef4444);
  }

  /* Variant: fieldset */
  &--fieldset {
    position: relative;
    margin-top: 8px;

    .val-input-label {
      position: absolute;
      top: 0;
      left: 12px;
      transform: translateY(-50%);
      background-color: var(--val-bg-color, #ffffff);
      padding: 0 6px;
      font-size: 0.75rem;
      font-weight: 600;
      z-index: 20;
      color: var(--val-text-color, #374151);
      transition: all 0.2s ease-in-out;
    }

    &.val-input-wrapper--float {
      margin-top: 0;
      .val-input-label {
        top: 50%;
        background-color: transparent;
        padding: 0 0.25rem;
        font-size: 1rem;
        font-weight: 400;
        color: var(--val-placeholder-color, #9ca3af);
        pointer-events: none;
      }

      &.val-input-wrapper--has-value .val-input-label,
      &.val-input-wrapper--focused .val-input-label {
        top: 0;
        font-size: 0.75rem;
        background-color: var(--val-bg-color, #ffffff);
        padding: 0 0.375rem;
        left: 0.75rem;
        font-weight: 600;
        color: var(--val-primary-color, #0066ff);
      }
    }

    &.val-input-wrapper--focused:not(.val-input-wrapper--error) .val-input-label {
      color: var(--val-primary-color, #0066ff);
    }
  }

  /* Variant: oneLine */
  &--oneLine {
    .val-input-field {
      border-radius: 0 !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom: 1px solid var(--val-border-color, #d1d5db) !important;
      padding-left: 0 !important;
      background: transparent !important;
      &:focus:not(:disabled):not([readonly]) {
        box-shadow: none !important;
        border-bottom-width: 2px !important;
        border-bottom-color: var(--val-primary-color, #0066ff) !important;
      }
    }
    .val-password-toggle {
      right: 0;
    }
  }

  /* Variant: float (standard) */
  &--float:not(&--fieldset) {
    .val-input-label {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background-color: transparent;
      padding: 0 0.25rem;
      font-size: 1rem;
      font-weight: 400;
      pointer-events: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
      color: var(--val-placeholder-color, #9ca3af);
    }

    &.val-input-wrapper--has-value,
    &.val-input-wrapper--focused {
      .val-input-label {
        top: 0;
        left: 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        background-color: var(--val-bg-color, #ffffff);
        padding: 0 0.375rem;
        color: var(--val-primary-color, #0066ff);
        transform: translateY(-50%);
        z-index: 20;
      }
    }
  }
}
</style>
