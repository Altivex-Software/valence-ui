<script setup lang="ts">
import { ref } from 'vue';

export interface SpeedDialItem {
  icon?: string;
  label?: string;
  tooltip?: string;
  command?: (event: { item: SpeedDialItem }) => void;
  disabled?: boolean;
}

export type SpeedDialTooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type SpeedDialType = 'linear' | 'circle' | 'semi-circle' | 'quarter-circle';
export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

export interface SpeedDialProps {
  model?: SpeedDialItem[];
  type?: SpeedDialType;
  direction?: SpeedDialDirection;
  radius?: number;
  icon?: string;
  activeIcon?: string;
  disabled?: boolean;
  mask?: boolean;
  showLabels?: boolean;
  rotateAnimation?: boolean;
  hideOnClickOutside?: boolean;
  tooltipPosition?: SpeedDialTooltipPosition;
  styleClass?: string;
  buttonClass?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<SpeedDialProps>(), {
  model: () => [],
  type: 'linear',
  direction: 'up',
  radius: 0,
  icon: 'plus',
  activeIcon: '',
  disabled: false,
  mask: false,
  showLabels: false,
  rotateAnimation: true,
  hideOnClickOutside: true,
  tooltipPosition: 'auto',
  styleClass: '',
  buttonClass: '',
  ariaLabel: 'Speed Dial'
});

const emit = defineEmits<{
  (e: 'click', item: SpeedDialItem): void;
}>();

const isOpen = ref(false);

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function onItemClick(item: SpeedDialItem) {
  if (item.disabled) return;
  if (item.command) item.command({ item });
  emit('click', item);
  isOpen.value = false;
}
</script>

<template>
  <div
    class="val-speed-dial"
    :class="[
      `val-speed-dial--${direction}`,
      { 'val-speed-dial--open': isOpen }
    ]"
  >
    <!-- Primary FAB Button -->
    <button
      type="button"
      class="val-speed-dial-button"
      :class="{ 'val-speed-dial-button--open': isOpen }"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="val-speed-dial-icon" :class="{ 'val-speed-dial-icon--rotate': isOpen }">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </button>

    <!-- SpeedDial Child Action Items -->
    <transition-group
      name="val-speed-dial-item"
      tag="ul"
      class="val-speed-dial-list"
    >
      <li
        v-for="(item, idx) in (isOpen ? model : [])"
        :key="item.label || idx"
        class="val-speed-dial-action"
        :style="{ transitionDelay: `${idx * 35}ms` }"
      >
        <button
          type="button"
          class="val-speed-dial-action-btn"
          :title="item.tooltip || item.label"
          :disabled="item.disabled"
          @click="onItemClick(item)"
        >
          <span class="val-speed-dial-action-icon">{{ item.icon || '•' }}</span>
        </button>
      </li>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.val-speed-dial {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &-button {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    background-color: var(--val-primary, #3b82f6);
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, background-color 0.2s ease;
    z-index: 2;

    &:hover:not(:disabled) {
      background-color: #2563eb;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &--rotate {
      transform: rotate(45deg);
    }
  }

  &-list {
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.5rem;
    z-index: 1;
  }

  // Directions
  &--up &-list {
    bottom: calc(100% + 0.5rem);
    flex-direction: column-reverse;
  }

  &--down &-list {
    top: calc(100% + 0.5rem);
    flex-direction: column;
  }

  &--left &-list {
    right: calc(100% + 0.5rem);
    flex-direction: row-reverse;
  }

  &--right &-list {
    left: calc(100% + 0.5rem);
    flex-direction: row;
  }

  &-action {
    display: inline-flex;

    &-btn {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      color: #334155;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background-color: #f8fafc;
        color: var(--val-primary, #3b82f6);
        border-color: #cbd5e1;
        transform: scale(1.1);
      }
    }

    &-icon {
      font-size: 1.125rem;
      line-height: 1;
    }
  }
}

// Fade scale transitions for items
.val-speed-dial-item-enter-active,
.val-speed-dial-item-leave-active {
  transition: all 0.2s ease;
}

.val-speed-dial-item-enter-from,
.val-speed-dial-item-leave-to {
  opacity: 0;
  transform: scale(0.3);
}
</style>
