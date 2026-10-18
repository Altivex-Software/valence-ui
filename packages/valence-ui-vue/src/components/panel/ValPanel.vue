<script setup lang="ts">
import { ref } from 'vue';

export type PanelVariant = 'outlined' | 'flat' | 'seamless';
export type PanelHeaderPosition = 'start' | 'center' | 'end';

export interface PanelProps {
  header?: string;
  variant?: PanelVariant;
  disabled?: boolean;
  headerPosition?: PanelHeaderPosition;
  toggleable?: boolean;
  collapsed?: boolean;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  boxShadow?: 'sm' | 'md' | 'lg' | 'none';
  scrollable?: boolean;
  scrollDirection?: 'x' | 'y' | 'both';
  scrollHeight?: string;
  scrollWidth?: string;
}

const props = withDefaults(defineProps<PanelProps>(), {
  header: '',
  variant: 'outlined',
  disabled: false,
  headerPosition: 'start',
  toggleable: false,
  collapsed: false,
  borderStyle: 'solid',
  boxShadow: 'none',
  scrollable: false,
  scrollDirection: 'y',
  scrollHeight: '300px',
  scrollWidth: '100%'
});

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void;
  (e: 'toggle', value: boolean): void;
}>();

const isCollapsed = ref(props.collapsed);

function toggle() {
  if (props.disabled || !props.toggleable) return;
  isCollapsed.value = !isCollapsed.value;
  emit('update:collapsed', isCollapsed.value);
  emit('toggle', isCollapsed.value);
}
</script>

<template>
  <div
    class="val-panel"
    :class="[
      `val-panel--${variant}`,
      `val-panel--header-${headerPosition}`,
      {
        'val-panel--collapsed': isCollapsed,
        'val-panel--disabled': disabled
      }
    ]"
    :style="{
      '--val-panel-border-style': borderStyle,
      '--val-panel-box-shadow': boxShadow !== 'none' ? `var(--shadow-${boxShadow})` : 'none'
    }"
  >
    <!-- Header -->
    <div
      v-if="header || $slots.header || toggleable"
      class="val-panel__header"
      :class="{ 'val-panel__header--clickable': toggleable && !disabled }"
      @click="toggle"
    >
      <div class="val-panel__title">
        <slot name="header">{{ header }}</slot>
      </div>

      <div class="val-panel__actions">
        <slot name="icons" />

        <button
          v-if="toggleable"
          type="button"
          class="val-panel__toggler"
          :aria-expanded="!isCollapsed"
          @click.stop="toggle"
        >
          <svg
            class="val-panel__caret"
            :class="{ 'val-panel__caret--collapsed': isCollapsed }"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <transition name="val-panel-toggle">
      <div v-show="!isCollapsed" class="val-panel__content-wrapper">
        <div class="val-panel__content">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.val-panel {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md, 8px);
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;

  &--outlined {
    border: 1px solid #e2e8f0;
  }

  &--flat {
    background: #f8fafc;
    border: 1px solid transparent;
  }

  &--seamless {
    border: none;
    box-shadow: none;
    background: transparent;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    user-select: none;

    &--clickable {
      cursor: pointer;

      &:hover {
        background-color: #f1f5f9;
      }
    }
  }

  &--flat &__header {
    background: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  &--seamless &__header {
    background: transparent;
    border-bottom: none;
    padding: 0.5rem 0;
  }

  &__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #64748b;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
      color: #0f172a;
    }
  }

  &__caret {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &--collapsed {
      transform: rotate(-90deg);
    }
  }

  &__content {
    padding: 1rem;
    font-size: 0.875rem;
    color: #334155;
    line-height: 1.5;
  }

  &--seamless &__content {
    padding: 0.5rem 0;
  }
}

.val-panel-toggle-enter-active,
.val-panel-toggle-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.val-panel-toggle-enter-from,
.val-panel-toggle-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
