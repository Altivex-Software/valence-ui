<script setup lang="ts">
export type ProgressSpinnerSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface ProgressSpinnerProps {
  size?: string;
  strokeWidth?: string | number;
  severity?: ProgressSpinnerSeverity;
}

withDefaults(defineProps<ProgressSpinnerProps>(), {
  size: '2.5rem',
  strokeWidth: '4',
  severity: 'primary'
});
</script>

<template>
  <div
    class="val-progress-spinner"
    :class="`val-progress-spinner--${severity}`"
    :style="{ width: size, height: size }"
    role="progressbar"
    aria-label="Cargando"
  >
    <svg class="val-progress-spinner-svg" viewBox="25 25 50 50">
      <circle
        class="val-progress-spinner-circle"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        :stroke-width="strokeWidth"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.val-progress-spinner {
  display: inline-block;
  position: relative;
  vertical-align: middle;

  &-svg {
    animation: val-spinner-rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
  }

  &-circle {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: val-spinner-dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
  }

  // Severities
  &--primary .val-progress-spinner-circle { stroke: var(--val-primary, #3b82f6); }
  &--secondary .val-progress-spinner-circle { stroke: var(--val-secondary, #64748b); }
  &--success .val-progress-spinner-circle { stroke: var(--val-success, #22c55e); }
  &--danger .val-progress-spinner-circle { stroke: var(--val-danger, #ef4444); }
  &--warning .val-progress-spinner-circle { stroke: var(--val-warning, #f59e0b); }
  &--info .val-progress-spinner-circle { stroke: var(--val-info, #06b6d4); }
}

@keyframes val-spinner-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes val-spinner-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
