<script setup lang="ts">
import { computed } from 'vue';
import ValDropdown, { type DropdownOption } from '../dropdown/ValDropdown.vue';

export interface PaginatorProps {
  totalRecords?: number;
  rows?: number;
  page?: number;
  first?: number;
  rowsPerPageOptions?: number[];
}

export interface PageChangeEvent {
  page: number;
  first: number;
  rows: number;
}

const props = withDefaults(defineProps<PaginatorProps>(), {
  totalRecords: 0,
  rows: 10,
  page: 0,
  first: 0,
  rowsPerPageOptions: () => []
});

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
  (e: 'update:first', first: number): void;
  (e: 'update:rows', rows: number): void;
  (e: 'pageChange', event: PageChangeEvent): void;
}>();

const dropdownOptions = computed<DropdownOption[]>(() => {
  return props.rowsPerPageOptions.map(opt => ({
    label: String(opt),
    value: opt
  }));
});

const currentPage = computed(() => {
  if (props.first > 0 && props.rows > 0) {
    return Math.floor(props.first / props.rows);
  }
  return props.page;
});

const pageCount = computed(() => Math.ceil(props.totalRecords / props.rows) || 1);
const isFirstPage = computed(() => currentPage.value === 0);
const isLastPage = computed(() => currentPage.value === pageCount.value - 1);

const currentFirst = computed(() => currentPage.value * props.rows);
const currentLast = computed(() => Math.min((currentPage.value + 1) * props.rows, props.totalRecords));

const visiblePages = computed(() => {
  const total = pageCount.value;
  const current = currentPage.value;
  let start = Math.max(0, current - 2);
  const end = Math.min(total, start + 5);

  if (end - start < 5) {
    start = Math.max(0, end - 5);
  }

  const pages = [];
  for (let i = start; i < end; i++) pages.push(i);
  return pages;
});

function changePage(p: number) {
  if (p >= 0 && p < pageCount.value && p !== currentPage.value) {
    const newFirst = p * props.rows;
    emit('update:page', p);
    emit('update:first', newFirst);
    emit('pageChange', { page: p, first: newFirst, rows: props.rows });
  }
}

function onRowsPerPageSelect(newRows: any) {
  const parsed = Number(newRows);
  if (parsed && parsed !== props.rows) {
    emit('update:rows', parsed);
    emit('update:page', 0);
    emit('update:first', 0);
    emit('pageChange', { page: 0, first: 0, rows: parsed });
  }
}
</script>

<template>
  <div class="val-paginator">
    <button
      type="button"
      class="val-paginator-button"
      :disabled="isFirstPage"
      title="Primera Página"
      @click="changePage(0)"
    >
      <span class="val-paginator-icon">«</span>
    </button>

    <button
      type="button"
      class="val-paginator-button"
      :disabled="isFirstPage"
      title="Página Anterior"
      @click="changePage(currentPage - 1)"
    >
      <span class="val-paginator-icon">‹</span>
    </button>

    <div class="val-paginator-pages">
      <button
        v-for="p in visiblePages"
        :key="p"
        type="button"
        class="val-paginator-page"
        :class="{ 'val-paginator-page-active': p === currentPage }"
        @click="changePage(p)"
      >
        {{ p + 1 }}
      </button>
    </div>

    <button
      type="button"
      class="val-paginator-button"
      :disabled="isLastPage"
      title="Siguiente Página"
      @click="changePage(currentPage + 1)"
    >
      <span class="val-paginator-icon">›</span>
    </button>

    <button
      type="button"
      class="val-paginator-button"
      :disabled="isLastPage"
      title="Última Página"
      @click="changePage(pageCount - 1)"
    >
      <span class="val-paginator-icon">»</span>
    </button>

    <div v-if="rowsPerPageOptions.length > 0" class="val-paginator-rpp-wrapper">
      <ValDropdown
        :model-value="rows"
        :options="dropdownOptions"
        size="sm"
        @update:model-value="onRowsPerPageSelect"
      />
    </div>

    <span class="val-paginator-current">
      Mostrando {{ totalRecords === 0 ? 0 : currentFirst + 1 }} a {{ currentLast }} de {{ totalRecords }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.val-paginator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  gap: 0.25rem;
  flex-wrap: wrap;

  &-button, &-page {
    min-width: 2.25rem;
    height: 2.25rem;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;

    &:hover:not(:disabled) {
      background: #f1f5f9;
      color: #334155;
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &-pages {
    display: flex;
    gap: 0.25rem;
  }

  &-page-active {
    background: #eff6ff !important;
    color: var(--val-primary, #3b82f6) !important;
    font-weight: 600;
  }

  &-icon {
    font-size: 1.125rem;
    line-height: 1;
  }

  &-current {
    margin-left: auto;
    font-size: 0.8125rem;
    color: #64748b;
  }

  &-rpp-wrapper {
    margin: 0 0.5rem;
    width: 80px;
  }
}

@media (max-width: 640px) {
  .val-paginator-current {
    width: 100%;
    margin-left: 0;
    text-align: center;
    margin-top: 0.5rem;
  }
}
</style>
