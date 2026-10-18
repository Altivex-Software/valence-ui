<script setup lang="ts">
import { ref, computed, watch } from 'vue';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

export type SelectionMode = 'single' | 'multiple';

export interface TableProps {
  value?: any[];
  columns?: TableColumn[];
  dataKey?: string;
  selectionMode?: SelectionMode | null;
  selection?: any | any[] | null;
  globalFilter?: string;
  sortField?: string | null;
  sortOrder?: number;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<TableProps>(), {
  value: () => [],
  columns: () => [],
  dataKey: 'id',
  selectionMode: null,
  selection: null,
  globalFilter: '',
  sortField: null,
  sortOrder: 1,
  striped: false,
  hoverable: true,
  bordered: true,
  emptyMessage: 'No se encontraron registros'
});

const emit = defineEmits<{
  (e: 'update:selection', val: any): void;
  (e: 'update:sortField', val: string | null): void;
  (e: 'update:sortOrder', val: number): void;
  (e: 'sort', event: { field: string; order: number }): void;
  (e: 'rowSelect', val: any): void;
  (e: 'rowUnselect', val: any): void;
}>();

const sortField = ref<string | null>(props.sortField);
const sortOrder = ref<number>(props.sortOrder);

watch(() => props.sortField, (val) => {
  sortField.value = val ?? null;
});

watch(() => props.sortOrder, (val) => {
  sortOrder.value = val ?? 1;
});

function toggleSort(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value * -1;
  } else {
    sortField.value = field;
    sortOrder.value = 1;
  }
  emit('update:sortField', sortField.value);
  emit('update:sortOrder', sortOrder.value);
  emit('sort', { field: sortField.value!, order: sortOrder.value });
}

function resolveFieldData(data: any, field: string): any {
  if (!data || !field) return null;
  if (!field.includes('.')) return data[field];
  const fields = field.split('.');
  let val = data;
  for (const f of fields) {
    if (val === null || val === undefined) return null;
    val = val[f];
  }
  return val;
}

const processedData = computed(() => {
  let list = [...props.value];
  const filter = (props.globalFilter || '').toLowerCase().trim();

  // 1. Global Filter
  if (filter) {
    list = list.filter((item) => {
      return Object.keys(item).some((key) => {
        const v = item[key];
        return v !== null && v !== undefined && String(v).toLowerCase().includes(filter);
      });
    });
  }

  // 2. Sorting
  if (sortField.value) {
    const field = sortField.value;
    const order = sortOrder.value;
    list.sort((a, b) => {
      const valA = resolveFieldData(a, field);
      const valB = resolveFieldData(b, field);
      let res = 0;
      if (valA == null && valB != null) res = -1;
      else if (valA != null && valB == null) res = 1;
      else if (typeof valA === 'string' && typeof valB === 'string') {
        res = valA.localeCompare(valB);
      } else {
        res = valA < valB ? -1 : valA > valB ? 1 : 0;
      }
      return res * order;
    });
  }

  return list;
});

