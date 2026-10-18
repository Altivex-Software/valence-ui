<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TreeNode, TreeSelectionMode, TreeNodeSelectEvent } from './tree.types';
import ValTreeNode from './ValTreeNode.vue';

export interface TreeProps {
  value?: TreeNode[];
  selectionMode?: TreeSelectionMode;
  selectedKeys?: string | string[];
  filter?: boolean;
  filterBy?: string;
  filterMode?: 'lenient' | 'strict';
  filterPlaceholder?: string;
  lines?: boolean;
  showLines?: boolean;
  bordered?: boolean;
  scrollable?: boolean;
  scrollHeight?: string;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<TreeProps>(), {
  value: () => [],
  selectionMode: 'single',
  selectedKeys: () => [],
  filter: false,
  filterBy: 'label',
  filterMode: 'lenient',
  filterPlaceholder: 'Filtrar nodos...',
  lines: true,
  showLines: true,
  bordered: true,
  scrollable: false,
  scrollHeight: '400px',
  emptyMessage: 'No results found'
});

const emit = defineEmits<{
  (e: 'update:selectedKeys', keys: string | string[]): void;
  (e: 'nodeSelect', event: TreeNodeSelectEvent): void;
  (e: 'nodeUnselect', event: TreeNodeSelectEvent): void;
  (e: 'nodeExpand', event: { node: TreeNode }): void;
  (e: 'nodeCollapse', event: { node: TreeNode }): void;
}>();

const filterText = ref('');

const normalizedSelectedKeys = computed<string[]>(() => {
  if (Array.isArray(props.selectedKeys)) return props.selectedKeys;
  if (typeof props.selectedKeys === 'string' && props.selectedKeys) return [props.selectedKeys];
  return [];
});

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query) return nodes;
  const q = query.toLowerCase();

  return nodes.reduce<TreeNode[]>((acc, node) => {
    const matchesLabel = node.label.toLowerCase().includes(q);
    const filteredChildren = node.children ? filterTree(node.children, query) : [];

    if (matchesLabel || filteredChildren.length > 0) {
      acc.push({
        ...node,
        expanded: query.length > 0 ? true : node.expanded,
        children: filteredChildren
      });
    }
    return acc;
  }, []);
}

const filteredNodes = computed(() => {
  return filterTree(props.value, filterText.value);
});

function handleNodeClick({ node, originalEvent }: { node: TreeNode; originalEvent: MouseEvent }) {
  if (!node.key) return;

  if (props.selectionMode === 'single') {
    const isCurrent = normalizedSelectedKeys.value.includes(node.key);
    const newKeys = isCurrent ? [] : [node.key];
    emit('update:selectedKeys', newKeys);
    if (!isCurrent) {
      emit('nodeSelect', { originalEvent, node });
    } else {
      emit('nodeUnselect', { originalEvent, node });
    }
  } else if (props.selectionMode === 'multiple' || props.selectionMode === 'checkbox') {
    toggleKey(node.key, node, originalEvent);
  }
}

function handleNodeCheckbox({ node, originalEvent }: { node: TreeNode; originalEvent: MouseEvent }) {
  if (!node.key) return;
  toggleKey(node.key, node, originalEvent);
}

function toggleKey(key: string, node: TreeNode, originalEvent: MouseEvent) {
  const current = [...normalizedSelectedKeys.value];
  const idx = current.indexOf(key);
  if (idx >= 0) {
    current.splice(idx, 1);
    emit('update:selectedKeys', current);
    emit('nodeUnselect', { originalEvent, node });
  } else {
    current.push(key);
    emit('update:selectedKeys', current);
    emit('nodeSelect', { originalEvent, node });
  }
}

function handleNodeToggle({ node }: { node: TreeNode }) {
  if (node.expanded) {
    emit('nodeExpand', { node });
  } else {
    emit('nodeCollapse', { node });
  }
}

function expandAllNodes(nodes: TreeNode[], expanded: boolean) {
  for (const n of nodes) {
    n.expanded = expanded;
    if (n.children) expandAllNodes(n.children, expanded);
  }
}

function expandAll() {
  expandAllNodes(props.value, true);
}

function collapseAll() {
  expandAllNodes(props.value, false);
}
</script>

<template>
  <div
    class="val-tree"
    :class="{
      'val-tree-bordered': bordered,
      'val-tree-scrollable': scrollable
    }"
    :style="{ maxHeight: scrollable ? scrollHeight : undefined }"
  >
    <!-- Header with Filter & Expand/Collapse All -->
    <div v-if="filter" class="val-tree-header">
      <div class="val-tree-filter-wrapper">
        <svg
          class="val-tree-filter-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          v-model="filterText"
          type="text"
          class="val-tree-filter-input"
          :placeholder="filterPlaceholder"
        />

        <button
          v-if="filterText"
          type="button"
          class="val-tree-filter-clear"
          @click="filterText = ''"
        >
          ✕
        </button>
      </div>

      <div class="val-tree-actions">
        <button
          type="button"
          class="val-tree-action-btn"
          title="Expandir todo"
          @click="expandAll"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </button>
        <button
          type="button"
          class="val-tree-action-btn"
          title="Colapsar todo"
          @click="collapseAll"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 11 12 6 7 11" />
            <polyline points="17 18 12 13 7 18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tree Node List -->
    <ul class="val-tree-container">
      <ValTreeNode
        v-for="node in filteredNodes"
        :key="node.key || node.label"
        :node="node"
        :selection-mode="selectionMode"
        :selected-keys="normalizedSelectedKeys"
        :lines="lines"
        @node-click="handleNodeClick"
        @node-toggle="handleNodeToggle"
        @node-checkbox="handleNodeCheckbox"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.val-tree {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md, 8px);
  color: #0f172a;
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &.val-tree-bordered {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  &.val-tree-scrollable {
    overflow-y: auto;
  }
}

.val-tree-header {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.val-tree-filter-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;

  .val-tree-filter-icon {
    position: absolute;
    left: 0.625rem;
    color: #64748b;
    pointer-events: none;
  }

  .val-tree-filter-input {
    width: 100%;
    padding: 0.375rem 1.75rem 0.375rem 2rem;
    font-size: 0.8125rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #ffffff;
    color: #0f172a;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: var(--val-primary, #3b82f6);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  }

  .val-tree-filter-clear {
    position: absolute;
    right: 0.375rem;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;

    &:hover {
      color: #0f172a;
    }
  }
}

.val-tree-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.val-tree-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffffff;
    color: var(--val-primary, #3b82f6);
    border-color: #cbd5e1;
  }
}

.val-tree-container {
  padding: 0.5rem;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
</style>
