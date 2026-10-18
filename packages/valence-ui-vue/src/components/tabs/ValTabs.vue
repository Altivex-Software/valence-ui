<script setup lang="ts">
import {
  ref,
  computed,
  provide,
  readonly,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue';

export interface TabData {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface TabsProps {
  modelValue?: number;
  activeIndex?: number;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | string;
}

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: 0,
  activeIndex: undefined,
  color: 'primary'
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'update:activeIndex', val: number): void;
  (e: 'change', val: number): void;
}>();

const tabs = ref<TabData[]>([]);
const currentActive = computed(() =>
  props.activeIndex !== undefined ? props.activeIndex : props.modelValue
);

const headerContainer = ref<HTMLElement | null>(null);
const tabButtons = ref<HTMLElement[]>([]);

const indicatorLeft = ref(0);
const indicatorWidth = ref(0);

const showLeftArrow = ref(false);
const showRightArrow = ref(false);

function registerTab(tab: TabData) {
  const existing = tabs.value.findIndex((t) => t.id === tab.id);
  if (existing >= 0) {
    tabs.value[existing] = tab;
  } else {
    tabs.value.push(tab);
  }
}

function unregisterTab(id: string) {
  tabs.value = tabs.value.filter((t) => t.id !== id);
}

provide('valTabsContext', {
  currentActive,
  tabs: readonly(tabs),
  registerTab,
  unregisterTab
});

function updateIndicator() {
  const index = currentActive.value;
  const button = tabButtons.value[index];
  if (button) {
    indicatorLeft.value = button.offsetLeft;
    indicatorWidth.value = button.offsetWidth;
    scrollToTab(button);
  }
}

function checkScroll() {
  const el = headerContainer.value;
  if (!el) return;
  showLeftArrow.value = el.scrollLeft > 0;
  showRightArrow.value = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
}

function scrollHeader(direction: 'left' | 'right') {
  const el = headerContainer.value;
  if (!el) return;
  const scrollAmount = 200;
  el.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
  setTimeout(checkScroll, 350);
}

function scrollToTab(element: HTMLElement) {
  const container = headerContainer.value;
  if (!container) return;
  const scrollLeft = container.scrollLeft;
  const containerWidth = container.clientWidth;
  const elementLeft = element.offsetLeft;
  const elementWidth = element.offsetWidth;

  if (elementLeft < scrollLeft) {
    container.scrollTo({ left: elementLeft, behavior: 'smooth' });
  } else if (elementLeft + elementWidth > scrollLeft + containerWidth) {
    container.scrollTo({
      left: elementLeft + elementWidth - containerWidth,
      behavior: 'smooth'
    });
  }
}

function selectTab(index: number) {
  const target = tabs.value[index];
  if (target && !target.disabled) {
    emit('update:modelValue', index);
    emit('update:activeIndex', index);
    emit('change', index);
  }
}

function onKeyDown(event: KeyboardEvent) {
  const count = tabs.value.length;
  if (count === 0) return;
  let nextIndex = -1;
  const cur = currentActive.value;

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (cur + 1) % count;
      while (tabs.value[nextIndex]?.disabled && nextIndex !== cur) {
        nextIndex = (nextIndex + 1) % count;
      }
      break;
    case 'ArrowLeft':
      nextIndex = (cur - 1 + count) % count;
      while (tabs.value[nextIndex]?.disabled && nextIndex !== cur) {
        nextIndex = (nextIndex - 1 + count) % count;
      }
      break;
    case 'Home':
      nextIndex = 0;
      if (tabs.value[nextIndex]?.disabled) {
        nextIndex = tabs.value.findIndex((t) => !t.disabled);
      }
      break;
    case 'End':
      nextIndex = count - 1;
      if (tabs.value[nextIndex]?.disabled) {
        for (let i = count - 1; i >= 0; i--) {
          if (!tabs.value[i].disabled) {
            nextIndex = i;
            break;
          }
        }
      }
      break;
    default:
      return;
  }

  if (nextIndex !== -1 && nextIndex !== cur) {
    event.preventDefault();
    selectTab(nextIndex);
    nextTick(() => {
      tabButtons.value[nextIndex]?.focus();
    });
  }
}

