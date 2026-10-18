<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { TreeNode, TreeSelectionMode } from './tree.types';
import ValTree from './ValTree.vue';

export interface TreeSelectProps {
  options?: TreeNode[];
  modelValue?: string | string[];
  placeholder?: string;
  selectionMode?: TreeSelectionMode;
  filter?: boolean;
  filterPlaceholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<TreeSelectProps>(), {
  options: () => [],
  modelValue: () => [],
  placeholder: 'Seleccionar...',
  selectionMode: 'single',
  filter: true,
  filterPlaceholder: 'Filtrar nodos...',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
  (e: 'change', value: string | string[]): void;
}>();

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

function findNodeLabel(nodes: TreeNode[], key: string): string | null {
  for (const n of nodes) {
    if (n.key === key) return n.label;
    if (n.children) {
      const found = findNodeLabel(n.children, key);
      if (found) return found;
    }
  }
  return null;
}

const displayValue = computed(() => {
  if (!props.modelValue || (Array.isArray(props.modelValue) && props.modelValue.length === 0)) {
    return '';
  }
  if (Array.isArray(props.modelValue)) {
    const labels = props.modelValue
      .map(k => findNodeLabel(props.options, k))
      .filter(Boolean);
    return labels.join(', ');
  }
  return findNodeLabel(props.options, props.modelValue) || '';
});

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function handleSelectedKeysUpdate(keys: string | string[]) {
  emit('update:modelValue', keys);
  emit('change', keys);
  if (props.selectionMode === 'single') {
    isOpen.value = false;
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value) return;
  const target = event.target as Node;
  if (
    triggerRef.value?.contains(target) ||
    panelRef.value?.contains(target)
  ) {
    return;
  }
  isOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
</script>

<template>
  <div class="val-treeselect-wrapper" :class="{ 'val-treeselect--disabled': disabled }">
    <div
      ref="triggerRef"
      class="val-treeselect-trigger"
      :class="{ 'val-treeselect-trigger--focus': isOpen }"
      tabindex="0"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
    >
      <span v-if="displayValue" class="val-treeselect-label">{{ displayValue }}</span>
      <span v-else class="val-treeselect-placeholder">{{ placeholder }}</span>

      <span class="val-treeselect-arrow" :class="{ 'val-treeselect-arrow--open': isOpen }">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>

    <!-- Dropdown Tree Panel -->
    <transition name="val-treeselect-fade">
      <div v-if="isOpen" ref="panelRef" class="val-treeselect-panel val-elevation-3">
        <ValTree
          :value="options"
          :selected-keys="modelValue"
          :selection-mode="selectionMode"
          :filter="filter"
          :bordered="false"
          :lines="true"
          @update:selected-keys="handleSelectedKeysUpdate"
        />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.val-treeselect-wrapper {
  position: relative;
  width: 100%;
}

.val-treeselect-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.375rem 0.75rem;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #94a3b8;
  }

  &--focus {
    border-color: var(--val-primary, #3b82f6);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
}

.val-treeselect-label {
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.val-treeselect-placeholder {
  color: #94a3b8;
}

.val-treeselect-arrow {
  display: inline-flex;
  align-items: center;
  color: #64748b;
  margin-left: 0.5rem;
  transition: transform 0.2s ease;

  &--open {
    transform: rotate(180deg);
  }
}

.val-treeselect-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  z-index: 1050;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 320px;
  overflow-y: auto;
}

.val-treeselect-fade-enter-active,
.val-treeselect-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.val-treeselect-fade-enter-from,
.val-treeselect-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
