<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

export interface PopoverProps {
  modelValue?: boolean;
  offsetY?: number;
  offsetX?: number;
  width?: string;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<PopoverProps>(), {
  modelValue: false,
  offsetY: 8,
  offsetX: 0,
  width: 'auto',
  closeOnEscape: true,
  closeOnClickOutside: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'show'): void;
  (e: 'hide'): void;
}>();

const isOpen = ref(props.modelValue);
const targetRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const coords = ref({ top: 0, left: 0 });

watch(() => props.modelValue, (newVal) => {
  if (newVal !== isOpen.value) {
    if (newVal) open();
    else close();
  }
});

function updatePosition() {
  if (!targetRef.value || !panelRef.value) return;

  const rect = targetRef.value.getBoundingClientRect();
  const panel = panelRef.value;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let top = rect.bottom + scrollY + props.offsetY;
  let left = rect.left + scrollX + props.offsetX;

  // Prevent overflowing right viewport boundary
  const viewportWidth = window.innerWidth;
  if (left + panel.offsetWidth > viewportWidth - 16) {
    left = Math.max(16, viewportWidth - panel.offsetWidth - 16);
  }

  coords.value = { top, left };
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

function open() {
  isOpen.value = true;
  emit('update:modelValue', true);
  emit('show');
  nextTick(() => {
    updatePosition();
  });
}

function close() {
  isOpen.value = false;
  emit('update:modelValue', false);
  emit('hide');
}

function handleDocumentClick(event: MouseEvent) {
  if (!isOpen.value || !props.closeOnClickOutside) return;

  const target = event.target as Node;
  if (
    targetRef.value?.contains(target) ||
    panelRef.value?.contains(target)
  ) {
    return;
  }

  close();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value && props.closeOnEscape) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick, true);
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick, true);
  document.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
});

defineExpose({
  open,
  close,
  toggle,
  isOpen
});
</script>

<template>
  <div class="val-popover-wrapper">
    <div
      ref="targetRef"
      class="val-popover-target"
      @click.stop="toggle"
    >
      <slot name="target" />
    </div>

    <Teleport to="body">
      <transition name="val-popover-fade">
        <div
          v-if="isOpen"
          ref="panelRef"
          class="val-popover-panel val-elevation-3"
          :style="{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: width !== 'auto' ? width : undefined
          }"
          role="dialog"
          aria-modal="false"
        >
          <slot :close="close" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.val-popover-wrapper {
  display: inline-block;
  position: relative;
}

.val-popover-target {
  display: inline-block;
  cursor: pointer;
}

.val-popover-panel {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 220px;
  max-width: 380px;
  z-index: 1050;
  transform-origin: top left;
}

.val-popover-fade-enter-active,
.val-popover-fade-leave-active {
  transition: opacity 0.15s cubic-bezier(0, 0, 0.2, 1), transform 0.15s cubic-bezier(0, 0, 0.2, 1);
}

.val-popover-fade-enter-from,
.val-popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
