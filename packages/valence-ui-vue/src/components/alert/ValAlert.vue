<script setup lang="ts">
import { ref, computed } from 'vue';

export type AlertSeverity = 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'error';
export type AlertVariant = 'filled' | 'outlined' | 'flat' | 'glass';

export interface AlertProps {
  severity?: AlertSeverity;
  variant?: AlertVariant;
  title?: string;
  icon?: string;
  showIcon?: boolean;
  closable?: boolean;
  visible?: boolean;
}

const props = withDefaults(defineProps<AlertProps>(), {
  severity: 'info',
  variant: 'flat',
  title: '',
  icon: '',
  showIcon: true,
  closable: false,
  visible: true
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'close'): void;
}>();

const internalVisible = ref(props.visible);

const isVisible = computed(() => {
  return props.visible !== undefined ? props.visible : internalVisible.value;
});

const normalizedSeverity = computed(() => {
  if (props.severity === 'warn') return 'warning';
  if (props.severity === 'error') return 'danger';
  return props.severity;
});

function handleClose() {
  internalVisible.value = false;
  emit('update:visible', false);
  emit('close');
}
</script>

<template>
  <transition name="val-alert-fade">
    <div
      v-if="isVisible"
      class="val-alert"
      :class="[
        `val-alert--${normalizedSeverity}`,
        `val-alert--${variant}`
      ]"
      :role="normalizedSeverity === 'danger' ? 'alert' : 'status'"
      :aria-live="normalizedSeverity === 'danger' ? 'assertive' : 'polite'"
    >
      <div class="val-alert__container">
        <!-- Icon -->
        <div v-if="showIcon" class="val-alert__icon-container">
          <slot name="icon">
            <!-- Success Icon -->
            <svg
              v-if="normalizedSeverity === 'success'"
              class="val-alert__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>

            <!-- Warning Icon -->
            <svg
              v-else-if="normalizedSeverity === 'warning'"
              class="val-alert__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>

            <!-- Danger / Error Icon -->
            <svg
              v-else-if="normalizedSeverity === 'danger'"
              class="val-alert__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>

            <!-- Info Icon -->
            <svg
              v-else
              class="val-alert__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </slot>
        </div>

        <!-- Content Area -->
        <div class="val-alert__content">
          <div v-if="title || $slots.title" class="val-alert__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="val-alert__message">
            <slot />
          </div>
        </div>

        <!-- Actions Slot -->
        <div v-if="$slots.actions" class="val-alert__actions">
          <slot name="actions" />
        </div>

        <!-- Close Button -->
        <button
          v-if="closable"
          type="button"
          class="val-alert__close-button"
          aria-label="Cerrar alerta"
          @click="handleClose"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.val-alert {
  display: block;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: var(--radius-md, 8px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &__container {
    display: flex;
    padding: 0.875rem 1rem;
    gap: 0.75rem;
    align-items: flex-start;
    position: relative;
  }

  &__icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9375rem;
    line-height: 1.35;
  }

  &__message {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
  }

  &__close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    color: inherit;
    opacity: 0.65;
    transition: opacity 0.2s, background-color 0.2s;
    margin-top: -0.125rem;
    margin-right: -0.25rem;
    flex-shrink: 0;

    &:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.06);
    }

    svg {
      width: 1.125rem;
      height: 1.125rem;
    }
  }

  // Severity variables
  &--success {
    --alert-color: var(--val-success, #22c55e);
    --alert-bg-flat: rgba(34, 197, 94, 0.12);
    --alert-text-flat: #15803d;
  }

  &--info {
    --alert-color: var(--val-info, #0284c7);
    --alert-bg-flat: rgba(2, 132, 199, 0.12);
    --alert-text-flat: #0369a1;
  }

  &--warning {
    --alert-color: var(--val-warning, #f59e0b);
    --alert-bg-flat: rgba(245, 158, 11, 0.12);
    --alert-text-flat: #b45309;
  }

  &--danger {
    --alert-color: var(--val-danger, #ef4444);
    --alert-bg-flat: rgba(239, 68, 68, 0.12);
    --alert-text-flat: #b91c1c;
  }

  // Variants
  &--filled {
    background-color: var(--alert-color);
    color: #ffffff;

    .val-alert__close-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  &--outlined {
    background-color: transparent;
    border: 1px solid var(--alert-color);
    color: var(--alert-color);
  }

  &--flat {
    background-color: var(--alert-bg-flat);
    color: var(--alert-text-flat);
    border: 1px solid transparent;
  }

  &--glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: var(--alert-color);
  }
}

// Fade animation
.val-alert-fade-enter-active,
.val-alert-fade-leave-active {
  transition: all 0.25s ease-out;
}

.val-alert-fade-enter-from,
.val-alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
