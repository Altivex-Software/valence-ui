<script setup lang="ts">
import { ref, computed, provide, readonly, watch } from 'vue';

export interface StepData {
  id: string;
  label: string;
  optional?: boolean;
  completed?: boolean;
  disabled?: boolean;
}

export interface StepperProps {
  modelValue?: number;
  orientation?: 'horizontal' | 'vertical';
  linear?: boolean;
  headerNavigation?: boolean;
}

const props = withDefaults(defineProps<StepperProps>(), {
  modelValue: 0,
  orientation: 'horizontal',
  linear: false,
  headerNavigation: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'change', val: number): void;
}>();

const steps = ref<StepData[]>([]);
const selectedIndex = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    selectedIndex.value = val;
  }
);

function registerStep(step: StepData) {
  const existing = steps.value.findIndex((s) => s.id === step.id);
  if (existing >= 0) {
    steps.value[existing] = step;
  } else {
    steps.value.push(step);
  }
}

function unregisterStep(id: string) {
  steps.value = steps.value.filter((s) => s.id !== id);
}

provide('valStepperContext', {
  selectedIndex: readonly(selectedIndex),
  steps: readonly(steps),
  orientation: computed(() => props.orientation),
  registerStep,
  unregisterStep
});

const isFirst = computed(() => selectedIndex.value === 0);
const isLast = computed(() => selectedIndex.value === steps.value.length - 1);

function setIndex(index: number) {
  if (props.linear) {
    if (index < selectedIndex.value || index === selectedIndex.value + 1) {
      selectedIndex.value = index;
      emit('update:modelValue', index);
      emit('change', index);
    }
  } else {
    selectedIndex.value = index;
    emit('update:modelValue', index);
    emit('change', index);
  }
}

function next() {
  if (!isLast.value) {
    setIndex(selectedIndex.value + 1);
  }
}

function previous() {
  if (!isFirst.value) {
    setIndex(selectedIndex.value - 1);
  }
}

function reset() {
  setIndex(0);
}

function onStepClick(index: number) {
  if (!props.headerNavigation) return;
  setIndex(index);
}

defineExpose({
  selectedIndex,
  next,
  previous,
  reset,
  setIndex,
  isFirst,
  isLast
});
</script>

<template>
  <div
    class="val-stepper"
    :class="`val-stepper--${orientation}`"
  >
    <!-- Horizontal Mode -->
    <template v-if="orientation === 'horizontal'">
      <div class="val-stepper__header" role="tablist">
        <template v-for="(step, i) in steps" :key="step.id">
          <div
            class="val-stepper__step-header"
            :class="{
              'val-stepper__step-header--active': i === selectedIndex,
              'val-stepper__step-header--completed': i < selectedIndex || step.completed,
              'val-stepper__step-header--disabled': linear && i > selectedIndex,
              'val-stepper__step-header--non-interactive': !headerNavigation
            }"
            role="tab"
            :aria-selected="i === selectedIndex"
            @click="onStepClick(i)"
          >
            <div class="val-stepper__icon">
              <!-- Check icon if completed -->
              <svg
                v-if="(i < selectedIndex) || step.completed"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>

            <div class="val-stepper__label-container">
              <div class="val-stepper__label">{{ step.label }}</div>
              <div v-if="step.optional" class="val-stepper__optional">Opcional</div>
            </div>
          </div>

          <div v-if="i < steps.length - 1" class="val-stepper__line" aria-hidden="true"></div>
        </template>
      </div>

      <!-- Horizontal Steps Content -->
      <div class="val-stepper__content" role="tabpanel">
        <slot></slot>
      </div>
    </template>

    <!-- Vertical Mode -->
    <template v-else>
      <div class="val-stepper__vertical-container">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.val-stepper {
  display: block;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  width: 100%;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  &__step-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.5rem;
    user-select: none;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;

    &--active {
      opacity: 1;
      .val-stepper__icon {
        background-color: var(--val-primary, #0066ff);
        color: #ffffff;
        border-color: var(--val-primary, #0066ff);
        transform: scale(1.05);
      }
      .val-stepper__label {
        font-weight: 700;
        color: var(--val-text-color, #0f172a);
      }
    }

    &--completed {
      opacity: 1;
      .val-stepper__icon {
        background-color: var(--val-success, #22c55e);
        border-color: var(--val-success, #22c55e);
        color: #ffffff;
      }
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }

    &--non-interactive {
      cursor: default;
    }

    &:hover:not(&--disabled) {
      opacity: 1;
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: transparent;
    border: 2px solid var(--val-border-color, #cbd5e1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--val-text-secondary, #64748b);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  &__label-container {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--val-text-color, #334155);
  }

  &__optional {
    font-size: 0.75rem;
    color: var(--val-text-muted, #94a3b8);
  }

  &__line {
    flex: 1;
    height: 2px;
    background-color: var(--val-border-color, #e2e8f0);
    margin: 0 1rem;
    min-width: 20px;
  }

  &__content {
    padding: 1.25rem;
    min-height: 100px;
    border: 1px solid var(--val-border-color, #e2e8f0);
    border-radius: var(--radius-md, 8px);
    background: #ffffff;
  }
}
</style>
