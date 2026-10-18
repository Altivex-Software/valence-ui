<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonVariant, ValenceSize, ValenceSeverity, ValenceColor } from '../../types';
import ValIcon from '../icon/ValIcon.vue';

export interface ButtonProps {
  label?: string;
  icon?: string;
  iconPos?: 'left' | 'right';
  variant?: ButtonVariant;
  size?: ValenceSize;
  boxShadow?: ValenceSize | 'none';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  borderRadius?: string;
  badge?: string | number;
  badgeSeverity?: ValenceSeverity | ValenceColor;
  badgeOverlay?: boolean;
  ariaLabel?: string | null;
  ariaDescribedBy?: string | null;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaControls?: string | null;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'sm',
  boxShadow: 'none',
  disabled: false,
  type: 'button',
  iconPos: 'left',
  badgeOverlay: true,
  ariaLabel: null,
  ariaDescribedBy: null,
  ariaControls: null
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const buttonClasses = computed(() => [
  'val-button',
  `val-button--${props.variant}`,
  `val-button--${props.size}`,
  props.boxShadow !== 'none' ? `val-button--shadow-${props.boxShadow}` : '',
  props.disabled ? 'val-button--disabled' : ''
].filter(Boolean));

const isNativeIcon = computed(() => {
  return props.icon && !props.icon.includes(' ') && !props.icon.startsWith('pi-') && !props.icon.startsWith('fa-');
});

const effectiveAriaLabel = computed(() => {
  const label = props.ariaLabel || props.label;
  if (props.badge !== undefined && label) {
    return `${label}, ${props.badge} notifications`;
  }
  return label || null;
});

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    :aria-disabled="disabled"
    :aria-label="effectiveAriaLabel || undefined"
    :aria-describedby="ariaDescribedBy || undefined"
    :aria-expanded="ariaExpanded"
    :aria-pressed="ariaPressed"
    :aria-controls="ariaControls || undefined"
    :style="borderRadius ? { borderRadius } : undefined"
    @click="handleClick"
  >
    <!-- Left Icon -->
    <template v-if="icon && iconPos === 'left'">
      <ValIcon v-if="isNativeIcon" :name="icon" :size="size === 'lg' ? '1.25rem' : size === 'sm' ? '0.875rem' : '1rem'" class="val-mr-1" />
      <i v-else :class="['val-button-icon', icon, 'val-mr-1']" />
    </template>

    <!-- Slot Content -->
    <slot />

    <!-- Label -->
    <span v-if="label" class="val-button-label">{{ label }}</span>

    <!-- Right Icon -->
    <template v-if="icon && iconPos === 'right'">
      <ValIcon v-if="isNativeIcon" :name="icon" :size="size === 'lg' ? '1.25rem' : size === 'sm' ? '0.875rem' : '1rem'" class="val-ml-1" />
      <i v-else :class="['val-button-icon', icon, 'val-ml-1']" />
    </template>

    <!-- Badge -->
    <span
      v-if="badge !== undefined"
      :class="[
        'val-badge',
        `val-badge--${badgeSeverity || 'danger'}`,
        'val-badge--sm',
        { 'val-badge--overlay': badgeOverlay }
      ]"
      aria-hidden="true"
    >
      {{ badge }}
    </span>
  </button>
</template>

<style lang="scss">
.val-button {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm, 8px);
  font-family: var(--font-primary, 'Manrope', sans-serif);
  font-weight: 500;
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  transition: all var(--transition, 150ms ease-in-out);
  border: 1px solid transparent;
  outline: none;
  white-space: nowrap;
  user-select: none;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;

  &.val-button--disabled {
    cursor: not-allowed !important;
    opacity: 0.5 !important;
    pointer-events: none !important;
  }

  // Sizes
  &.val-button--sm {
    padding: var(--spacing-xs, 4px) var(--spacing-sm, 10px);
    font-size: 13px;
    height: 32px;
  }

  &.val-button--md {
    padding: var(--spacing-sm, 8px) var(--spacing-md, 14px);
    font-size: 14px;
    height: 40px;
  }

  &.val-button--lg {
    padding: var(--spacing-md, 12px) var(--spacing-lg, 20px);
    font-size: 16px;
    height: 48px;
  }

  // Solid Variants
  &.val-button--primary { background: var(--val-primary, #0066ff); color: white; &:hover { background: var(--val-primary-hover, #0052cc); } }
  &.val-button--secondary { background: var(--val-secondary, #6c757d); color: white; &:hover { background: var(--val-secondary-hover, #5c636a); } }
  &.val-button--success { background: var(--val-success, #28a745); color: white; &:hover { background: var(--val-success-hover, #218838); } }
  &.val-button--warning { background: var(--val-warning, #ffc107); color: #212529; &:hover { background: var(--val-warning-hover, #e0a800); } }
  &.val-button--danger { background: var(--val-danger, #dc3545); color: white; &:hover { background: var(--val-danger-hover, #c82333); } }
  &.val-button--info { background: var(--val-info, #0dcaf0); color: #212529; &:hover { background: var(--val-info-hover, #0bb5d6); } }

  // Outline Variants
  &.val-button--outline-primary { border-color: var(--val-primary, #0066ff); color: var(--val-primary, #0066ff); background: transparent; &:hover { background: rgba(0, 102, 255, 0.08); } }
  &.val-button--outline-secondary { border-color: var(--val-secondary, #6c757d); color: var(--val-secondary, #6c757d); background: transparent; &:hover { background: rgba(108, 117, 125, 0.08); } }
  &.val-button--outline-success { border-color: var(--val-success, #28a745); color: var(--val-success, #28a745); background: transparent; &:hover { background: rgba(40, 167, 69, 0.08); } }
  &.val-button--outline-warning { border-color: var(--val-warning, #ffc107); color: var(--val-warning, #ffc107); background: transparent; &:hover { background: rgba(255, 193, 7, 0.15); } }
  &.val-button--outline-danger { border-color: var(--val-danger, #dc3545); color: var(--val-danger, #dc3545); background: transparent; &:hover { background: rgba(220, 53, 69, 0.08); } }
  &.val-button--outline-info { border-color: var(--val-info, #0dcaf0); color: var(--val-info, #0dcaf0); background: transparent; &:hover { background: rgba(13, 202, 240, 0.08); } }

  // Ghost Variants
  &.val-button--ghost-primary { border-color: transparent; color: var(--val-primary, #0066ff); background: transparent; &:hover { background: rgba(0, 102, 255, 0.08); } }
  &.val-button--ghost-secondary { border-color: transparent; color: var(--val-secondary, #6c757d); background: transparent; &:hover { background: rgba(108, 117, 125, 0.08); } }
  &.val-button--ghost-success { border-color: transparent; color: var(--val-success, #28a745); background: transparent; &:hover { background: rgba(40, 167, 69, 0.08); } }
  &.val-button--ghost-warning { border-color: transparent; color: var(--val-warning, #ffc107); background: transparent; &:hover { background: rgba(255, 193, 7, 0.15); } }
  &.val-button--ghost-danger { border-color: transparent; color: var(--val-danger, #dc3545); background: transparent; &:hover { background: rgba(220, 53, 69, 0.08); } }
  &.val-button--ghost-info { border-color: transparent; color: var(--val-info, #0dcaf0); background: transparent; &:hover { background: rgba(13, 202, 240, 0.08); } }

  // Shadows
  &.val-button--shadow-sm { box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.12)); }
  &.val-button--shadow-md { box-shadow: var(--shadow-md, 0 3px 8px rgba(0,0,0,0.15)); }
}
</style>
