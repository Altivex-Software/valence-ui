<script setup lang="ts">
import { computed } from 'vue';

export type SkeletonShape = 'rectangle' | 'circle';
export type SkeletonAnimation = 'wave' | 'pulse' | 'none';

export interface SkeletonProps {
  shape?: SkeletonShape;
  animation?: SkeletonAnimation;
  width?: string;
  height?: string;
  borderRadius?: string;
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rectangle',
  animation: 'wave',
  width: '100%',
  height: '1rem',
  borderRadius: undefined
});

const effectiveBorderRadius = computed(() => {
  if (props.shape === 'circle') return '50%';
  return props.borderRadius || 'var(--radius-md, 6px)';
});
</script>

<template>
  <div
    class="val-skeleton"
    :class="[
      `val-skeleton-animation-${animation}`,
      `val-skeleton-shape-${shape}`
    ]"
    :style="{
      width,
      height,
      borderRadius: effectiveBorderRadius
    }"
    aria-hidden="true"
  ></div>
</template>

<style lang="scss">
.val-skeleton {
  display: block;
  background-color: var(--val-surface-200, #e2e8f0);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &-shape-circle {
    border-radius: 50% !important;
  }
}

.val-skeleton-animation-wave {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.45) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: val-skeleton-wave 1.5s infinite;
  }
}

.val-skeleton-animation-pulse {
  animation: val-skeleton-pulse 1.5s ease-in-out 0.5s infinite;
}

@keyframes val-skeleton-wave {
  100% {
    transform: translateX(100%);
  }
}

@keyframes val-skeleton-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.35; }
  100% { opacity: 1; }
}
</style>
