<script setup lang="ts">
import ValIcon from '../icon/ValIcon.vue';

export interface FormFieldErrorProps {
  icon?: string;
  errorName?: string;
}

withDefaults(defineProps<FormFieldErrorProps>(), {
  icon: 'alert-circle'
});
</script>

<template>
  <div class="val-form-field-error" role="alert" aria-live="polite">
    <span class="val-form-field-error-icon-wrapper" aria-hidden="true">
      <ValIcon :name="icon" size="0.875rem" />
    </span>
    <span class="val-form-field-error-message">
      <slot />
    </span>
  </div>
</template>
