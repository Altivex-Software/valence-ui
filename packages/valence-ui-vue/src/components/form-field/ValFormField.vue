<script setup lang="ts">
import { computed } from 'vue';
import ValIcon from '../icon/ValIcon.vue';

export type FormFieldAppearance = 'outline' | 'filled' | 'standard';
export type FormFieldSize = 'sm' | 'md' | 'lg';

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  appearance?: FormFieldAppearance;
  size?: FormFieldSize;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  appearance: 'outline',
  size: 'md',
  disabled: false,
  required: false,
  invalid: false
});

const isInvalid = computed(() => props.invalid || !!props.error);
</script>

<template>
  <div
    class="val-form-field"
    :class="[
      `val-form-field--${appearance}`,
      `val-form-field--${size}`,
      {
        'val-form-field--disabled': disabled,
        'val-form-field--invalid': isInvalid
      }
    ]"
  >
    <!-- Top Label -->
    <label
      v-if="label || $slots.label"
      class="val-form-field-label"
      :class="{ 'val-form-field-label--required': required }"
    >
      <slot name="label">
        <span>{{ label }}</span>
      </slot>
      <span v-if="required" class="val-form-field-required-marker" aria-hidden="true">*</span>
    </label>

    <!-- Control Container -->
    <div
      class="val-form-field-control-wrapper"
      :class="{ 'val-form-field-control-wrapper--disabled': disabled }"
    >
      <!-- Prefix Affix -->
      <div v-if="$slots.prefix" class="val-form-field-prefix">
        <slot name="prefix" />
      </div>

      <!-- Main Input / Control -->
      <slot />

      <!-- Suffix Affix -->
      <div v-if="$slots.suffix" class="val-form-field-suffix">
        <slot name="suffix" />
      </div>
    </div>

    <!-- Bottom Subscript -->
    <div class="val-form-field-subscript">
      <template v-if="isInvalid">
        <div v-if="error || $slots.error" class="val-form-field-error val-animate-fade-in-down" role="alert" aria-live="polite">
          <span class="val-form-field-error-icon-wrapper" aria-hidden="true">
            <ValIcon name="alert-circle" size="0.875rem" />
          </span>
          <span class="val-form-field-error-message">
            <slot name="error">{{ error }}</slot>
          </span>
        </div>
      </template>
      <template v-else-if="hint || $slots.hint">
        <div class="val-form-field-hint">
          <slot name="hint">
            <span>{{ hint }}</span>
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/form-field/form-field.component.scss';
</style>
