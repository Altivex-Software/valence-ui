<script setup lang="ts">
export type TagSeverity = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface TagProps {
  value?: string;
  severity?: TagSeverity;
  icon?: string;
  rounded?: boolean;
  removable?: boolean;
}

withDefaults(defineProps<TagProps>(), {
  value: '',
  severity: 'primary',
  icon: undefined,
  rounded: false,
  removable: false
});

const emit = defineEmits<{
  (e: 'remove', event: MouseEvent): void;
}>();

function onRemoveClick(event: MouseEvent) {
  event.stopPropagation();
  emit('remove', event);
}
</script>

<template>
  <span
    class="val-tag"
    :class="[
      `val-tag-${severity}`,
      {
        'val-tag-rounded': rounded
      }
    ]"
  >
    <span v-if="icon" class="val-tag-icon">
      <i :class="icon"></i>
    </span>

    <span class="val-tag-value">
      <slot>{{ value }}</slot>
    </span>

    <button
      v-if="removable"
      type="button"
      class="val-tag-remove"
      aria-label="Eliminar tag"
      @click="onRemoveClick"
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </span>
</template>

<style lang="scss">
.val-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm, 6px);
  line-height: 1;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  vertical-align: middle;
  box-sizing: border-box;

  &-rounded {
    border-radius: 9999px;
  }

  &-icon {
    font-size: 0.8125rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
  }

  &-value {
    display: inline-block;
  }

  &-remove {
    background: transparent;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    padding: 1px;
    color: inherit;
    transition: background-color 0.15s;

    &:hover {
      background: rgba(0, 0, 0, 0.12);
    }
  }

  // Severities
  &-primary { background: #eff6ff; color: #1d4ed8; }
  &-secondary { background: #f1f5f9; color: #475569; }
  &-success { background: #f0fdf4; color: #15803d; }
  &-danger { background: #fef2f2; color: #b91c1c; }
  &-warning { background: #fffbeb; color: #b45309; }
  &-info { background: #ecfeff; color: #0e7490; }
}
</style>