watch(currentActive, () => {
  nextTick(() => {
    updateIndicator();
    checkScroll();
  });
});

watch(
  tabs,
  () => {
    nextTick(() => {
      updateIndicator();
      checkScroll();
    });
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    updateIndicator();
    checkScroll();
  });
  window.addEventListener('resize', checkScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScroll);
});
</script>

<template>
  <div class="val-tabs" :class="`val-tabs--${color}`">
    <div class="val-tabs__header-container">
      <button
        v-if="showLeftArrow"
        type="button"
        class="val-tabs__nav val-tabs__nav--prev"
        aria-label="Tabs anteriores"
        @click="scrollHeader('left')"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div
        ref="headerContainer"
        class="val-tabs__header"
        role="tablist"
        tabindex="0"
        @scroll="checkScroll"
        @keydown="onKeyDown"
      >
        <button
          v-for="(tab, i) in tabs"
          :id="`${tab.id}-label`"
          :key="tab.id"
          ref="tabButtons"
          type="button"
          class="val-tabs__tab-label"
          :class="{
            'val-tabs__tab-label--active': i === currentActive,
            'val-tabs__tab-label--disabled': tab.disabled
          }"
          role="tab"
          :aria-selected="i === currentActive"
          :aria-controls="`${tab.id}-panel`"
          :tabindex="i === currentActive ? 0 : -1"
          :disabled="tab.disabled"
          @click="selectTab(i)"
        >
          <span v-if="tab.icon" class="val-tabs__tab-icon">
            <i :class="tab.icon"></i>
          </span>
          <span>{{ tab.label }}</span>
        </button>

        <div
          class="val-tabs__indicator"
          :style="{
            left: `${indicatorLeft}px`,
            width: `${indicatorWidth}px`
          }"
          aria-hidden="true"
        ></div>
      </div>

      <button
        v-if="showRightArrow"
        type="button"
        class="val-tabs__nav val-tabs__nav--next"
        aria-label="Siguientes tabs"
        @click="scrollHeader('right')"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="val-tabs__content" role="tabpanel">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.val-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: var(--font-primary, 'Manrope', sans-serif);

  --val-tabs-color: var(--val-primary, #0066ff);

  &--secondary { --val-tabs-color: var(--val-secondary, #64748b); }
  &--success { --val-tabs-color: var(--val-success, #22c55e); }
  &--warning { --val-tabs-color: var(--val-warning, #f59e0b); }
  &--danger { --val-tabs-color: var(--val-danger, #ef4444); }
  &--info { --val-tabs-color: var(--val-info, #06b6d4); }

  &__header-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__header {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    gap: 1rem;
    overflow-x: auto;
    position: relative;
    scrollbar-width: none;
    scroll-behavior: smooth;
    width: 100%;
    outline: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__nav {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 0;
    transition: color 0.2s;

    &:hover {
      color: var(--val-tabs-color);
    }

    &--prev {
      left: 0;
      background: linear-gradient(to right, #ffffff 60%, transparent);
    }

    &--next {
      right: 0;
      background: linear-gradient(to left, #ffffff 60%, transparent);
    }
  }

  &__indicator {
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: var(--val-tabs-color);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &__tab-label {
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 0.9375rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-weight: 500;
    color: var(--val-tabs-color);
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    white-space: nowrap;
    opacity: 0.6;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;

    &:hover:not(&--disabled) {
      opacity: 0.85;
      background-color: rgba(0, 102, 255, 0.04);
    }

    &--active {
      opacity: 1;
      font-weight: 600;
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  &__content {
    padding-top: 1rem;
    animation: valTabsFadeIn 0.25s ease-in-out;
  }
}

@keyframes valTabsFadeIn {
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
