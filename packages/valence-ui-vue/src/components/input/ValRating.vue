<script setup lang="ts">
import { ref } from 'vue';

export interface RatingProps {
  modelValue?: number;
  max?: number;
  disabled?: boolean;
  readonly?: boolean;
  color?: string;
}

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  max: 5,
  disabled: false,
  readonly: false,
  color: '#f59e0b'
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'change', val: number): void;
}>();

const hoverValue = ref(0);

function onSelect(star: number) {
  if (props.disabled || props.readonly) return;
  const newVal = props.modelValue === star ? 0 : star;
  emit('update:modelValue', newVal);
  emit('change', newVal);
}

function onMouseEnter(star: number) {
  if (props.disabled || props.readonly) return;
  hoverValue.value = star;
}

function onMouseLeave() {
  hoverValue.value = 0;
}
</script>

<template>
  <div
    class="val-rating"
    :class="{
      'val-rating--disabled': disabled,
      'val-rating--readonly': readonly
    }"
    role="radiogroup"
    aria-label="Calificación"
  >
    <button
      v-for="star in max"
      :key="star"
      type="button"
      class="val-star"
      :class="{
        'val-star--active': star <= (hoverValue || modelValue)
      }"
      :disabled="disabled || readonly"
      :aria-label="`${star} estrellas`"
      @mouseenter="onMouseEnter(star)"
      @mouseleave="onMouseLeave"
      @click="onSelect(star)"
    >
      <svg
        viewBox="0 0 24 24"
        class="val-star-svg"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </button>
  </div>
</template>

<style lang="scss">
.val-rating {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &--readonly {
    pointer-events: none;
  }
}

.val-star {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #cbd5e1;
  transition: transform 0.15s ease, color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  &:hover {
    transform: scale(1.15);
  }

  &--active {
    color: #f59e0b;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
