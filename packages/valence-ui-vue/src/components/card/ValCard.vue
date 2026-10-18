<script setup lang="ts">
import { computed } from 'vue';
import type { ValenceSize } from '../../types';

export interface CardProps {
  bordered?: boolean;
  hoverable?: boolean;
  liftOnHover?: boolean;
  boxShadow?: ValenceSize | 'none';
}

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  hoverable: false,
  liftOnHover: false,
  boxShadow: 'sm'
});

const cardClasses = computed(() => [
  'val-card',
  props.bordered ? 'val-card--bordered' : '',
  props.hoverable ? 'val-card--hoverable' : '',
  props.liftOnHover ? 'val-card--lift' : ''
].filter(Boolean));

const cardStyles = computed(() => {
  if (props.boxShadow === 'none') return {};
  return {
    '--val-card-shadow': `var(--shadow-${props.boxShadow}, 0 2px 4px rgba(0, 0, 0, 0.08))`
  };
});
</script>

<template>
  <div :class="cardClasses" :style="cardStyles" role="article">
    <!-- Header slot -->
    <div v-if="$slots.header" class="val-card__header">
      <slot name="header" />
    </div>

    <!-- Body slot -->
    <div class="val-card__body">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="val-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss">
.val-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--val-bg-color, #ffffff);
  border-radius: var(--radius-md, 8px);
  box-shadow: var(--val-card-shadow, var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08)));
  transition: all var(--transition, 150ms ease-in-out);
  overflow: hidden;
  box-sizing: border-box;

  &--bordered {
    border: 1px solid var(--val-border-color, #e2e8f0);
  }

  &--lift {
    &:hover {
      transform: translateY(-4px);
    }
  }

  &--hoverable {
    &:hover {
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.12)) !important;
    }
  }

  &__header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--val-border-color, #e2e8f0);
    font-weight: 600;
    color: var(--val-text-color, #1e293b);
  }

  &__body {
    padding: 1.25rem;
    color: var(--val-text-color, #374151);
    line-height: 1.5;
    flex: 1 1 auto;
  }

  &__footer {
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--val-border-color, #e2e8f0);
    background-color: var(--val-readonly-bg, #f8fafc);
  }
}
</style>
