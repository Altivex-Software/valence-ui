<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export interface DropdownOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface DropdownProps {
  modelValue?: any;
  options?: (DropdownOption | string | number)[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  emptyMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined' | 'fieldset' | 'oneLine';
  severity?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  multiple?: boolean;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  modelValue: null,
  options: () => [],
  label: '',
  placeholder: 'Select an option',
  disabled: false,
  filter: false,
  filterPlaceholder: 'Search...',
  emptyMessage: 'No results found',
  size: 'md',
  variant: 'default',
  severity: 'primary',
  multiple: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void;
  (e: 'change', val: any): void;
  (e: 'show'): void;
  (e: 'hide'): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const filterText = ref('');

const normalizedOptions = computed<DropdownOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as DropdownOption;
    }
    return {
      label: String(opt),
      value: opt,
      disabled: false
    };
  });
});

const filteredOptions = computed(() => {
  const term = filterText.value.trim().toLowerCase();
  if (!term) return normalizedOptions.value;
  return normalizedOptions.value.filter((opt) =>
    opt.label.toLowerCase().includes(term)
  );
});

function isSelected(option: DropdownOption): boolean {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.some((v) => JSON.stringify(v) === JSON.stringify(option.value));
  }
  return JSON.stringify(props.modelValue) === JSON.stringify(option.value);
}

const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return null;
    const selected = normalizedOptions.value.filter((opt) =>
      props.modelValue.some((v: any) => JSON.stringify(v) === JSON.stringify(opt.value))
    );
    return selected.map((s) => s.label).join(', ');
  }

  const found = normalizedOptions.value.find(
    (opt) => JSON.stringify(opt.value) === JSON.stringify(props.modelValue)
  );
  return found ? found.label : null;
});

function toggle() {
  if (props.disabled) return;
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

function open() {
  isOpen.value = true;
  emit('show');
}

function close() {
  if (!isOpen.value) return;
  isOpen.value = false;
  filterText.value = '';
  emit('hide');
}

function selectOption(option: DropdownOption, event: Event) {
  if (option.disabled) return;

  if (props.multiple) {
    event.stopPropagation();
    let currentVal = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentVal.findIndex((v) => JSON.stringify(v) === JSON.stringify(option.value));

    if (index === -1) {
      currentVal.push(option.value);
    } else {
      currentVal.splice(index, 1);
    }

    emit('update:modelValue', currentVal);
    emit('change', currentVal);
  } else {
    emit('update:modelValue', option.value);
    emit('change', option.value);
    close();
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value || !containerRef.value) return;
  if (!containerRef.value.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleClickOutside);
});
</script>

<template>
  <div
    ref="containerRef"
    class="val-dropdown-wrapper"
    :class="[
      `val-dropdown-${size}`,
      `val-dropdown-${variant}`,
      `val-dropdown-${severity}`,
      {
        'val-dropdown-open': isOpen,
        'val-dropdown-disabled': disabled,
        'val-dropdown-has-label': !!label
      }
    ]"
  >
    <div class="val-dropdown" @click="toggle">
      <label v-if="variant === 'fieldset' && label" class="val-dropdown-fieldset-label">
        {{ label }}
      </label>

      <div
        class="val-dropdown-label"
        :class="{ 'val-dropdown-placeholder': !selectedLabel }"
      >
        {{ selectedLabel || placeholder }}
      </div>

      <div class="val-dropdown-trigger">
        <svg
          class="val-dropdown-trigger-icon"
          :class="{ 'val-dropdown-trigger-icon--rotate': isOpen }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>

    <!-- Dropdown Panel -->
    <transition name="val-dropdown-fade">
      <div v-if="isOpen" class="val-dropdown-panel val-elevation-2">
        <div v-if="filter" class="val-dropdown-filter-container" @click.stop>
          <input
            v-model="filterText"
            type="text"
            class="val-dropdown-filter-input"
            :placeholder="filterPlaceholder"
            autofocus
          />
        </div>

        <ul class="val-dropdown-items" role="listbox">
          <li
            v-for="option in filteredOptions"
            :key="String(option.value)"
            class="val-dropdown-item"
            :class="{
              'val-dropdown-item-selected': isSelected(option),
              'val-dropdown-item-disabled': option.disabled
            }"
            role="option"
            :aria-selected="isSelected(option)"
            @click="selectOption(option, $event)"
          >
            <div
              v-if="multiple"
              class="val-dropdown-checkbox"
              :class="{ 'val-dropdown-checkbox-selected': isSelected(option) }"
            >
              <svg
                v-if="isSelected(option)"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>{{ option.label }}</span>
          </li>

          <li v-if="filteredOptions.length === 0" class="val-dropdown-empty-message">
            {{ emptyMessage }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.val-dropdown-wrapper {
  position: relative;
  width: 100%;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  user-select: none;
  box-sizing: border-box;
}

.val-dropdown {
  display: inline-flex;
  position: relative;
  width: 100%;
  min-width: 60px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  align-items: center;
  padding: 0 12px;
  outline: 0 none;
  box-sizing: border-box;

  &:hover:not(.val-dropdown-disabled) {
    border-color: var(--val-primary, #0066ff);
  }

  &-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.875rem;
    color: #1f2937;

    &.val-dropdown-placeholder {
      color: #9ca3af;
    }
  }

  &-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    margin-left: 8px;

    &-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;

      &--rotate {
        transform: rotate(180deg);
      }
    }
  }
}

