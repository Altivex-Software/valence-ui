<script setup lang="ts">
import { ref, computed } from 'vue';

export type InputMaskSize = 'sm' | 'md' | 'lg';
export type InputMaskVariant = 'default' | 'filled' | 'outlined' | 'fieldset' | 'oneLine';
export type InputMaskSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface InputMaskProps {
  mask: string;
  modelValue?: string;
  slotChar?: string;
  autoClear?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: InputMaskSize;
  variant?: InputMaskVariant;
  severity?: InputMaskSeverity;
}

const props = withDefaults(defineProps<InputMaskProps>(), {
  modelValue: '',
  slotChar: '_',
  autoClear: true,
  label: '',
  placeholder: '',
  disabled: false,
  size: 'md',
  variant: 'default',
  severity: 'primary'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'input', event: Event): void;
}>();

const rawValue = ref(props.modelValue);

function applyMask(val: string): string {
  if (!val) return '';
  const mask = props.mask;
  let res = '';
  let valIdx = 0;

  for (let i = 0; i < mask.length && valIdx < val.length; i++) {
    const maskChar = mask[i];
    const valChar = val[valIdx];

    if (maskChar === '9') {
      if (/\d/.test(valChar)) {
        res += valChar;
        valIdx++;
      } else {
        valIdx++;
        i--;
      }
    } else if (maskChar === 'a') {
      if (/[a-zA-Z]/.test(valChar)) {
        res += valChar;
        valIdx++;
      } else {
        valIdx++;
        i--;
      }
    } else if (maskChar === '*') {
      if (/[a-zA-Z0-9]/.test(valChar)) {
        res += valChar;
        valIdx++;
      } else {
        valIdx++;
        i--;
      }
    } else {
      res += maskChar;
      if (valChar === maskChar) {
        valIdx++;
      }
    }
  }

  return res;
}

const displayValue = computed(() => applyMask(props.modelValue || rawValue.value));

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const cleaned = target.value.replace(/[^a-zA-Z0-9]/g, '');
  rawValue.value = cleaned;
  emit('update:modelValue', cleaned);
  emit('input', event);
}
</script>

<template>
  <div
    class="val-input-mask"
    :class="[
      `val-input-mask-${size}`,
      `val-input-mask-${variant}`,
      `val-input-mask-${severity}`,
      { 'val-input-mask-disabled': disabled }
    ]"
  >
    <label v-if="variant === 'fieldset' && label" class="val-input-mask-fieldset-label">
      {{ label }}
    </label>

    <div class="val-input-mask-container">
      <input
        type="text"
        class="val-input-mask-field"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/input-mask/input-mask.component.scss';
</style>
