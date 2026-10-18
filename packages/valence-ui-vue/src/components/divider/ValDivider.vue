<script setup lang="ts">
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerLabelPosition = 'start' | 'center' | 'end';
export type DividerBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  labelPosition?: DividerLabelPosition;
  labelFontWeight?: string | number;
  borderStyle?: DividerBorderStyle;
  resizable?: boolean;
  thickness?: string;
  color?: string;
}

withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  label: '',
  labelPosition: 'center',
  labelFontWeight: 'normal',
  borderStyle: 'solid',
  resizable: false,
  thickness: '1px',
  color: 'var(--val-border-color, #e0e0e0)'
});
</script>

<template>
  <div
    class="val-divider"
    :class="[
      `val-divider--${orientation}`,
      `val-divider--label-${labelPosition}`,
      {
        'val-divider--has-label': !!label || !!$slots.default,
        'val-divider--resizable': resizable
      }
    ]"
    :style="{
      '--val-divider-style': borderStyle,
      '--val-divider-thickness': thickness,
      '--val-divider-color': color
    }"
    role="separator"
    :aria-orientation="orientation"
  >
    <span
      v-if="label || $slots.default"
      class="val-divider__label"
      :style="{ fontWeight: labelFontWeight }"
    >
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<style lang="scss">
.val-divider {
  display: block;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  // Horizontal
  &--horizontal {
    width: 100%;
    margin: 1.25rem 0;
    border-top: 1px var(--val-divider-style, solid) var(--val-border-color, #e2e8f0);

    &.val-divider--has-label {
      border-top: none;
      display: flex;
      align-items: center;
      gap: 1rem;
      white-space: nowrap;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 0;
        border-top: 1px var(--val-divider-style, solid) var(--val-border-color, #e2e8f0);
      }

      &.val-divider--label-start::before {
        display: none;
      }

      &.val-divider--label-end::after {
        display: none;
      }

      .val-divider__label {
        color: var(--val-text-secondary, #64748b);
        font-size: 0.8125rem;
        font-weight: 500;
        padding: 0 0.25rem;
      }
    }
  }

  // Vertical
  &--vertical {
    display: inline-block;
    height: auto;
    min-height: 1.25rem;
    margin: 0 1rem;
    border-left: 1px var(--val-divider-style, solid) var(--val-border-color, #e2e8f0);
    align-self: stretch;

    &.val-divider--has-label {
      border-left: none;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      &::before,
      &::after {
        content: '';
        width: 0;
        flex: 1;
        border-left: 1px var(--val-divider-style, solid) var(--val-border-color, #e2e8f0);
      }

      &.val-divider--label-start::before {
        display: none;
      }

      &.val-divider--label-end::after {
        display: none;
      }

      .val-divider__label {
        color: var(--val-text-secondary, #64748b);
        font-size: 0.8125rem;
        font-weight: 500;
        writing-mode: vertical-lr;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
