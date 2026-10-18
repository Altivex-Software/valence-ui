<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

let nextId = 0;

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerVariant = 'default' | 'fieldset' | 'oneLine';

export interface DatePickerProps {
  modelValue?: Date | string | null;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  error?: string;
  size?: DatePickerSize;
  floatLabel?: boolean;
  variant?: DatePickerVariant;
  format?: 'YYYY-MM-DD' | 'DD/MM/YYYY';
  clearable?: boolean;
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  id: '',
  label: '',
  placeholder: 'Seleccionar fecha...',
  disabled: false,
  required: false,
  size: 'md',
  floatLabel: false,
  variant: 'default',
  format: 'YYYY-MM-DD',
  clearable: true
});

const defaultId = `val-dp-${++nextId}`;
const effectiveId = computed(() => props.id || defaultId);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | null): void;
  (e: 'change', val: string | null): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Calendar internal viewing date
const viewDate = ref(new Date());

const currentYear = computed(() => viewDate.value.getFullYear());
const currentMonth = computed(() => viewDate.value.getMonth());
const currentMonthName = computed(() => monthNames[currentMonth.value]);

function parseDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

const selectedDate = computed(() => parseDate(props.modelValue));

const formattedValue = computed(() => {
  if (!selectedDate.value) return '';
  const d = selectedDate.value;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (props.format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  }
  return `${year}-${month}-${day}`;
});

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const days: CalendarDay[] = [];
  const today = new Date();

  // Prev month padding days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: d,
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
      isSelected: selectedDate.value ? isSameDay(d, selectedDate.value) : false
    });
  }

  // Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
      isSelected: selectedDate.value ? isSameDay(d, selectedDate.value) : false
    });
  }

  // Next month padding days to fill 35 or 42 grid slots
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
      isSelected: selectedDate.value ? isSameDay(d, selectedDate.value) : false
    });
  }

  return days;
});

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function prevMonth() {
  viewDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
}

function nextMonth() {
  viewDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
}

function selectDay(day: CalendarDay) {
  const year = day.date.getFullYear();
  const month = String(day.date.getMonth() + 1).padStart(2, '0');
  const d = String(day.date.getDate()).padStart(2, '0');
  const str = `${year}-${month}-${d}`;

  emit('update:modelValue', str);
  emit('change', str);
  isOpen.value = false;
}

function clear(event: MouseEvent) {
  event.stopPropagation();
  emit('update:modelValue', null);
  emit('change', null);
}

function toggle() {
  if (props.disabled) return;
  if (!isOpen.value && selectedDate.value) {
    viewDate.value = new Date(selectedDate.value);
  }
  isOpen.value = !isOpen.value;
}

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value || !containerRef.value) return;
  if (!containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
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
    class="val-input-wrapper val-datepicker-wrapper"
    :class="[
      `val-input-wrapper--${size}`,
      variant === 'fieldset' ? 'val-input-wrapper--fieldset' : '',
      variant === 'oneLine' ? 'val-input-wrapper--oneLine' : '',
      {
        'val-input-wrapper--disabled': disabled,
        'val-input-wrapper--error': !!error,
        'val-input-wrapper--float': floatLabel,
        'val-input-wrapper--has-value': !!formattedValue,
        'val-input-wrapper--open': isOpen,
        'val-datepicker--disabled': disabled
      }
    ]"
  >
    <label v-if="label" class="val-input-label" :for="effectiveId" @click="toggle">
      {{ label }}
      <span v-if="required" class="val-input-required">*</span>
    </label>

    <div class="val-input-container" @click="toggle">
      <input
        :id="effectiveId"
        type="text"
        :value="formattedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        class="val-input-field val-datepicker-input"
      />

      <div class="val-datepicker-trigger">
        <button
          v-if="clearable && formattedValue && !disabled"
          type="button"
          class="val-datepicker-clear-btn"
          aria-label="Limpiar fecha"
          @click="clear"
        >
          ✕
        </button>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
    </div>

    <div v-if="error" class="val-input-error" role="alert">{{ error }}</div>
    <div v-else-if="hint" class="val-input-hint">{{ hint }}</div>

    <!-- Calendar Dropdown Panel -->
    <transition name="val-datepicker-fade">
      <div v-if="isOpen" class="val-datepicker-panel" @click.stop>
        <div class="val-datepicker-header">
          <button
            type="button"
            class="val-datepicker-nav-btn"
            aria-label="Mes anterior"
            @click="prevMonth"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <span class="val-datepicker-month-year">
            {{ currentMonthName }} {{ currentYear }}
          </span>

          <button
            type="button"
            class="val-datepicker-nav-btn"
            aria-label="Mes siguiente"
            @click="nextMonth"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="val-datepicker-calendar">
          <div class="val-datepicker-weekdays">
            <span v-for="w in weekDays" :key="w" class="val-datepicker-weekday">
              {{ w }}
            </span>
          </div>

          <div class="val-datepicker-days">
            <button
              v-for="(day, idx) in calendarDays"
              :key="idx"
              type="button"
              class="val-datepicker-day"
              :class="{
                'val-datepicker-day--other-month': !day.isCurrentMonth,
                'val-datepicker-day--today': day.isToday,
                'val-datepicker-day--selected': day.isSelected
              }"
              @click="selectDay(day)"
            >
              {{ day.dayNumber }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.val-datepicker-wrapper {
  position: relative;
  width: 100%;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  .val-input-label {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--val-text-color, #334155);
  }

  .val-datepicker-input {
    cursor: pointer !important;
    padding-right: 2.75rem !important;
  }

  .val-datepicker-trigger {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--val-text-hint, #64748b);
    pointer-events: none;
  }

  .val-datepicker-clear-btn {
    pointer-events: auto;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: #e2e8f0;
      color: #1e293b;
    }
  }
}

.val-datepicker-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background-color: #ffffff;
  border: 1px solid var(--val-border-color, #e2e8f0);
  border-radius: var(--radius-md, 8px);
  padding: 1rem;
  width: 280px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  user-select: none;
  z-index: 1000;
  box-sizing: border-box;
}

.val-datepicker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.val-datepicker-month-year {
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--val-text-color, #0f172a);
}

.val-datepicker-nav-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm, 4px);
  color: var(--val-text-secondary, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f1f5f9;
    color: var(--val-primary, #0066ff);
  }
}

.val-datepicker-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.375rem;
}

.val-datepicker-weekday {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--val-text-hint, #94a3b8);
}

.val-datepicker-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.val-datepicker-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8125rem;
  border-radius: var(--radius-sm, 4px);
  border: none;
  background: transparent;
  color: var(--val-text-color, #1e293b);
  transition: background-color 0.15s, color 0.15s;

  &:hover:not(&--selected) {
    background-color: #f1f5f9;
  }

  &--other-month {
    color: var(--val-disabled-text, #cbd5e1);
  }

  &--today {
    color: var(--val-primary, #0066ff);
    font-weight: 700;
    box-shadow: inset 0 0 0 1px var(--val-primary, #0066ff);
  }

  &--selected {
    background-color: var(--val-primary, #0066ff) !important;
    color: #ffffff !important;
    font-weight: 600;
  }
}

// Fade animation
.val-datepicker-fade-enter-active,
.val-datepicker-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.val-datepicker-fade-enter-from,
.val-datepicker-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