function equals(a: any, b: any): boolean {
  if (a && b && props.dataKey && a[props.dataKey] !== undefined && b[props.dataKey] !== undefined) {
    return a[props.dataKey] === b[props.dataKey];
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

function isRowSelected(row: any): boolean {
  if (!props.selectionMode || !props.selection) return false;
  if (props.selectionMode === 'single') {
    return equals(props.selection, row);
  }
  if (props.selectionMode === 'multiple' && Array.isArray(props.selection)) {
    return props.selection.some((item) => equals(item, row));
  }
  return false;
}

function handleRowClick(row: any) {
  if (!props.selectionMode) return;

  let newSel: any;
  let isNowSelected = false;

  if (props.selectionMode === 'single') {
    if (isRowSelected(row)) {
      newSel = null;
      isNowSelected = false;
    } else {
      newSel = row;
      isNowSelected = true;
    }
  } else if (props.selectionMode === 'multiple') {
    const arr = Array.isArray(props.selection) ? [...props.selection] : [];
    const idx = arr.findIndex((item) => equals(item, row));
    if (idx >= 0) {
      arr.splice(idx, 1);
      isNowSelected = false;
    } else {
      arr.push(row);
      isNowSelected = true;
    }
    newSel = arr;
  }

  emit('update:selection', newSel);
  if (isNowSelected) {
    emit('rowSelect', row);
  } else {
    emit('rowUnselect', row);
  }
}

function exportCSV(filename: string = 'export.csv') {
  const data = processedData.value;
  if (!data || data.length === 0) return;

  const cols = props.columns.length > 0
    ? props.columns
    : Object.keys(data[0]).map((k) => ({ field: k, header: k }));

  const headers = cols.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',');
  const rows = data.map((row) => {
    return cols
      .map((c) => {
        const val = resolveFieldData(row, c.field) ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

defineExpose({
  exportCSV,
  toggleSort,
  processedData
});
</script>

<template>
  <div
    class="val-table-container"
    :class="{
      'val-table-container--bordered': bordered
    }"
  >
    <div class="val-table-wrapper">
      <table
        class="val-table"
        :class="{
          'val-table--striped': striped,
          'val-table--hoverable': hoverable
        }"
      >
        <thead class="val-table-thead">
          <slot name="header">
            <tr>
              <th
                v-for="col in columns"
                :key="col.field"
                :style="{ width: col.width }"
                :class="{ 'val-sortable-column': col.sortable }"
                @click="col.sortable ? toggleSort(col.field) : undefined"
              >
                <div class="val-flex val-align-items-center val-justify-content-between">
                  <span>{{ col.header }}</span>
                  <span
                    v-if="col.sortable"
                    class="val-sort-icon"
                    :class="{ active: sortField === col.field }"
                  >
                    <!-- Up arrow if active & ASC, Down arrow if active & DESC, Dual arrow otherwise -->
                    <svg
                      v-if="sortField === col.field && sortOrder === 1"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <svg
                      v-else-if="sortField === col.field && sortOrder === -1"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      opacity="0.4"
                    >
                      <polyline points="7 15 12 20 17 15"></polyline>
                      <polyline points="7 9 12 4 17 9"></polyline>
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
          </slot>
        </thead>

        <tbody class="val-table-tbody">
          <template v-if="processedData.length > 0">
            <tr
              v-for="(row, index) in processedData"
              :key="row[dataKey] ?? index"
              :class="{
                'val-table-row-selected': isRowSelected(row),
                'val-table-row-selectable': !!selectionMode
              }"
              @click="handleRowClick(row)"
            >
              <slot
                name="body"
                :row="row"
                :index="index"
                :selected="isRowSelected(row)"
              >
                <td v-for="col in columns" :key="col.field">
                  {{ resolveFieldData(row, col.field) }}
                </td>
              </slot>
            </tr>
          </template>

          <tr v-else>
            <td
              class="val-table-empty"
              :colspan="columns.length || 10"
            >
              <slot name="empty">{{ emptyMessage }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.val-table-container {
  width: 100%;
  background: #ffffff;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &--bordered {
    border: 1px solid var(--val-border-color, #e2e8f0);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }
}

.val-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.val-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;

  th, td {
    vertical-align: middle;
    box-sizing: border-box;
  }

  &-thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }

  th {
    padding: 0.875rem 1rem;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;

    &.val-sortable-column {
      cursor: pointer;
      user-select: none;
      transition: background 0.15s, color 0.15s;

      &:hover {
        background: #f1f5f9;
        color: var(--val-primary, #0066ff);
      }
    }
  }

  .val-sort-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    color: #64748b;
    transition: color 0.2s;

    &.active {
      color: var(--val-primary, #0066ff);
    }
  }

  tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.15s;

    &:last-child {
      border-bottom: none;
    }
  }

  &--hoverable tbody tr:hover {
    background: #f8fafc;
  }

  &--striped tbody tr:nth-child(even) {
    background: #fafafa;
  }

  td {
    padding: 0.875rem 1rem;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
  }

  &-row-selectable {
    cursor: pointer;
  }

  &-row-selected {
    background-color: #eff6ff !important;
    color: #1d4ed8;

    td {
      border-bottom-color: #bfdbfe;
      color: #1d4ed8;
    }
  }

  &-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: #94a3b8;
    font-style: italic;
  }
}
</style>
