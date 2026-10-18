<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue';

export interface AccordionProps {
  modelValue?: string | string[] | null;
  activeId?: string | string[] | null;
  multi?: boolean;
  bordered?: boolean;
  borderRadius?: string;
}

const props = withDefaults(defineProps<AccordionProps>(), {
  modelValue: null,
  activeId: undefined,
  multi: false,
  bordered: true,
  borderRadius: '8px'
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | string[] | null): void;
  (e: 'update:activeId', val: string | string[] | null): void;
  (e: 'change', val: string | string[] | null): void;
}>();

const currentActive = ref<string | string[] | null>(
  props.activeId !== undefined ? props.activeId : props.modelValue
);

watch(
  () => props.activeId !== undefined ? props.activeId : props.modelValue,
  (val) => {
    currentActive.value = val;
  }
);

function isExpanded(id: string): boolean {
  const val = currentActive.value;
  if (!val) return false;
  if (Array.isArray(val)) {
    return val.includes(id);
  }
  return val === id;
}

function toggle(id: string) {
  let next: string | string[] | null;

  if (props.multi) {
    const list = Array.isArray(currentActive.value)
      ? [...currentActive.value]
      : currentActive.value
      ? [currentActive.value]
      : [];
    const index = list.indexOf(id);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    next = list;
  } else {
    next = currentActive.value === id ? null : id;
  }

  currentActive.value = next;
  emit('update:modelValue', next);
  emit('update:activeId', next);
  emit('change', next);
}

provide('valAccordionContext', {
  isExpanded,
  toggle,
  bordered: computed(() => props.bordered)
});
</script>

<template>
  <div
    class="val-accordion"
    :class="{
      'val-accordion--bordered': bordered,
      'val-accordion--no-border': !bordered
    }"
    :style="{
      '--val-accordion-border-radius': borderRadius
    }"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.val-accordion {
  width: 100%;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  &--bordered {
    border: 1px solid var(--val-border-color, #e2e8f0);
    border-radius: var(--val-accordion-border-radius, 8px);
    overflow: hidden;

    .val-accordion-item:last-child {
      border-bottom: none;
    }
  }

  &--no-border {
    .val-accordion-item {
      border: 1px solid var(--val-border-color, #e2e8f0);
      border-radius: var(--val-accordion-border-radius, 8px);
      margin-bottom: 0.75rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
