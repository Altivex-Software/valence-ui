<script setup lang="ts">
import { ref } from 'vue';

export type SplitterLayout = 'horizontal' | 'vertical';

export interface SplitterProps {
  layout?: SplitterLayout;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
}

const props = withDefaults(defineProps<SplitterProps>(), {
  layout: 'horizontal',
  initialSize: 50,
  minSize: 10,
  maxSize: 90
});

const emit = defineEmits<{
  (e: 'resize', size: number): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const panel1Size = ref(props.initialSize);
const isDragging = ref(false);

function startDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault();
  isDragging.value = true;

  const onMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    let percentage = 50;

    if (props.layout === 'horizontal') {
      const offset = clientX - rect.left;
      percentage = (offset / rect.width) * 100;
    } else {
      const offset = clientY - rect.top;
      percentage = (offset / rect.height) * 100;
    }

    percentage = Math.max(props.minSize, Math.min(props.maxSize, percentage));
    panel1Size.value = percentage;
    emit('resize', percentage);
  };

  const onEnd = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onEnd);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onEnd);
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchmove', onMove);
  window.addEventListener('touchend', onEnd);
}
</script>

<template>
  <div
    ref="containerRef"
    class="val-splitter"
    :class="`val-splitter--${layout}`"
  >
    <!-- Panel 1 -->
    <div
      class="val-splitter-panel"
      :style="{ flexBasis: `${panel1Size}%` }"
    >
      <slot name="panel1" />
    </div>

    <!-- Gutter Handle -->
    <div
      class="val-splitter-gutter"
      :class="{ 'val-splitter-gutter--active': isDragging }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <div class="val-splitter-gutter-handle" />
    </div>

    <!-- Panel 2 -->
    <div
      class="val-splitter-panel"
      :style="{ flexBasis: `${100 - panel1Size}%` }"
    >
      <slot name="panel2" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.val-splitter {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;

  &--horizontal {
    flex-direction: row;

    .val-splitter-gutter {
      width: 8px;
      cursor: col-resize;

      .val-splitter-gutter-handle {
        width: 2px;
        height: 24px;
      }
    }
  }

  &--vertical {
    flex-direction: column;

    .val-splitter-gutter {
      height: 8px;
      cursor: row-resize;

      .val-splitter-gutter-handle {
        width: 24px;
        height: 2px;
      }
    }
  }
}

.val-splitter-panel {
  flex-grow: 0;
  flex-shrink: 0;
  overflow: auto;
  box-sizing: border-box;
}

.val-splitter-gutter {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  user-select: none;
  transition: background-color 0.15s ease;
  flex-shrink: 0;

  &:hover, &--active {
    background-color: #e2e8f0;

    .val-splitter-gutter-handle {
      background-color: var(--val-primary, #3b82f6);
    }
  }

  .val-splitter-gutter-handle {
    background-color: #94a3b8;
    border-radius: 2px;
    transition: background-color 0.15s ease;
  }
}
</style>
