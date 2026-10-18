<script setup lang="ts">
import { watch } from 'vue';

export interface DialogProps {
  visible?: boolean;
  header?: string;
  modal?: boolean;
  dismissableMask?: boolean;
  closable?: boolean;
  closeOnEscape?: boolean;
  hasFooter?: boolean;
  width?: string;
}

const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  header: '',
  modal: true,
  dismissableMask: false,
  closable: true,
  closeOnEscape: true,
  hasFooter: true,
  width: '480px'
});

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'close'): void;
}>();

function close() {
  emit('update:visible', false);
  emit('close');
}

function onBackdropClick() {
  if (props.dismissableMask) {
    close();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (props.closeOnEscape && event.key === 'Escape' && props.visible) {
    close();
  }
}

// Lock body scroll when modal is active
watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.modal) {
        document.body.classList.add('val-overflow-hidden');
      }
      window.addEventListener('keydown', onKeydown);
    } else {
      document.body.classList.remove('val-overflow-hidden');
      window.removeEventListener('keydown', onKeydown);
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="val-dialog-fade">
      <div
        v-if="visible"
        class="val-dialog-mask"
        :class="{ 'val-dialog-mask--modal': modal }"
        @click.self="onBackdropClick"
      >
        <div
          class="val-dialog"
          role="dialog"
          :aria-modal="modal"
          :style="{ width: width, maxWidth: '90vw' }"
        >
          <!-- Header -->
          <div class="val-dialog-header">
            <slot name="header">
              <span class="val-dialog-title">{{ header }}</span>
            </slot>
            <button
              v-if="closable"
              type="button"
              class="val-dialog-close-btn"
              aria-label="Cerrar"
              @click="close"
            >
              ✕
            </button>
          </div>

          <!-- Content Body -->
          <div class="val-dialog-content">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="val-dialog-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.val-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(4px);
  padding: 1rem;
  box-sizing: border-box;
}

.val-dialog {
  background: white;
  border-radius: var(--radius-lg, 10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--val-border-color, #e2e8f0);
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &-header {
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--val-border-color, #e2e8f0);
  }

  &-title {
    font-weight: 700;
    font-size: 1.15rem;
    color: var(--val-text-color, #1e293b);
  }

  &-close-btn {
    background: transparent;
    border: none;
    font-size: 1rem;
    color: #64748b;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }

  &-content {
    padding: 1.5rem;
    overflow-y: auto;
    color: var(--val-text-color, #374151);
    line-height: 1.5;
  }

  &-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--val-border-color, #e2e8f0);
    background: var(--val-readonly-bg, #f8fafc);
  }
}

.val-dialog-fade-enter-active,
.val-dialog-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.val-dialog-fade-enter-from,
.val-dialog-fade-leave-to {
  opacity: 0;
}

.val-dialog-fade-enter-from .val-dialog,
.val-dialog-fade-leave-to .val-dialog {
  transform: scale(0.95);
}
</style>
