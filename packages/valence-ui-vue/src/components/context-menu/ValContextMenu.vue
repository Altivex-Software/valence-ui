<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

export interface ContextMenuItem {
  label?: string;
  icon?: string;
  command?: (event: { originalEvent: MouseEvent; item: ContextMenuItem; data?: any }) => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface ContextMenuProps {
  model?: ContextMenuItem[];
}

withDefaults(defineProps<ContextMenuProps>(), {
  model: () => []
});

const emit = defineEmits<{
  (e: 'itemSelect', item: ContextMenuItem): void;
  (e: 'show'): void;
  (e: 'hide'): void;
}>();

const isOpen = ref(false);
const clickX = ref(0);
const clickY = ref(0);
const targetData = ref<any>(null);
const panelRef = ref<HTMLElement | null>(null);

function show(event: MouseEvent, data?: any) {
  event.preventDefault();
  event.stopPropagation();

  clickX.value = event.clientX;
  clickY.value = event.clientY;
  targetData.value = data;
  isOpen.value = true;
  emit('show');

  nextTick(() => {
    adjustPosition();
  });
}

function adjustPosition() {
  if (!panelRef.value) return;
  const panel = panelRef.value;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (clickX.value + panel.offsetWidth > viewportWidth - 8) {
    clickX.value = Math.max(8, viewportWidth - panel.offsetWidth - 8);
  }
  if (clickY.value + panel.offsetHeight > viewportHeight - 8) {
    clickY.value = Math.max(8, viewportHeight - panel.offsetHeight - 8);
  }
}

function close() {
  if (isOpen.value) {
    isOpen.value = false;
    targetData.value = null;
    emit('hide');
  }
}

function onItemClick(item: ContextMenuItem, event: MouseEvent) {
  if (item.disabled) return;

  if (item.command) {
    item.command({ originalEvent: event, item, data: targetData.value });
  }

  emit('itemSelect', item);
  close();
}

function onWindowScroll() {
  if (isOpen.value) close();
}

onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, true);
  window.addEventListener('resize', onWindowScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll, true);
  window.removeEventListener('resize', onWindowScroll);
});

defineExpose({
  show,
  close,
  isOpen
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="val-context-menu-wrapper"
      @click="close"
      @contextmenu.prevent="close"
    >
      <div
        ref="panelRef"
        class="val-context-menu-panel val-elevation-3"
        :style="{ left: `${clickX}px`, top: `${clickY}px` }"
        @click.stop
      >
        <ul class="val-context-menu-items">
          <template v-for="(item, index) in model" :key="item.label || index">
            <li v-if="item.separator" class="val-context-menu-separator" />
            <li
              v-else
              class="val-context-menu-item"
              :class="{
                'val-context-menu-item--disabled': item.disabled,
                'val-context-menu-item--danger': item.danger
              }"
              @click="onItemClick(item, $event)"
            >
              <span v-if="item.icon" class="val-context-menu-icon">{{ item.icon }}</span>
              <span class="val-context-menu-label">{{ item.label }}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.val-context-menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1200;
  background: transparent;
}

.val-context-menu-panel {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.375rem 0;
  min-width: 180px;
  max-width: 280px;
  animation: val-ctx-in 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.val-context-menu-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.val-context-menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.875rem;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  &--danger {
    color: #ef4444;

    &:hover {
      background-color: rgba(239, 68, 68, 0.08);
      color: #dc2626;
    }
  }

  &--disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}

.val-context-menu-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
}

.val-context-menu-label {
  flex: 1;
}

.val-context-menu-separator {
  height: 1px;
  background-color: #f1f5f9;
  margin: 0.25rem 0;
}

@keyframes val-ctx-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
