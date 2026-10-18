<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

export interface OtpProps {
  modelValue?: string;
  length?: number;
  disabled?: boolean;
  integerOnly?: boolean;
}

const props = withDefaults(defineProps<OtpProps>(), {
  modelValue: '',
  length: 6,
  disabled: false,
  integerOnly: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'change', val: string): void;
  (e: 'complete', val: string): void;
}>();

const inputRefs = ref<HTMLInputElement[]>([]);
const otpValues = ref<string[]>(Array(props.length).fill(''));

watch(
  () => props.modelValue,
  (val) => {
    const chars = (val || '').split('').slice(0, props.length);
    otpValues.value = Array(props.length)
      .fill('')
      .map((_, i) => chars[i] || '');
  },
  { immediate: true }
);

function updateAndEmit() {
  const full = otpValues.value.join('');
  emit('update:modelValue', full);
  emit('change', full);
  if (full.length === props.length && !otpValues.value.includes('')) {
    emit('complete', full);
  }
}

function onInputChange(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  let val = target.value;

  if (props.integerOnly && val && !/^\d+$/.test(val)) {
    val = '';
    target.value = '';
    return;
  }

  // Take the last entered character if multiple
  if (val.length > 1) {
    val = val.slice(-1);
    target.value = val;
  }

  otpValues.value[index] = val;

  if (val && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus();
    });
  }

  updateAndEmit();
}

function onKeyDown(event: KeyboardEvent, index: number) {
  if (props.disabled) return;

  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus();
    });
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus();
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const text = event.clipboardData?.getData('text') || '';
  if (!text) return;

  const filtered = props.integerOnly ? text.replace(/\D/g, '') : text;
  const chars = filtered.split('').slice(0, props.length);

  for (let i = 0; i < props.length; i++) {
    otpValues.value[i] = chars[i] || '';
  }

  updateAndEmit();

  const nextFocus = Math.min(chars.length, props.length - 1);
  nextTick(() => {
    inputRefs.value[nextFocus]?.focus();
  });
}
</script>

<template>
  <div
    class="val-otp-container"
    :class="{ 'val-otp--disabled': disabled }"
    role="group"
    aria-label="Código de verificación OTP"
  >
    <input
      v-for="(_, index) in length"
      :key="index"
      ref="inputRefs"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="val-otp-input"
      :disabled="disabled"
      :value="otpValues[index]"
      @input="onInputChange($event, index)"
      @keydown="onKeyDown($event, index)"
      @paste="onPaste"
    />
  </div>
</template>

<style lang="scss">
.val-otp-container {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.val-otp-input {
  width: 3rem;
  height: 3.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 1px solid var(--val-border-color, #cbd5e1);
  border-radius: var(--radius-md, 8px);
  background-color: #ffffff;
  color: var(--val-text-color, #0f172a);
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    border-color: var(--val-primary, #0066ff);
  }

  &:focus {
    border-color: var(--val-primary, #0066ff);
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
  }

  &:disabled {
    background-color: var(--val-disabled-bg, #f1f5f9);
    color: var(--val-disabled-text, #94a3b8);
    cursor: not-allowed;
  }
}
</style>
