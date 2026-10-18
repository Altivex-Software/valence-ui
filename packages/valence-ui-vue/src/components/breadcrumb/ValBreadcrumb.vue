<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  disabled?: boolean;
  target?: string;
  command?: (event: MouseEvent) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  homeIcon?: string;
  severity?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

withDefaults(defineProps<BreadcrumbProps>(), {
  items: () => [],
  separator: '/',
  homeIcon: undefined,
  severity: undefined
});

const emit = defineEmits<{
  (e: 'itemClick', item: BreadcrumbItem, event: MouseEvent): void;
}>();

function onItemClick(event: MouseEvent, item: BreadcrumbItem) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }
  if (item.command) {
    item.command(event);
  }
  emit('itemClick', item, event);
}
</script>

<template>
  <nav
    class="val-breadcrumb-container"
    :class="severity ? `val-breadcrumb--${severity}` : ''"
    aria-label="Breadcrumb"
  >
    <ol class="val-breadcrumb">
      <!-- Home Icon item -->
      <li v-if="homeIcon" class="val-breadcrumb-item">
        <span class="val-breadcrumb-icon">
          <i :class="homeIcon"></i>
        </span>
        <span v-if="items.length > 0" class="val-breadcrumb-separator" aria-hidden="true">
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>

      <!-- Items -->
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="val-breadcrumb-item"
        :class="{ 'val-breadcrumb-item--disabled': item.disabled }"
      >
        <slot name="item" :item="item" :last="index === items.length - 1">
          <!-- Link if url and not last -->
          <a
            v-if="item.url && index !== items.length - 1 && !item.disabled"
            :href="item.url"
            :target="item.target || '_self'"
            class="val-breadcrumb-link"
            @click="onItemClick($event, item)"
          >
            <span v-if="item.icon" class="val-breadcrumb-icon">
              <i :class="item.icon"></i>
            </span>
            <span class="val-breadcrumb-label">{{ item.label }}</span>
          </a>

          <!-- Static text otherwise -->
          <span
            v-else
            class="val-breadcrumb-text"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
            @click="item.command ? onItemClick($event, item) : undefined"
          >
            <span v-if="item.icon" class="val-breadcrumb-icon">
              <i :class="item.icon"></i>
            </span>
            <span class="val-breadcrumb-label">{{ item.label }}</span>
          </span>
        </slot>

        <!-- Separator -->
        <span
          v-if="index < items.length - 1"
          class="val-breadcrumb-separator"
          aria-hidden="true"
        >
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss">
.val-breadcrumb-container {
  display: block;
  font-family: var(--font-primary, 'Manrope', sans-serif);
}

.val-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  list-style: none;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--val-muted, #64748b);

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--val-primary, #0066ff);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s ease-in-out;

    &:hover {
      color: var(--val-primary-hover, #0052cc);
      text-decoration: underline;
    }
  }

  &-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--val-text-color, #1e293b);
    font-weight: 600;

    &[aria-current='page'] {
      color: var(--val-text-muted, #64748b);
      font-weight: 500;
    }
  }

  &-icon {
    font-size: 1em;
    display: inline-flex;
    align-items: center;
  }

  &-separator {
    display: flex;
    align-items: center;
    color: var(--val-muted, #94a3b8);
    user-select: none;
    padding: 0 0.125rem;
  }
}

// Color Severities
$breadcrumb-severities: (
  'primary': #0066ff,
  'secondary': #64748b,
  'success': #22c55e,
  'warning': #f59e0b,
  'danger': #ef4444,
  'info': #06b6d4
);

@each $name, $color in $breadcrumb-severities {
  .val-breadcrumb--#{$name} {
    .val-breadcrumb-link {
      color: $color;
      &:hover {
        color: color-mix(in srgb, #{$color}, black 20%);
      }
    }
    .val-breadcrumb-text {
      color: $color;
    }
    .val-breadcrumb-icon {
      color: $color;
    }
  }
}
</style>
