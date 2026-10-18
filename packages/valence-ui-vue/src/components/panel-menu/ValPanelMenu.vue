<script setup lang="ts">
import { ref } from 'vue';

export interface PanelMenuItem {
  label: string;
  icon?: string;
  url?: string;
  items?: PanelMenuItem[];
  badge?: string | number;
  badgeSeverity?: string;
  expanded?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

export interface PanelMenuProps {
  model?: PanelMenuItem[];
  items?: PanelMenuItem[];
  level?: number;
  multiple?: boolean;
}

const props = withDefaults(defineProps<PanelMenuProps>(), {
  model: () => [],
  items: () => [],
  level: 0,
  multiple: false
});

const emit = defineEmits<{
  (e: 'itemClick', item: PanelMenuItem): void;
}>();

const items = ref<PanelMenuItem[]>(props.items.length > 0 ? props.items : props.model);

function toggle(item: PanelMenuItem) {
  if (item.disabled) return;

  if (item.items && item.items.length > 0) {
    if (!props.multiple) {
      for (const i of items.value) {
        if (i !== item) i.expanded = false;
      }
    }
    item.expanded = !item.expanded;
  }

  emit('itemClick', item);
}
</script>

<template>
  <div class="val-panelmenu">
    <div
      v-for="(panel, index) in items"
      :key="panel.label || index"
      class="val-panelmenu-panel"
      :class="{ 'val-panelmenu-panel--expanded': panel.expanded }"
    >
      <div
        class="val-panelmenu-header"
        :class="{ 'val-panelmenu-header--disabled': panel.disabled }"
        @click="toggle(panel)"
      >
        <span v-if="panel.icon" class="val-panelmenu-icon">{{ panel.icon }}</span>
        <span class="val-panelmenu-label">{{ panel.label }}</span>

        <span v-if="panel.badge" class="val-panelmenu-badge">{{ panel.badge }}</span>

        <span v-if="panel.items && panel.items.length > 0" class="val-panelmenu-toggler">
          <svg
            class="val-panelmenu-caret"
            :class="{ 'val-panelmenu-caret--expanded': panel.expanded }"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      <!-- Submenu items -->
      <transition name="val-panelmenu-slide">
        <ul
          v-if="panel.items && panel.items.length > 0 && panel.expanded"
          class="val-panelmenu-sublist"
        >
          <li
            v-for="(sub, subIdx) in panel.items"
            :key="sub.label || subIdx"
            class="val-panelmenu-subitem"
            :class="{ 'val-panelmenu-subitem--disabled': sub.disabled }"
          >
            <a
              :href="sub.url || 'javascript:void(0)'"
              class="val-panelmenu-sublink"
              @click.stop="toggle(sub)"
            >
              <span v-if="sub.icon" class="val-panelmenu-subicon">{{ sub.icon }}</span>
              <span class="val-panelmenu-subtext">{{ sub.label }}</span>
              <span v-if="sub.badge" class="val-panelmenu-badge val-panelmenu-badge--sm">
                {{ sub.badge }}
              </span>
            </a>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.val-panelmenu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;

  &-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
    transition: all 0.2s ease;

    &--expanded {
      border-color: #cbd5e1;
    }
  }

  &-header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    cursor: pointer;
    user-select: none;
    background: #f8fafc;
    color: #1e293b;
    font-size: 0.875rem;
    font-weight: 600;
    transition: background-color 0.15s ease;

    &:hover {
      background: #f1f5f9;
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &-icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }

  &-label {
    flex: 1;
  }

  &-badge {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    background: rgba(59, 130, 246, 0.12);
    color: var(--val-primary, #3b82f6);
    margin-left: 0.5rem;

    &--sm {
      font-size: 0.6875rem;
      padding: 0.0625rem 0.375rem;
    }
  }

  &-toggler {
    display: inline-flex;
    align-items: center;
    margin-left: 0.5rem;
    color: #64748b;
  }

  &-caret {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &--expanded {
      transform: rotate(180deg);
    }
  }

  &-sublist {
    list-style: none;
    margin: 0;
    padding: 0.375rem 0;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  &-sublink {
    display: flex;
    align-items: center;
    padding: 0.5rem 1.25rem;
    color: #475569;
    text-decoration: none;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background: #f8fafc;
      color: var(--val-primary, #3b82f6);
    }
  }

  &-subicon {
    margin-right: 0.5rem;
  }

  &-subtext {
    flex: 1;
  }
}

.val-panelmenu-slide-enter-active,
.val-panelmenu-slide-leave-active {
  transition: all 0.2s ease-out;
  max-height: 400px;
  overflow: hidden;
}

.val-panelmenu-slide-enter-from,
.val-panelmenu-slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
