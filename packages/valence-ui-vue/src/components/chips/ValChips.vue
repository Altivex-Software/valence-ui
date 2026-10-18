<script setup lang="ts">
import { ref } from 'vue';

export interface ChipsProps {
  modelValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  max?: number | null;
  allowDuplicate?: boolean;
  separator?: string;
  addOnBlur?: boolean;
}

const props = withDefaults(defineProps<ChipsProps>(), {
  modelValue: () => [],
  placeholder: 'Agregar tags...',
  disabled: false,
  max: null,
  allowDuplicate: false,
  separator: ',',
  addOnBlur: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void;
  (e: 'chipAdded', chip: string): void;
  (e: 'chipRemoved', data: { chip: string; index: number }): void;
  (e: 'chipClicked', data: { chip: string; index: number }): void;
}>();

const inputEl = ref<HTMLInputElement | null>(null);
const inputValue = ref('');
const isFocused = ref(false);

function focusInput() {
  if (!props.disabled) {
    inputEl.value?.focus();
  }
}

function onFocus() {
  isFocused.value = true;
}

function onBlur() {
  isFocused.value = false;
  if (props.addOnBlur && inputValue.value.trim()) {
    addChip(inputValue.value.trim());
    inputValue.value = '';
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (props.disabled) return;

  if (event.key === 'Enter' || (props.separator && event.key === props.separator)) {
    event.preventDefault();
    const val = inputValue.value.trim();
    if (val) {
      addChip(val);
      inputValue.value = '';
    }
  } else if (event.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
    removeChip(props.modelValue.length - 1);
  }
}

function addChip(chipText: string) {
  if (props.max !== null && props.modelValue.length >= props.max) {
    return;
  }
  if (!props.allowDuplicate && props.modelValue.includes(chipText)) {
    return;
  }

  const next = [...props.modelValue, chipText];
  emit('update:modelValue', next);
  emit('chipAdded', chipText);
}

function removeChip(index: number, event?: Event) {
  if (event) {
    event.stopPropagation();
  }
  if (props.disabled) return;

  const removed = props.modelValue[index];
  const next = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', next);
  emit('chipRemoved', { chip: removed, index });
}

function onChipClick(chip: string, index: number, event: Event) {
  event.stopPropagation();
  emit('chipClicked', { chip, index });
}
</script>

<template>
  <div
    class="val-chips"
    :class="{
      'val-chips-focused': isFocused,
      'val-chips-disabled': disabled
    }"
    @click="focusInput"
  >
    <ul class="val-chips-list">
      <li
        v-for="(chip, index) in modelValue"
        :key="chip + index"
        class="val-chip-item"
      >
        <span class="val-chip-label" @click="onChipClick(chip, index, $event)">
          {{ chip }}
        </span>
        <button
          v-if="!disabled"
          type="button"
          class="val-chip-remove"
          aria-label="Eliminar chip"
          @click="removeChip(index, $event)"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </li>

      <li class="val-chips-input-token">
        <input
          ref="inputEl"
          v-model="inputValue"
          type="text"
          class="val-chips-input"
          :placeholder="modelValue.length === 0 ? placeholder : ''"
          :disabled="disabled"
          @keydown="onKeyDown"
          @focus="onFocus"
          @blur="onBlur"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.val-chips {
  display: inline-block;
  width: 100%;
  min-height: 40px;
  padding: 4px 8px;
  border: 1px solid var(--val-border-color, #cbd5e1);
  border-radius: var(--radius-md, 8px);
  background-color: var(--val-bg-color, #ffffff);
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: text;
  box-sizing: border-box;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  &:hover:not(.val-chips-disabled) {
    border-color: var(--val-primary, #0066ff);
  }

  &-focused {
    border-color: var(--val-primary, #0066ff);
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
  }

  &-disabled {
    background-color: var(--val-disabled-bg, #f1f5f9);
    cursor: not-allowed;
    opacity: 0.7;
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &-input-token {
    flex: 1 1 auto;
    display: inline-flex;
    min-width: 80px;
  }

  &-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
    color: var(--val-text-color, #1e293b);
    padding: 4px 0;
    font-family: inherit;

    &::placeholder {
      color: var(--val-placeholder-color, #94a3b8);
    }
  }
}

.val-chip-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  transition: background-color 0.15s;

  &:hover {
    background: #dbeafe;
  }
}

.val-chip-label {
  cursor: default;
  user-select: none;
}

.val-chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  transition: color 0.15s, background-color 0.15s;

  &:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
  }
}
</style>
