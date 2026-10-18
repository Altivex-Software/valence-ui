<script setup lang="ts">
import { computed } from 'vue';
import { useToast, type ToastPosition } from '../../composables/useToast';

interface ToastProps {
  position?: ToastPosition;
}

const props = defineProps<ToastProps>();
const toast = useToast();

const effectivePosition = computed(() => props.position || toast.position.value);

function close(id?: number) {
  if (id !== undefined) {
    toast.remove(id);
  }
}
</script>

<template>
  <teleport to="body">
    <div
      class="val-toast-container"
      :class="`val-toast-${effectivePosition}`"
    >
      <transition-group name="val-toast-anim">
        <div
          v-for="msg in toast.messages.value"
          :key="msg.id"
          class="val-toast-item"
          :class="[
            `val-toast-item-${msg.severity || 'info'}`,
            `val-toast-item-${msg.variant || 'standard'}`
          ]"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="val-toast-item-content">
            <span class="val-toast-icon">
              <!-- Success -->
              <svg
                v-if="msg.severity === 'success'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <!-- Warn / Warning -->
              <svg
                v-else-if="msg.severity === 'warning' || msg.severity === 'warn'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <!-- Danger / Error -->
              <svg
                v-else-if="msg.severity === 'danger' || msg.severity === 'error'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <!-- Info / Secondary / Default -->
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </span>

            <div class="val-toast-message-text">
              <div v-if="msg.summary" class="val-toast-summary">{{ msg.summary }}</div>
              <div v-if="msg.detail" class="val-toast-detail">{{ msg.detail }}</div>
            </div>

            <button
              v-if="msg.closable"
              type="button"
              class="val-toast-close-button"
              aria-label="Cerrar notificación"
              @click="close(msg.id)"
            >
              <span class="val-toast-close-icon">×</span>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style lang="scss">
.val-toast-container {
  position: fixed;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 350px;
  max-width: 90vw;
  pointer-events: none;
  padding: 1rem;
  box-sizing: border-box;

  &.val-toast-top-right { top: 0; right: 0; }
  &.val-toast-top-left { top: 0; left: 0; }
  &.val-toast-top-center { top: 0; left: 50%; transform: translateX(-50%); }
  &.val-toast-bottom-right { bottom: 0; right: 0; }
  &.val-toast-bottom-left { bottom: 0; left: 0; }
  &.val-toast-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }
  &.val-toast-center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
}

.val-toast-item {
  pointer-events: auto;
  background: #ffffff;
  border-radius: var(--radius-md, 6px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  
  &-content {
    padding: var(--spacing-lg, 1rem);
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md, 0.75rem);
  }

  .val-toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  /* Variants */
  &.val-toast-item-standard {
    border-left: 6px solid #ccc;
    
    &.val-toast-item-success {
      border-left-color: var(--val-success, #22c55e);
      .val-toast-summary { color: var(--val-success, #22c55e); }
      .val-toast-icon { color: var(--val-success, #22c55e); }
    }
    &.val-toast-item-info {
      border-left-color: var(--val-info, #06b6d4);
      .val-toast-summary { color: var(--val-info, #06b6d4); }
      .val-toast-icon { color: var(--val-info, #06b6d4); }
    }
    &.val-toast-item-warn, &.val-toast-item-warning {
      border-left-color: var(--val-warning, #f59e0b);
      .val-toast-summary { color: var(--val-warning, #f59e0b); }
      .val-toast-icon { color: var(--val-warning, #f59e0b); }
    }
    &.val-toast-item-error, &.val-toast-item-danger {
      border-left-color: var(--val-danger, #ef4444);
      .val-toast-summary { color: var(--val-danger, #ef4444); }
      .val-toast-icon { color: var(--val-danger, #ef4444); }
    }
    &.val-toast-item-secondary {
      border-left-color: var(--val-secondary, #64748b);
      .val-toast-summary { color: var(--val-secondary, #64748b); }
      .val-toast-icon { color: var(--val-secondary, #64748b); }
    }
  }

  &.val-toast-item-filled {
    color: #ffffff;
    .val-toast-detail { color: rgba(255, 255, 255, 0.85); }
    .val-toast-close-button { color: rgba(255, 255, 255, 0.7); &:hover { color: #ffffff; } }
    .val-toast-icon { color: #ffffff; }

    &.val-toast-item-success { background: var(--val-success, #22c55e); .val-toast-summary { color: #ffffff; } }
    &.val-toast-item-info { background: var(--val-info, #06b6d4); .val-toast-summary { color: #ffffff; } }
    &.val-toast-item-warn, &.val-toast-item-warning {
      background: var(--val-warning, #f59e0b);
      color: #212529;
      .val-toast-detail { color: rgba(0, 0, 0, 0.7); }
      .val-toast-close-button { color: rgba(0, 0, 0, 0.5); &:hover { color: #000000; } }
      .val-toast-summary { color: #000000; }
      .val-toast-icon { color: #000000; }
    }
    &.val-toast-item-error, &.val-toast-item-danger { background: var(--val-danger, #ef4444); .val-toast-summary { color: #ffffff; } }
    &.val-toast-item-secondary { background: var(--val-secondary, #64748b); .val-toast-summary { color: #ffffff; } }
  }

  &.val-toast-item-outlined {
    background: transparent;
    border: 1px solid #ccc;
    backdrop-filter: blur(8px);

    &.val-toast-item-success {
      border-color: var(--val-success, #22c55e);
      background: rgba(34, 197, 94, 0.05);
      .val-toast-summary, .val-toast-icon { color: var(--val-success, #22c55e); }
    }
    &.val-toast-item-info {
      border-color: var(--val-info, #06b6d4);
      background: rgba(6, 182, 212, 0.05);
      .val-toast-summary, .val-toast-icon { color: var(--val-info, #06b6d4); }
    }
    &.val-toast-item-warn, &.val-toast-item-warning {
      border-color: var(--val-warning, #f59e0b);
      background: rgba(245, 158, 11, 0.05);
      .val-toast-summary, .val-toast-icon { color: var(--val-warning, #f59e0b); }
    }
    &.val-toast-item-error, &.val-toast-item-danger {
      border-color: var(--val-danger, #ef4444);
      background: rgba(239, 68, 68, 0.05);
      .val-toast-summary, .val-toast-icon { color: var(--val-danger, #ef4444); }
    }
    &.val-toast-item-secondary {
      border-color: var(--val-secondary, #64748b);
      background: rgba(100, 116, 139, 0.05);
      .val-toast-summary, .val-toast-icon { color: var(--val-secondary, #64748b); }
    }
  }
}

.val-toast-message-text {
  flex: 1;
}

.val-toast-summary {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.val-toast-detail {
  font-size: 0.875rem;
  color: #64748b;
}

.val-toast-close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  font-size: 1.25rem;
  color: #94a3b8;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #475569;
  }
}

/* Animations */
.val-toast-anim-enter-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.val-toast-anim-leave-active {
  transition: transform 0.25s ease-in, opacity 0.25s ease-in;
}

.val-toast-anim-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.val-toast-anim-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
