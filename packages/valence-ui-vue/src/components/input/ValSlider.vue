<script setup lang="ts">
import { computed } from 'vue';

export interface SliderProps {
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValues?: boolean;
}

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValues: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'change', val: number): void;
}>();

const progress = computed(() => {
  const range = props.max - props.min;
  if (range <= 0) return 0;
  return ((props.modelValue - props.min) / range) * 100;
});

function onInput(event: Event) {
  const val = Number((event.target as HTMLInputElement).value);
  emit('update:modelValue', val);
  emit('change', val);
}
</script>

<template>
  <div class="val-slider-wrapper" :class="{ 'val-slider--disabled': disabled }">
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      class="val-slider-input"
      :style="{ '--progress': `${progress}%` }"
      @input="onInput"
    />

    <div v-if="showValues" class="val-slider-values">
      <span class="val-slider-min">{{ min }}</span>
      <span class="val-slider-current">{{ modelValue }}</span>
      <span class="val-slider-max">{{ max }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.val-slider-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.val-slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--val-border-color, #e2e8f0);
  border-radius: 3px;
  background-image: linear-gradient(var(--val-primary, #0066ff), var(--val-primary, #0066ff));
  background-size: var(--progress, 0%) 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    border: 2px solid var(--val-primary, #0066ff);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 0 0 5px rgba(0, 102, 255, 0.15);
  }

  &:focus-visible {
    outline: none;
  }
}

.val-slider-values {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--val-text-hint, #64748b);
  user-select: none;
}

.val-slider-current {
  font-weight: 700;
  color: var(--val-primary, #0066ff);
}
</style>
