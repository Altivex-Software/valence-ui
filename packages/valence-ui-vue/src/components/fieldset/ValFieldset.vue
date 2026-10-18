<script setup lang="ts">
import { ref } from 'vue';

export type FieldsetVariant = 'outlined' | 'flat' | 'seamless';

export interface FieldsetProps {
  legend?: string;
  variant?: FieldsetVariant;
  toggleable?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
  legendPosition?: 'start' | 'center' | 'end';
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
}

const props = withDefaults(defineProps<FieldsetProps>(), {
  legend: '',
  variant: 'outlined',
  toggleable: false,
  collapsed: false,
  disabled: false,
  legendPosition: 'start',
  borderStyle: 'solid'
});

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void;
  (e: 'toggle', value: boolean): void;
}>();

const isCollapsed = ref(props.collapsed);

function toggle() {
  if (props.disabled || !props.toggleable) return;
  isCollapsed.value = !isCollapsed.value;
  emit('update:collapsed', isCollapsed.value);
  emit('toggle', isCollapsed.value);
}
</script>

<template>
  <fieldset
    class="val-fieldset"
    :class="[
      `val-fieldset--${variant}`,
      `val-fieldset--legend-${legendPosition}`,
      {
        'val-fieldset--collapsed': isCollapsed,
        'val-fieldset--disabled': disabled
      }
    ]"
    :style="{ '--val-fieldset-border-style': borderStyle }"
  >
    <legend
      v-if="legend || $slots.legend"
      class="val-fieldset__legend"
      :class="{ 'val-fieldset__legend--clickable': toggleable && !disabled }"
      @click="toggle"
    >
      <div class="val-fieldset__legend-content">
        <slot name="legend">{{ legend }}</slot>

        <button
          v-if="toggleable"
          type="button"
          class="val-fieldset__toggler"
          @click.stop="toggle"
        >
          <svg
            class="val-fieldset__caret"
            :class="{ 'val-fieldset__caret--collapsed': isCollapsed }"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </legend>

    <div v-show="!isCollapsed" class="val-fieldset__content">
      <slot />
    </div>
  </fieldset>
</template>

<style lang="scss" scoped>
.val-fieldset {
  margin: 0;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md, 8px);
  background: #ffffff;
  transition: all 0.2s ease;

  &--outlined {
    border: 1px solid #e2e8f0;
  }

  &--flat {
    background: #f8fafc;
    border: 1px solid transparent;
  }

  &--seamless {
    border: none;
    padding: 0.5rem 0;
    background: transparent;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__legend {
    padding: 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    border: none;

    &--clickable {
      cursor: pointer;
    }
  }

  &__legend-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #64748b;
    cursor: pointer;

    &:hover {
      color: #0f172a;
    }
  }

  &__caret {
    transition: transform 0.2s ease;

    &--collapsed {
      transform: rotate(-90deg);
    }
  }

  &__content {
    font-size: 0.875rem;
    color: #334155;
    line-height: 1.5;
  }
}
</style>
