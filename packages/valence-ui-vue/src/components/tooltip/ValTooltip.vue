<script setup lang="ts">
import { ref } from 'vue';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  text?: string;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  position: 'top',
  delay: 150,
  disabled: false
});

const isVisible = ref(false);
let timeoutId: number | null = null;

function show() {
  if (props.disabled || (!props.text && !hasContentSlot)) return;
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = window.setTimeout(() => {
    isVisible.value = true;
  }, props.delay);
}

function hide() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  isVisible.value = false;
}

const hasContentSlot = true; // supports custom template slot
</script>

<template>
  <div
    class="val-tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <transition name="val-tooltip-fade">
      <div
        v-if="isVisible"
        class="val-tooltip"
        :class="`val-tooltip--${position}`"
        role="tooltip"
      >
        <slot name="content">{{ text }}</slot>
        <span class="val-tooltip__arrow" />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.val-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.val-tooltip {
  position: absolute;
  z-index: 1100;
  background-color: #1e293b;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.35;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

  &__arrow {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #1e293b;
    transform: rotate(45deg);
  }

  // Positions
  &--top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);

    .val-tooltip__arrow {
      bottom: -3px;
      left: calc(50% - 3px);
    }
  }

  &--bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);

    .val-tooltip__arrow {
      top: -3px;
      left: calc(50% - 3px);
    }
  }

  &--left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);

    .val-tooltip__arrow {
      right: -3px;
      top: calc(50% - 3px);
    }
  }

  &--right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);

    .val-tooltip__arrow {
      left: -3px;
      top: calc(50% - 3px);
    }
  }
}

// Fade animation
.val-tooltip-fade-enter-active,
.val-tooltip-fade-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.val-tooltip-fade-enter-from,
.val-tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);

  &.val-tooltip--top {
    transform: translateX(-50%) translateY(4px) scale(0.95);
  }
  &.val-tooltip--bottom {
    transform: translateX(-50%) translateY(-4px) scale(0.95);
  }
  &.val-tooltip--left {
    transform: translateY(-50%) translateX(4px) scale(0.95);
  }
  &.val-tooltip--right {
    transform: translateY(-50%) translateX(-4px) scale(0.95);
  }
}
</style>
