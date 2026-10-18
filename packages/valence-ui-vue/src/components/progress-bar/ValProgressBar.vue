<script setup lang="ts">
import { computed } from 'vue';

export type ProgressBarMode = 'determinate' | 'indeterminate';
export type ProgressBarSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface ProgressBarProps {
  value?: number;
  mode?: ProgressBarMode;
  severity?: ProgressBarSeverity;
  showValue?: boolean;
}

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
  mode: 'determinate',
  severity: 'primary',
  showValue: true
});

const clampedValue = computed(() => {
  return Math.min(100, Math.max(0, props.value));
});
</script>

<template>
  <div
    class="val-progress-bar"
    :class="[
      `val-progress-bar-${severity}`,
      {
        'val-progress-bar-indeterminate': mode === 'indeterminate'
      }
    ]"
    role="progressbar"
    :aria-valuenow="mode === 'determinate' ? clampedValue : undefined"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="val-progress-bar-value"
      :style="{
        width: mode === 'determinate' ? `${clampedValue}%` : undefined
      }"
    >
      <span
        v-if="showValue && mode === 'determinate' && clampedValue > 10"
        class="val-progress-bar-label"
      >
        {{ clampedValue }}%
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.val-progress-bar {
  position: relative;
  width: 100%;
  height: 1.125rem;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &-value {
    height: 100%;
    background: var(--val-primary, #0066ff);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5rem;
    transition: width 0.3s ease-in-out;
    box-sizing: border-box;
  }

  &-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    user-select: none;
  }

  // Severities
  &-primary .val-progress-bar-value { background: var(--val-primary, #0066ff); }
  &-secondary .val-progress-bar-value { background: var(--val-secondary, #64748b); }
  &-success .val-progress-bar-value { background: var(--val-success, #22c55e); }
  &-danger .val-progress-bar-value { background: var(--val-danger, #ef4444); }
  &-warning .val-progress-bar-value { background: var(--val-warning, #f59e0b); }
  &-info .val-progress-bar-value { background: var(--val-info, #06b6d4); }

  // Indeterminate Mode
  &-indeterminate {
    .val-progress-bar-value {
      width: 100% !important;
      position: absolute;
      left: -100%;
      animation: val-progress-bar-indet 1.5s infinite linear;
    }
  }
}

@keyframes val-progress-bar-indet {
  0% {
    left: -100%;
    width: 40%;
  }
  50% {
    left: 30%;
    width: 60%;
  }
  100% {
    left: 100%;
    width: 40%;
  }
}
</style>
