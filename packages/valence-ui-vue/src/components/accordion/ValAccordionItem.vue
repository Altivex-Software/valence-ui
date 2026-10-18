<script setup lang="ts">
import { ref, computed, inject } from 'vue';

export type AccordionColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type AccordionVariantPrefix = 'outline' | 'ghost';
export type AccordionVariant = AccordionColor | `${AccordionVariantPrefix}-${AccordionColor}`;

export interface AccordionItemProps {
  id?: string;
  itemId?: string;
  title?: string;
  color?: AccordionVariant;
  headingLevel?: number;
  boxShadow?: 'sm' | 'md' | 'none';
  disabled?: boolean;
}

const props = withDefaults(defineProps<AccordionItemProps>(), {
  id: '',
  itemId: '',
  title: '',
  headingLevel: 3,
  boxShadow: 'none',
  disabled: false
});

const resolvedId = computed(() => {
  return props.itemId || props.id || `val-acc-${Math.random().toString(36).substring(2, 9)}`;
});

const context = inject<{
  isExpanded: (id: string) => boolean;
  toggle: (id: string) => void;
  bordered: { value: boolean };
} | null>('valAccordionContext', null);

const localExpanded = ref(false);

const isItemExpanded = computed(() => {
  if (context) {
    return context.isExpanded(resolvedId.value);
  }
  return localExpanded.value;
});

function handleToggle() {
  if (props.disabled) return;
  if (context) {
    context.toggle(resolvedId.value);
  } else {
    localExpanded.value = !localExpanded.value;
  }
}
</script>

<template>
  <div
    class="val-accordion-item"
    :class="{ 'val-accordion-item--expanded': isItemExpanded }"
    :style="{
      '--val-accordion-item-shadow': boxShadow !== 'none' ? `var(--shadow-${boxShadow})` : 'none'
    }"
  >
    <div role="heading" :aria-level="headingLevel" class="val-accordion-item__header-wrapper">
      <button
        :id="`${resolvedId}-header`"
        type="button"
        class="val-accordion-item__header"
        :class="[
          color ? `val-accordion-item__header--${color}` : '',
          { 'val-accordion-item__header--disabled': disabled }
        ]"
        :aria-expanded="isItemExpanded"
        :aria-controls="`${resolvedId}-panel`"
        :disabled="disabled"
        @click="handleToggle"
      >
        <span class="val-accordion-item__title">
          <slot name="header">{{ title }}</slot>
        </span>
        <span
          class="val-accordion-item__icon"
          :class="{ 'val-accordion-item__icon--rotated': isItemExpanded }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
    </div>

    <div
      :id="`${resolvedId}-panel`"
      class="val-accordion-item__content"
      role="region"
      :aria-labelledby="`${resolvedId}-header`"
      :style="{ maxHeight: isItemExpanded ? '1000px' : '0' }"
    >
      <div class="val-accordion-item__content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.val-accordion-item {
  background-color: var(--val-bg-secondary, #ffffff);
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--val-border-color, #e2e8f0);
  overflow: hidden;

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 0.9375rem;
    font-weight: 500;
    font-family: inherit;
    color: var(--val-text-color, #1e293b);
    transition: background-color 0.2s ease;

    &:hover:not(&--disabled) {
      background-color: rgba(0, 102, 255, 0.03);
    }

    &:focus-visible {
      outline: 2px solid var(--val-primary, #0066ff);
      outline-offset: -2px;
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  &__title {
    flex: 1;
    font-weight: 600;
  }

  &__icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #64748b;

    &--rotated {
      transform: rotate(180deg);
      color: var(--val-primary, #0066ff);
    }
  }

  &__content {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__content-inner {
    padding: 0.75rem 1.25rem 1.25rem;
    color: var(--val-text-secondary, #475569);
    font-size: 0.875rem;
    line-height: 1.6;
    border-top: 1px solid #f1f5f9;
  }
}
</style>
