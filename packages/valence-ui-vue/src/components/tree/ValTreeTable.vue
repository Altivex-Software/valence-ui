<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNode } from './tree.types';

export interface TreeTableColumn {
  field: string;
  header: string;
  width?: string;
  expando?: boolean;
}

export interface TreeTableProps {
  value?: TreeNode[];
  columns?: TreeTableColumn[];
  selectionMode?: 'single' | 'multiple' | 'none';
  bordered?: boolean;
  striped?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<TreeTableProps>(), {
  value: () => [],
  columns: () => [],
  selectionMode: 'none',
  bordered: true,
  striped: false,
  emptyMessage: 'No records found'
});

interface FlattenedRow {
  node: TreeNode;
  level: number;
  hasChildren: boolean;
}

function flatten(nodes: TreeNode[], level = 0): FlattenedRow[] {
  const result: FlattenedRow[] = [];
  for (const node of nodes) {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    result.push({ node, level, hasChildren });
    if (hasChildren && node.expanded) {
      result.push(...flatten(node.children!, level + 1));
    }
  }
  return result;
}

const visibleRows = computed(() => {
  return flatten(props.value);
});

function toggleExpand(node: TreeNode) {
  node.expanded = !node.expanded;
}
</script>

<template>
  <div class="val-treetable-container" :class="{ 'val-treetable-bordered': bordered }">
    <table class="val-treetable" :class="{ 'val-treetable-striped': striped }">
      <thead>
        <tr>
          <th
            v-for="(col, idx) in columns"
            :key="col.field"
            :style="{ width: col.width }"
            :class="{ 'val-treetable-th-expando': col.expando ?? (idx === 0) }"
          >
            {{ col.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="visibleRows.length === 0">
          <td :colspan="columns.length" class="val-treetable-empty">
            No se encontraron registros jerárquicos.
          </td>
        </tr>
        <tr
          v-for="row in visibleRows"
          :key="row.node.key || row.node.label"
          class="val-treetable-row"
        >
          <td
            v-for="(col, idx) in columns"
            :key="col.field"
            :class="{ 'val-treetable-cell-expando': col.expando ?? (idx === 0) }"
          >
            <div
              v-if="col.expando ?? (idx === 0)"
              class="val-treetable-expando-content"
              :style="{ paddingLeft: `${row.level * 1.5}rem` }"
            >
              <button
                v-if="row.hasChildren"
                type="button"
                class="val-treetable-toggler"
                :class="{ 'val-treetable-toggler--expanded': row.node.expanded }"
                @click="toggleExpand(row.node)"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <span v-else class="val-treetable-toggler-spacer" />

              <slot :name="col.field" :node="row.node" :value="row.node.data?.[col.field] ?? row.node.label">
                <span class="val-treetable-cell-text">
                  {{ row.node.data?.[col.field] ?? (idx === 0 ? row.node.label : '') }}
                </span>
              </slot>
            </div>

            <div v-else class="val-treetable-standard-content">
              <slot :name="col.field" :node="row.node" :value="row.node.data?.[col.field]">
                <span class="val-treetable-cell-text">{{ row.node.data?.[col.field] ?? '-' }}</span>
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.val-treetable-container {
  width: 100%;
  overflow-x: auto;
  background: #ffffff;
  border-radius: var(--radius-md, 8px);

  &.val-treetable-bordered {
    border: 1px solid #e2e8f0;
  }
}

.val-treetable {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;

  thead {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;

    th {
      padding: 0.75rem 1rem;
      font-weight: 600;
      color: #475569;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;

      &:hover {
        background-color: #f8fafc;
      }
    }

    td {
      padding: 0.75rem 1rem;
      color: #1e293b;
      vertical-align: middle;
    }
  }

  &.val-treetable-striped tbody tr:nth-child(even) {
    background-color: #fcfcfd;
  }
}

.val-treetable-empty {
  text-align: center;
  padding: 2rem !important;
  color: #94a3b8;
}

.val-treetable-expando-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.val-treetable-toggler {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #64748b;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #0f172a;
  }

  &--expanded {
    transform: rotate(90deg);
  }
}

.val-treetable-toggler-spacer {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.val-treetable-cell-text {
  font-size: 0.875rem;
}
</style>
