<script setup lang="ts">
import { computed, onUnmounted } from 'vue';

export type KnobVariant = 'default' | 'flat' | 'outline';

export interface KnobProps {
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  disabled?: boolean;
  size?: number;
  variant?: KnobVariant;
  strokeWidth?: number;
  valueColor?: string;
  rangeColor?: string;
}

const props = withDefaults(defineProps<KnobProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  unit: '',
  label: '',
  disabled: false,
  size: 100,
  variant: 'default',
  strokeWidth: 8,
  valueColor: '#3b82f6',
  rangeColor: '#e5e7eb'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
}>();

const dashOffset = computed(() => {
  const range = props.max - props.min;
  const percentage = (props.modelValue - props.min) / (range || 1);
  return 251.2 * (1 - Math.max(0, Math.min(1, percentage)));
});

const rotateIndicator = computed(() => {
  const range = props.max - props.min;
  const percentage = (props.modelValue - props.min) / (range || 1);
  const degrees = Math.max(0, Math.min(1, percentage)) * 360;
  return `rotate(${degrees}deg)`;
});

let isDragging = false;
let startY = 0;
let startValue = 0;

function updateValue(val: number) {
  const clamped = Math.max(props.min, Math.min(props.max, val));
  emit('update:modelValue', clamped);
  emit('change', clamped);
}

function onMouseDown(event: MouseEvent) {
  if (props.disabled) return;
  isDragging = true;
  startY = event.clientY;
  startValue = props.modelValue;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event: MouseEvent) {
  if (!isDragging) return;
  const deltaY = startY - event.clientY;
  const sensitivity = 2;
  const newValue = Math.round(startValue + (deltaY / sensitivity) * props.step);
  updateValue(newValue);
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

function onWheel(event: WheelEvent) {
  if (props.disabled) return;
  event.preventDefault();
  const delta = event.deltaY > 0 ? -props.step : props.step;
  updateValue(props.modelValue + delta);
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div
    class="val-knob-container"
    :class="[
      `val-knob--${variant}`,
      { 'val-knob--disabled': disabled }
    ]"
    :style="{ width: `${size}px` }"
    @mousedown="onMouseDown"
    @wheel="onWheel"
  >
    <svg viewBox="0 0 100 100" class="val-knob-svg">
      <!-- Background Track -->
      <circle
        cx="50"
        cy="50"
        r="40"
        class="val-knob-track"
        :style="{ stroke: rangeColor, strokeWidth: `${strokeWidth}px` }"
        stroke-dasharray="251.2"
        stroke-dashoffset="0"
      />

      <!-- Progress Bar -->
      <circle
        cx="50"
        cy="50"
        r="40"
        class="val-knob-progress"
        :style="{
          stroke: valueColor,
          strokeWidth: `${strokeWidth}px`,
          strokeDashoffset: dashOffset
        }"
        stroke-dasharray="251.2"
      />

      <!-- Center Knob -->
      <circle v-if="variant === 'default'" cx="50" cy="50" r="32" class="val-knob-center" />

      <!-- Indicator Dot -->
      <g v-if="variant !== 'outline'" :style="{ transform: rotateIndicator, transformOrigin: '50% 50%' }">
        <circle cx="50" cy="18" r="4" class="val-knob-indicator" :style="{ fill: valueColor }" />
      </g>

      <!-- Value Text -->
      <text x="50" y="55" text-anchor="middle" class="val-knob-text">
        {{ modelValue }}{{ unit }}
      </text>
    </svg>

    <span v-if="label" class="val-knob-label">{{ label }}</span>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/input/knob.component.scss';
</style>
