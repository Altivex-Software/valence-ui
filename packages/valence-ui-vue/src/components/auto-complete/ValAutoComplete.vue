<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ValIcon from '../icon/ValIcon.vue';

export type AutoCompleteSize = 'sm' | 'md' | 'lg';
export type AutoCompleteVariant = 'default' | 'filled' | 'outlined' | 'fieldset' | 'oneLine';
export type AutoCompleteSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface AutoCompleteProps {
  modelValue?: any;
  suggestions?: any[];
  field?: string;
  optionLabel?: string;
  label?: string;
  dropdown?: boolean;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
  size?: AutoCompleteSize;
  variant?: AutoCompleteVariant;
  severity?: AutoCompleteSeverity;
}

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  modelValue: '',
  suggestions: () => [],
  field: '',
  optionLabel: '',
  label: '',
  dropdown: false,
  placeholder: 'Escribe para buscar...',
  disabled: false,
  emptyMessage: 'No results found',
  size: 'md',
  variant: 'default',
  severity: 'primary'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'complete', event: { query: string }): void;
  (e: 'select', item: any): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const effectiveField = computed(() => props.field || props.optionLabel);

const inputValue = ref(getDisplayValue(props.modelValue));

function getDisplayValue(item: any): string {
  if (item == null) return '';
  const key = effectiveField.value;
  if (typeof item === 'object' && key && item[key]) {
    return String(item[key]);
  }
  return String(item);
}

function onInput(event: Event) {
  const query = (event.target as HTMLInputElement).value;
  inputValue.value = query;
  emit('update:modelValue', query);
  emit('complete', { query });
  isOpen.value = true;
}

function selectItem(item: any) {
  inputValue.value = getDisplayValue(item);
  emit('update:modelValue', item);
  emit('select', item);
  isOpen.value = false;
}

function toggleDropdown(event?: Event) {
  event?.stopPropagation();
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    emit('complete', { query: inputValue.value });
  }
}

function onDocumentClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
  <div
    ref="containerRef"
    class="val-autocomplete"
    :class="[
      `val-autocomplete-${size}`,
      `val-autocomplete-${variant}`,
      `val-autocomplete-${severity}`,
      {
        'val-autocomplete-open': isOpen,
        'val-autocomplete-disabled': disabled
      }
    ]"
  >
    <label v-if="variant === 'fieldset' && label" class="val-autocomplete-fieldset-label">
      {{ label }}
    </label>

    <div class="val-autocomplete-input-container">
      <input
        type="text"
        class="val-autocomplete-input"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
        @focus="isOpen = true"
      />

      <button
        v-if="dropdown"
        type="button"
        class="val-autocomplete-dropdown-btn"
        tabindex="-1"
        :disabled="disabled"
        @click="toggleDropdown"
      >
        <ValIcon name="chevron-down" size="0.875rem" />
      </button>
    </div>

    <!-- Suggestions Panel -->
    <transition name="val-dropdown-panel">
      <div v-if="isOpen" class="val-autocomplete-panel val-elevation-2">
        <ul class="val-autocomplete-items">
          <li
            v-for="(item, idx) in suggestions"
            :key="idx"
            class="val-autocomplete-item"
            @click="selectItem(item)"
          >
            <slot name="item" :item="item">
              {{ getDisplayValue(item) }}
            </slot>
          </li>
          <li v-if="suggestions.length === 0" class="val-autocomplete-empty-message">
            {{ emptyMessage }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/auto-complete/auto-complete.component.scss';
</style>
