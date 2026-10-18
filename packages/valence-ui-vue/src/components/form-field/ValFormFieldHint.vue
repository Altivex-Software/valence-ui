<script setup lang="ts">
export interface FormFieldHintProps {
  align?: 'left' | 'right';
}

withDefaults(defineProps<FormFieldHintProps>(), {
  align: 'left'
});
</script>

<template>
  <span class="val-form-field-hint-text" :class="`val-form-field-hint--${align}`">
    <slot />
  </span>
</template>