/* Sizes */
.val-dropdown-wrapper.val-dropdown-sm {
  .val-dropdown {
    height: 32px;
    padding: 0 8px;
    font-size: 0.75rem;
    .val-dropdown-label { font-size: 0.75rem; }
    .val-dropdown-trigger-icon { width: 14px; height: 14px; }
  }
}

.val-dropdown-wrapper.val-dropdown-lg {
  .val-dropdown {
    height: 48px;
    padding: 0 16px;
    font-size: 1.125rem;
    .val-dropdown-label { font-size: 1.125rem; }
    .val-dropdown-trigger-icon { width: 20px; height: 20px; }
  }
}

/* Variants */
.val-dropdown-wrapper.val-dropdown-filled .val-dropdown {
  background: #f1f5f9;
  border-color: transparent;
  &:hover {
    background: #e2e8f0;
  }
}

.val-dropdown-wrapper.val-dropdown-outlined .val-dropdown {
  background: transparent;
  border: 1px solid #d1d5db;
}

.val-dropdown-wrapper.val-dropdown-oneLine .val-dropdown {
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-bottom: 1px solid #d1d5db;
  padding-left: 4px;
  padding-right: 4px;
}

.val-dropdown-wrapper.val-dropdown-fieldset {
  margin-top: 8px;

  .val-dropdown-fieldset-label {
    position: absolute;
    top: -10px;
    left: 10px;
    background: #ffffff;
    padding: 0 4px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    z-index: 1;
    pointer-events: none;
    transition: color 0.2s;
  }
}

/* Severities */
$val-severities: (
  "primary": #0066ff,
  "secondary": #64748b,
  "success": #22c55e,
  "danger": #ef4444,
  "warning": #f59e0b,
  "info": #06b6d4
);

@each $name, $color in $val-severities {
  .val-dropdown-wrapper.val-dropdown-#{$name} {
    &.val-dropdown-open .val-dropdown,
    &:hover:not(.val-dropdown-disabled) .val-dropdown {
      border-color: $color;
    }
    &.val-dropdown-open .val-dropdown {
      box-shadow: 0 0 0 3px rgba($color, 0.15);
    }
  }
}

/* Disabled */
.val-dropdown-wrapper.val-dropdown-disabled {
  .val-dropdown {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #d1d5db;
  }
}

/* Dropdown Panel */
.val-dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md, 6px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  z-index: 1000;
  box-sizing: border-box;
}

.val-dropdown-filter-container {
  padding: 8px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.val-dropdown-filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-sm, 4px);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  background: #ffffff;
  color: #1e293b;
  box-sizing: border-box;

  &:focus {
    border-color: var(--val-primary, #0066ff);
    box-shadow: 0 0 0 1px rgba(0, 102, 255, 0.2);
  }
}

.val-dropdown-items {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 250px;
  overflow-y: auto;
}

.val-dropdown-item {
  padding: 8px 12px;
  font-size: 0.875rem;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover:not(.val-dropdown-item-disabled) {
    background: #f1f5f9;
    color: var(--val-primary, #0066ff);
  }

  &-selected {
    background: #eff6ff !important;
    color: var(--val-primary, #0066ff) !important;
    font-weight: 600;
  }

  &-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.val-dropdown-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &-selected {
    background: var(--val-primary, #0066ff);
    border-color: var(--val-primary, #0066ff);
  }

  svg {
    width: 12px;
    height: 12px;
    color: #ffffff;
  }
}

.val-dropdown-empty-message {
  padding: 12px;
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: center;
}

/* Animations */
.val-dropdown-fade-enter-active,
.val-dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.val-dropdown-fade-enter-from,
.val-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
