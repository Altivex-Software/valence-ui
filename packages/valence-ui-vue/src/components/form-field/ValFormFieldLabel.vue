<script setup lang="ts">
export interface FormFieldLabelProps {
  required?: boolean;
}

withDefaults(defineProps<FormFieldLabelProps>(), {
  required: false
});
</script>

<template>
  <span class="val-form-field-label-text">
    <slot />
    <span v-if="required" class="val-form-field-required-marker" aria-hidden="true">*</span>
  </span>
</template>
