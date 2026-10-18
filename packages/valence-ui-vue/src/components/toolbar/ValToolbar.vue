<script setup lang="ts">
export type ToolbarColor = 'surface' | 'primary' | 'secondary' | 'transparent';

export interface ToolbarProps {
  color?: ToolbarColor;
  sticky?: boolean;
  shadow?: boolean;
}

withDefaults(defineProps<ToolbarProps>(), {
  color: 'surface',
  sticky: false,
  shadow: true
});
</script>

<template>
  <div
    class="val-toolbar"
    :class="[
      `val-toolbar--${color}`,
      {
        'val-toolbar--sticky': sticky,
        'val-toolbar--shadow': shadow
      }
    ]"
    role="toolbar"
  >
    <div class="val-toolbar__container">
      <div v-if="$slots.left" class="val-toolbar__left">
        <slot name="left"></slot>
      </div>

      <div class="val-toolbar__center">
        <slot></slot>
      </div>

      <div v-if="$slots.right" class="val-toolbar__right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.val-toolbar {
  display: block;
  width: 100%;
  min-height: 58px;
  z-index: 1000;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  &--sticky {
    position: sticky;
    top: 0;
  }

  &--shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  }

  // Color Variants
  &--surface {
    background-color: #ffffff;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-md, 8px);
  }

  &--primary {
    background-color: var(--val-primary, #0066ff);
    color: #ffffff;
    border-radius: var(--radius-md, 8px);
  }

  &--secondary {
    background-color: var(--val-secondary, #64748b);
    color: #ffffff;
    border-radius: var(--radius-md, 8px);
  }

  &--transparent {
    background-color: transparent;
    color: inherit;
    box-shadow: none !important;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    min-height: inherit;
    padding: 0.625rem 1.25rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__left,
  &__right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  &__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
