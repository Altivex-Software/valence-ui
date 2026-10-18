<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

export interface TextareaProps {
  modelValue?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  autoResize?: boolean;
}

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  id: () => `val-txt-${Math.random().toString(36).substring(2, 9)}`,
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  rows: 3,
  hint: '',
  error: '',
  size: 'md',
  autoResize: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'input', event: Event): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'change', event: Event): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

function adjustHeight() {
  if (!props.autoResize || !textareaRef.value) return;
  textareaRef.value.style.height = 'auto';
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
}

watch(
  () => props.modelValue,
  () => {
    if (props.autoResize) {
      nextTick(adjustHeight);
    }
  }
);

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  emit('input', event);
  if (props.autoResize) {
    adjustHeight();
  }
}

function handleBlur(event: FocusEvent) {
  emit('blur', event);
}

function handleFocus(event: FocusEvent) {
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
      {
        'val-input-wrapper--disabled': disabled,
        'val-input-wrapper--error': !!error
      }
    ]"
  >
    <label v-if="label" :for="id" class="val-input-label">
      {{ label }}
      <span v-if="required" class="val-input-required">*</span>
    </label>

    <div class="val-input-container">
      <textarea
        :id="id"
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        class="val-textarea-field"
        :class="{ 'val-textarea-field--autoresize': autoResize }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
      ></textarea>
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
.val-textarea-field {
  width: 100%;
  padding: 0.75rem;
  font-size: var(--val-input-font-size, 0.9375rem);
  font-family: var(--font-primary, 'Manrope', sans-serif);
  color: var(--val-text-color, #111827);
  background-color: var(--val-bg-color, #ffffff);
  border: 1px solid var(--val-border-color, #d1d5db);
  border-radius: var(--radius-md, 0.375rem);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  outline: none;
  resize: vertical;
  min-height: 5rem;
  box-sizing: border-box;

  &--autoresize {
    resize: none;
    overflow-y: hidden;
  }

  &::placeholder {
    color: var(--val-placeholder-color, #9ca3af);
  }

  &:hover:not(:disabled) {
    border-color: var(--val-primary, #0066ff);
  }

  &:focus:not(:disabled) {
    border-color: var(--val-primary, #0066ff);
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.12);
  }

  &:disabled {
    background-color: var(--val-disabled-bg, #f3f4f6);
    color: var(--val-disabled-text, #9ca3af);
    cursor: not-allowed;
  }
}
</style>
