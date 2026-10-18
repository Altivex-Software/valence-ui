<script setup lang="ts">
export interface MenuItem {
  label?: string;
  icon?: string;
  routerLink?: string;
  url?: string;
  items?: MenuItem[];
  separator?: boolean;
  disabled?: boolean;
  command?: (event: { item: MenuItem }) => void;
}

export interface MenubarProps {
  model?: MenuItem[];
}

withDefaults(defineProps<MenubarProps>(), {
  model: () => []
});

const emit = defineEmits<{
  (e: 'itemClick', item: MenuItem): void;
}>();

function onItemClick(item: MenuItem) {
  if (item.disabled) return;
  if (item.command) item.command({ item });
  emit('itemClick', item);
}
</script>

<template>
  <nav class="val-menubar val-elevation-1">
    <div v-if="$slots.start" class="val-menubar-start">
      <slot name="start" />
    </div>

    <ul class="val-menubar-root-list">
      <template v-for="(item, index) in model" :key="item.label || index">
        <li v-if="item.separator" class="val-menubar-separator" />
        <li
          v-else
          class="val-menubar-item"
          :class="{
            'val-menubar-item--has-children': item.items && item.items.length > 0,
            'val-menubar-item--disabled': item.disabled
          }"
        >
          <a
            :href="item.url || 'javascript:void(0)'"
            class="val-menubar-item-link"
            @click="onItemClick(item)"
          >
            <span v-if="item.icon" class="val-menubar-item-icon">
              <!-- Default menu icon if string -->
              <span class="val-menubar-icon-text">{{ item.icon }}</span>
            </span>
            <span class="val-menubar-item-label">{{ item.label }}</span>
            <span v-if="item.items && item.items.length > 0" class="val-menubar-submenu-icon">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </a>

          <!-- Submenu Dropdown -->
          <ul v-if="item.items && item.items.length > 0" class="val-menubar-submenu">
            <template v-for="(subitem, subIdx) in item.items" :key="subitem.label || subIdx">
              <li v-if="subitem.separator" class="val-menubar-separator val-menubar-separator-sub" />
              <li
                v-else
                class="val-menubar-item"
                :class="{ 'val-menubar-item--disabled': subitem.disabled }"
              >
                <a
                  :href="subitem.url || 'javascript:void(0)'"
                  class="val-menubar-item-link"
                  @click="onItemClick(subitem)"
                >
                  <span v-if="subitem.icon" class="val-menubar-item-icon">
                    <span class="val-menubar-icon-text">{{ subitem.icon }}</span>
                  </span>
                  <span class="val-menubar-item-label">{{ subitem.label }}</span>
                </a>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>

    <div v-if="$slots.end" class="val-menubar-end">
      <slot name="end" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.val-menubar {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md, 8px);
  position: relative;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);

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

    &-label {
      line-height: 1.25;
    }

    &-icon {
      display: inline-flex;
      align-items: center;
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }

  &-submenu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.375rem 0;
    min-width: 190px;
    list-style: none;
    display: none;
    z-index: 1000;
    margin: 0;

    .val-menubar-item-link {
      padding: 0.5rem 1rem;
      border-radius: 0;

      &:hover {
        background-color: #f8fafc;
        color: var(--val-primary, #3b82f6);
      }
    }
  }

  &-item:hover > .val-menubar-submenu {
    display: block;
    animation: val-menu-fade-in 0.15s ease-out;
  }

  &-submenu-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 0.5rem;
    color: #94a3b8;
  }

  &-start, &-end {
    display: flex;
    align-items: center;
  }

  &-start {
    margin-right: 1rem;
  }

  &-end {
    margin-left: auto;
  }
}

.val-menubar-separator {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
  margin: 0 0.5rem;
  align-self: center;

  &-sub {
    width: 100%;
    height: 1px;
    margin: 0.25rem 0;
  }
}

@keyframes val-menu-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
