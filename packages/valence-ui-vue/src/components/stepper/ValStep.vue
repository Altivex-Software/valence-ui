<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, computed, watch, type Ref, type ComputedRef, type DeepReadonly } from 'vue';
import type { StepData } from './ValStepper.vue';

export interface StepProps {
  id?: string;
  label: string;
  optional?: boolean;
  editable?: boolean;
  completed?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<StepProps>(), {
  id: () => `val-step-${Math.random().toString(36).substring(2, 9)}`,
  optional: false,
  editable: true,
  completed: false,
  disabled: false
});

const context = inject<{
  selectedIndex: Ref<number>;
  steps: DeepReadonly<Ref<StepData[]>>;
  orientation: ComputedRef<'horizontal' | 'vertical'>;
  registerStep: (step: StepData) => void;
  unregisterStep: (id: string) => void;
} | null>('valStepperContext', null);

const isCurrentStep = computed(() => {
  if (!context) return true;
  const list = context.steps.value;
  const idx = list.findIndex((s) => s.id === props.id);
  return idx === context.selectedIndex.value;
});

onMounted(() => {
  if (context) {
    context.registerStep({
      id: props.id,
      label: props.label,
      optional: props.optional,
      completed: props.completed,
      disabled: props.disabled
    });
  }
});

watch(
  () => [props.label, props.optional, props.completed, props.disabled],
  () => {
    if (context) {
      context.registerStep({
        id: props.id,
        label: props.label,
        optional: props.optional,
        completed: props.completed,
        disabled: props.disabled
      });
    }
  }
);

onBeforeUnmount(() => {
  if (context) {
    context.unregisterStep(props.id);
  }
});
</script>

<template>
  <div
    v-show="isCurrentStep"
    :id="`${id}-panel`"
    class="val-step-panel"
    role="tabpanel"
  >
    <slot></slot>
  </div>
</template>

<style>
.val-step-panel {
  width: 100%;
}
</style>
