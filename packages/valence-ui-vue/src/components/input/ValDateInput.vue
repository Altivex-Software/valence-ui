<script setup lang="ts">
import { computed } from 'vue';

export type DateInputSize = 'sm' | 'md' | 'lg';
export type DateInputVariant = 'default' | 'fieldset' | 'oneLine';

export interface DateInputProps {
  modelValue?: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  hint?: string;
  error?: string;
  size?: DateInputSize;
  floatLabel?: boolean;
  variant?: DateInputVariant;
}

const props = withDefaults(defineProps<DateInputProps>(), {
  modelValue: '',
  id: '',
  disabled: false,
  required: false,
  size: 'md',
  floatLabel: false,
  variant: 'default'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'blur'): void;
}>();

const effectiveId = computed(() => props.id || `val-date-${Math.random().toString(36).substring(2, 9)}`);
const hasValue = computed(() => !!props.modelValue);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('change', target.value);
}

function onBlur() {
  emit('blur');
}
</script>

<template>
  <div
    class="val-input-wrapper"
    :class="[
      `val-input-wrapper--${size}`,
      variant === 'fieldset' ? 'val-input-wrapper--fieldset' : '',
      variant === 'oneLine' ? 'val-input-wrapper--oneLine' : '',
      {
        'val-input-wrapper--disabled': disabled,
        'val-input-wrapper--error': !!error,
        'val-input-wrapper--float': floatLabel,
        'val-input-wrapper--has-value': hasValue
      }
    ]"
  >
    <label v-if="label" :for="effectiveId" class="val-input-label">
      {{ label }}
      <span v-if="required" class="val-input-required">*</span>
    </label>

    <div class="val-input-container">
      <input
        :id="effectiveId"
        type="date"
        class="val-input-field"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        @input="onInput"
        @blur="onBlur"
      />
    </div>

    <div v-if="error" class="val-input-error" role="alert">{{ error }}</div>
    <div v-else-if="hint" class="val-input-hint">{{ hint }}</div>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/input/date-input.component.scss';
</style>
