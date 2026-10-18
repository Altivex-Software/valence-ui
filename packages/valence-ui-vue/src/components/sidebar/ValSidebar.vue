<script setup lang="ts">
import { computed } from 'vue';

export type SidebarPosition = 'left' | 'right' | 'top' | 'bottom';

export interface SidebarProps {
  modelValue?: boolean;
  visible?: boolean;
  position?: SidebarPosition;
  header?: string;
  showCloseIcon?: boolean;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<SidebarProps>(), {
  modelValue: false,
  visible: undefined,
  position: 'left',
  header: '',
  showCloseIcon: true,
  dismissible: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'update:visible', val: boolean): void;
  (e: 'hide'): void;
  (e: 'show'): void;
}>();

const isVisible = computed(() =>
  props.visible !== undefined ? props.visible : props.modelValue
);

function close() {
  emit('update:modelValue', false);
  emit('update:visible', false);
  emit('hide');
}

function onMaskClick() {
  if (props.dismissible) {
    close();
  }
}
</script>

<template>
  <teleport to="body">
    <transition name="val-sidebar-fade">
      <div
        v-if="isVisible"
        class="val-sidebar-mask"
        @click="onMaskClick"
      >
        <transition :name="`val-sidebar-slide-${position}`">
          <div
            v-if="isVisible"
            class="val-sidebar"
            :class="`val-sidebar-${position}`"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <div class="val-sidebar-header">
              <slot name="header">
                <span class="val-sidebar-title">{{ header }}</span>
              </slot>

              <button
                v-if="showCloseIcon"
                type="button"
                class="val-sidebar-close"
                aria-label="Cerrar panel"
                @click="close"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="val-sidebar-content">
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss">
.val-sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  z-index: 1200;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  font-family: var(--font-primary, 'Manrope', sans-serif);
}

.val-sidebar {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1201;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;

  &-left {
    top: 0;
    left: 0;
    width: 320px;
    max-width: 85vw;
    height: 100%;
  }

  &-right {
    top: 0;
    right: 0;
    width: 320px;
    max-width: 85vw;
    height: 100%;
  }

  &-top {
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    min-height: 220px;
  }

  &-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    min-height: 220px;
  }

  &-header {
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f5f9;
  }

  &-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: #1e293b;
  }

  &-close {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    line-height: 1;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }

  &-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }
}

// Fade mask
.val-sidebar-fade-enter-active,
.val-sidebar-fade-leave-active {
  transition: opacity 0.25s ease;
}

.val-sidebar-fade-enter-from,
.val-sidebar-fade-leave-to {
  opacity: 0;
}

// Slide Left
.val-sidebar-slide-left-enter-active,
.val-sidebar-slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
}
.val-sidebar-slide-left-enter-from,
.val-sidebar-slide-left-leave-to {
  transform: translateX(-100%);
}

// Slide Right
.val-sidebar-slide-right-enter-active,
.val-sidebar-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
}
.val-sidebar-slide-right-enter-from,
.val-sidebar-slide-right-leave-to {
  transform: translateX(100%);
}

// Slide Top
.val-sidebar-slide-top-enter-active,
.val-sidebar-slide-top-leave-active {
  transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
}
.val-sidebar-slide-top-enter-from,
.val-sidebar-slide-top-leave-to {
  transform: translateY(-100%);
}

// Slide Bottom
.val-sidebar-slide-bottom-enter-active,
.val-sidebar-slide-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
}
.val-sidebar-slide-bottom-enter-from,
.val-sidebar-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
