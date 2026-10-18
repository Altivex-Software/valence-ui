<script setup lang="ts">
import type { TreeNode, TreeSelectionMode } from './tree.types';

export interface TreeNodeProps {
  node: TreeNode;
  tree?: any;
  parent?: TreeNode;
  selectionMode?: TreeSelectionMode;
  selectedKeys?: string[];
  lines?: boolean;
}

const props = withDefaults(defineProps<TreeNodeProps>(), {
  tree: null,
  parent: undefined,
  selectionMode: 'single',
  selectedKeys: () => [],
  lines: true
});

const emit = defineEmits<{
  (e: 'node-click', event: { node: TreeNode; originalEvent: MouseEvent }): void;
  (e: 'node-toggle', event: { node: TreeNode; originalEvent: MouseEvent }): void;
  (e: 'node-checkbox', event: { node: TreeNode; originalEvent: MouseEvent }): void;
}>();

function isSelected(node: TreeNode): boolean {
  if (!node.key) return false;
  return props.selectedKeys.includes(node.key);
}

function hasChildren(node: TreeNode): boolean {
  return !node.leaf && Array.isArray(node.children) && node.children.length > 0;
}

function onToggle(e: MouseEvent, node: TreeNode) {
  e.stopPropagation();
  node.expanded = !node.expanded;
  emit('node-toggle', { node, originalEvent: e });
}

function onClick(e: MouseEvent, node: TreeNode) {
  if (node.disabled) return;
  emit('node-click', { node, originalEvent: e });
}

function onCheckboxClick(e: MouseEvent, node: TreeNode) {
  e.stopPropagation();
  if (node.disabled) return;
  emit('node-checkbox', { node, originalEvent: e });
}
</script>

<template>
  <li class="val-treenode" :class="[node.styleClass, { 'val-treenode-leaf': !hasChildren(node) }]">
    <div
      class="val-treenode-content"
      :class="{
        'val-treenode-selected': isSelected(node),
        'val-treenode-disabled': node.disabled
      }"
      @click="onClick($event, node)"
    >
      <!-- Expand Toggler -->
      <span
        class="val-treenode-toggler"
        :class="{
          'val-treenode-toggler-expanded': node.expanded,
          'val-treenode-toggler-empty': !hasChildren(node)
        }"
        @click="onToggle($event, node)"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>

      <!-- Checkbox Selection -->
      <span
        v-if="selectionMode === 'checkbox'"
        class="val-treenode-checkbox"
        :class="{
          'val-treenode-checkbox-checked': isSelected(node),
          'val-treenode-checkbox-partial': node.partialSelected
        }"
        @click="onCheckboxClick($event, node)"
      >
        <svg
          v-if="isSelected(node)"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span v-else-if="node.partialSelected" class="val-checkbox-minus" />
      </span>

      <!-- Icon -->
      <span v-if="node.icon || node.expandedIcon || node.collapsedIcon" class="val-treenode-icon">
        <svg
          v-if="hasChildren(node)"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </span>

      <!-- Label -->
      <span class="val-treenode-label">{{ node.label }}</span>
    </div>

    <!-- Recursive Children -->
    <ul
      v-if="hasChildren(node) && node.expanded"
      class="val-tree-children"
      :class="{ 'val-tree-lines': lines }"
    >
      <ValTreeNode
        v-for="child in node.children"
        :key="child.key || child.label"
        :node="child"
        :selection-mode="selectionMode"
        :selected-keys="selectedKeys"
        :lines="lines"
        @node-click="emit('node-click', $event)"
        @node-toggle="emit('node-toggle', $event)"
        @node-checkbox="emit('node-checkbox', $event)"
      />
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.val-treenode {
  display: flex;
  flex-direction: column;
  position: relative;
}

.val-treenode-content {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
  transition: background-color 0.15s ease, color 0.15s ease;
  color: #1e293b;

  &:hover:not(.val-treenode-disabled) {
    background: rgba(59, 130, 246, 0.08);
  }

  &.val-treenode-selected {
    background: rgba(59, 130, 246, 0.12);
    color: var(--val-primary, #3b82f6);
    font-weight: 500;

    .val-treenode-icon {
      color: var(--val-primary, #3b82f6);
    }
  }

  &.val-treenode-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.val-treenode-toggler {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  color: #64748b;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #0f172a;
  }

  &.val-treenode-toggler-expanded {
    transform: rotate(90deg);
  }

  &.val-treenode-toggler-empty {
    visibility: hidden;
    pointer-events: none;
  }
}

.val-treenode-checkbox {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 4px;
  border: 1.5px solid #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.25rem;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &-checked {
    background-color: var(--val-primary, #3b82f6);
    border-color: var(--val-primary, #3b82f6);
    color: #ffffff;
  }

  &-partial {
    background-color: var(--val-primary, #3b82f6);
    border-color: var(--val-primary, #3b82f6);
    color: #ffffff;
  }
}

.val-checkbox-minus {
  display: block;
  width: 8px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 1px;
}

.val-treenode-icon {
  display: inline-flex;
  align-items: center;
  color: #64748b;
  flex-shrink: 0;
}

.val-treenode-label {
  font-size: 0.875rem;
  flex: 1;
}

.val-tree-children {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  position: relative;

  &.val-tree-lines {
    &::before {
      content: '';
      position: absolute;
      left: 0.625rem;
      top: 0;
      bottom: 0.75rem;
      width: 1px;
      background: rgba(203, 213, 225, 0.7);
    }
  }
}
</style>
