<script setup lang="ts">
export interface MegaMenuSubItem {
  label?: string;
  icon?: string;
  url?: string;
  disabled?: boolean;
  command?: (event: { item: MegaMenuSubItem }) => void;
}

export interface MegaMenuColumn {
  title?: string;
  items?: MegaMenuSubItem[];
}

export interface MegaMenuItem {
  label?: string;
  icon?: string;
  url?: string;
  columns?: MegaMenuColumn[];
  badge?: string | number;
  badgeSeverity?: string;
  separator?: boolean;
  disabled?: boolean;
  command?: (event: { item: MegaMenuItem }) => void;
}

export interface MegaMenuProps {
  model?: MegaMenuItem[];
  orientation?: 'horizontal' | 'vertical';
}

withDefaults(defineProps<MegaMenuProps>(), {
  model: () => [],
  orientation: 'horizontal'
});

const emit = defineEmits<{
  (e: 'itemClick', item: MegaMenuItem | MegaMenuSubItem): void;
}>();

function onItemClick(item: MegaMenuItem | MegaMenuSubItem) {
  if (item.disabled) return;
  if (item.command) item.command({ item: item as any });
  emit('itemClick', item);
}
</script>

<template>
  <nav
    class="val-megamenu val-elevation-1"
    :class="`val-megamenu--${orientation}`"
  >
    <div v-if="$slots.start" class="val-megamenu-start">
      <slot name="start" />
    </div>

    <ul class="val-megamenu-root-list">
      <template v-for="(item, index) in model" :key="item.label || index">
        <li v-if="item.separator" class="val-megamenu-separator" />
        <li
          v-else
          class="val-megamenu-item"
          :class="{
            'val-megamenu-item--has-children': item.columns && item.columns.length > 0,
            'val-megamenu-item--disabled': item.disabled
          }"
        >
          <a
            :href="item.url || 'javascript:void(0)'"
            class="val-megamenu-item-link"
            @click="onItemClick(item)"
          >
            <span v-if="item.icon" class="val-megamenu-item-icon">{{ item.icon }}</span>
            <span class="val-megamenu-item-label">{{ item.label }}</span>
            <span
              v-if="item.columns && item.columns.length > 0"
              class="val-megamenu-submenu-icon"
            >
              <svg
                v-if="orientation === 'horizontal'"
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </a>

          <!-- MegaMenu Flyout Overlay with Columns -->
          <div
            v-if="item.columns && item.columns.length > 0"
            class="val-megamenu-panel val-elevation-3"
            :style="{ minWidth: `${Math.min(item.columns.length * 200, 640)}px` }"
          >
            <div class="val-megamenu-grid">
              <div
                v-for="(col, colIdx) in item.columns"
                :key="col.title || colIdx"
                class="val-megamenu-col"
              >
                <div v-if="col.title" class="val-megamenu-col-title">
                  {{ col.title }}
                </div>
                <ul class="val-megamenu-sublist">
                  <li
                    v-for="(sub, subIdx) in col.items"
                    :key="sub.label || subIdx"
                    class="val-megamenu-subitem"
                    :class="{ 'val-megamenu-subitem--disabled': sub.disabled }"
                  >
                    <a
                      :href="sub.url || 'javascript:void(0)'"
                      class="val-megamenu-sublink"
                      @click="onItemClick(sub)"
                    >
                      <span v-if="sub.icon" class="val-megamenu-subicon">{{ sub.icon }}</span>
                      <span class="val-megamenu-sublabel">{{ sub.label }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>

    <div v-if="$slots.end" class="val-megamenu-end">
      <slot name="end" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.val-megamenu {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md, 8px);
  position: relative;

  &--vertical {
    flex-direction: column;
    align-items: stretch;
    width: 240px;
    padding: 0.5rem;

    .val-megamenu-root-list {
      flex-direction: column;
      width: 100%;
    }

    .val-megamenu-panel {
      top: 0;
      left: 100%;
      margin-left: 4px;
    }
  }

  &-root-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
  }

  &-item {
    position: relative;

    &-link {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.875rem;
      color: #475569;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      user-select: none;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }
    }

    &--disabled &-link {
      opacity: 0.5;
      pointer-events: none;
    }

    &-icon {
      margin-right: 0.5rem;
    }

    &:hover > .val-megamenu-panel {
      display: block;
      animation: val-megamenu-in 0.15s ease-out;
    }
  }

  &-submenu-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 0.5rem;
    color: #94a3b8;
  }

  &-panel {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    display: none;
    z-index: 1050;
  }

  &-grid {
    display: flex;
    gap: 1.5rem;
  }

  &-col {
    flex: 1;
    min-width: 160px;

    &-title {
      font-weight: 600;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 0.5rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid #f1f5f9;
    }
  }

  &-sublist {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &-sublink {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    color: #334155;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: all 0.15s;

    &:hover {
      background-color: #f8fafc;
      color: var(--val-primary, #3b82f6);
    }
  }

  &-subicon {
    margin-right: 0.5rem;
  }

  &-separator {
    width: 1px;
    height: 20px;
    background: #e2e8f0;
    margin: 0 0.5rem;
    align-self: center;
  }

  &-start { margin-right: 1rem; }
  &-end { margin-left: auto; }
}

@keyframes val-megamenu-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
