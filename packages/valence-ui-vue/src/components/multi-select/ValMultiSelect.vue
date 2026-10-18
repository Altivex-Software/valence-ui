<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ValIcon from '../icon/ValIcon.vue';

export interface MultiSelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type MultiSelectSize = 'sm' | 'md' | 'lg';
export type MultiSelectVariant = 'default' | 'filled' | 'outlined' | 'fieldset' | 'oneLine';
export type MultiSelectSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface MultiSelectProps {
  options?: MultiSelectOption[];
  modelValue?: any[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  emptyMessage?: string;
  size?: MultiSelectSize;
  variant?: MultiSelectVariant;
  severity?: MultiSelectSeverity;
}

const props = withDefaults(defineProps<MultiSelectProps>(), {
  options: () => [],
  modelValue: () => [],
  placeholder: 'Select options',
  disabled: false,
  filter: false,
  filterPlaceholder: 'Search...',
  emptyMessage: 'No results found',
  size: 'md',
  variant: 'default',
  severity: 'primary'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void;
  (e: 'change', value: any[]): void;
}>();

const isOpen = ref(false);
const filterValue = ref('');
const containerRef = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
  const term = filterValue.value.toLowerCase().trim();
  if (!term) return props.options;
  return props.options.filter(o => o.label.toLowerCase().includes(term));
});

const selectedOptions = computed(() => {
  const currentVal = props.modelValue;
  if (!Array.isArray(currentVal) || currentVal.length === 0) return [];
  return props.options.filter(o => currentVal.some(val => JSON.stringify(val) === JSON.stringify(o.value)));
});

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
  filterValue.value = '';
}

function selectOption(option: MultiSelectOption, event: Event) {
  event.stopPropagation();
  if (option.disabled || props.disabled) return;

  let currentVal = [...(props.modelValue || [])];
  const index = currentVal.findIndex(v => JSON.stringify(v) === JSON.stringify(option.value));

  if (index === -1) {
    currentVal.push(option.value);
  } else {
    currentVal.splice(index, 1);
  }

  emit('update:modelValue', currentVal);
  emit('change', currentVal);
}

function removeOption(option: MultiSelectOption, event: Event) {
  event.stopPropagation();
  if (props.disabled) return;

  const currentVal = (props.modelValue || []).filter(v => JSON.stringify(v) !== JSON.stringify(option.value));
  emit('update:modelValue', currentVal);
  emit('change', currentVal);
}

function isSelected(option: MultiSelectOption): boolean {
  if (!Array.isArray(props.modelValue)) return false;
  return props.modelValue.some(val => JSON.stringify(val) === JSON.stringify(option.value));
}

function onDocumentClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close();
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
    class="val-multi-select"
    :class="[
      `val-multi-select-${size}`,
      `val-multi-select-${variant}`,
      `val-multi-select-${severity}`,
      {
        'val-multi-select-open': isOpen,
        'val-multi-select-disabled': disabled
      }
    ]"
    @click="toggle"
  >
    <label v-if="variant === 'fieldset' && label" class="val-multi-select-fieldset-label">
      {{ label }}
    </label>

    <div class="val-multi-select-label-container">
      <div v-if="selectedOptions.length > 0" class="val-multi-select-chips">
        <div
          v-for="opt in selectedOptions"
          :key="String(opt.value)"
          class="val-chip"
          @click="removeOption(opt, $event)"
        >
          <span class="val-chip-text">{{ opt.label }}</span>
          <ValIcon name="x" size="0.75rem" class="val-chip-remove" />
        </div>
      </div>
      <span v-else class="val-multi-select-placeholder">{{ placeholder }}</span>
    </div>

    <div class="val-multi-select-trigger">
      <ValIcon name="chevron-down" size="1rem" class="val-multi-select-trigger-icon" />
    </div>

    <!-- Dropdown Panel -->
    <transition name="val-dropdown-panel">
      <div v-if="isOpen" class="val-multi-select-panel val-elevation-2" @click.stop>
        <div v-if="filter" class="val-multi-select-filter-container">
          <input
            v-model="filterValue"
            type="text"
            class="val-multi-select-filter-input"
            :placeholder="filterPlaceholder"
          />
        </div>

        <ul class="val-multi-select-items">
          <li
            v-for="option in filteredOptions"
            :key="String(option.value)"
            class="val-multi-select-item"
            :class="{
              'val-multi-select-item-selected': isSelected(option),
              'val-multi-select-item-disabled': option.disabled
            }"
            @click="selectOption(option, $event)"
          >
            <div
              class="val-multi-select-checkbox"
              :class="{ 'val-multi-select-checkbox-selected': isSelected(option) }"
            >
              <ValIcon v-if="isSelected(option)" name="check" size="0.875rem" />
            </div>
            <span>{{ option.label }}</span>
          </li>
          <li v-if="filteredOptions.length === 0" class="val-multi-select-empty-message">
            {{ emptyMessage }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/multi-select/multi-select.component.scss';
</style>
