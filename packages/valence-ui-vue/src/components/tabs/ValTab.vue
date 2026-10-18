<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, computed, watch, type ComputedRef, type DeepReadonly, type Ref } from 'vue';
import type { TabData } from './ValTabs.vue';

interface TabProps {
  id?: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<TabProps>(), {
  id: () => `val-tab-${Math.random().toString(36).substring(2, 9)}`,
  label: '',
  icon: undefined,
  disabled: false
});

const context = inject<{
  currentActive: ComputedRef<number>;
  tabs: DeepReadonly<Ref<TabData[]>>;
  registerTab: (tab: TabData) => void;
  unregisterTab: (id: string) => void;
} | null>('valTabsContext', null);

const isCurrentTab = computed(() => {
  if (!context) return true;
  const list = context.tabs.value;
  const idx = list.findIndex((t) => t.id === props.id);
  return idx === context.currentActive.value;
});

onMounted(() => {
  if (context) {
    context.registerTab({
      id: props.id,
      label: props.label,
      icon: props.icon,
      disabled: props.disabled
    });
  }
});

watch(
  () => [props.label, props.icon, props.disabled],
  () => {
    if (context) {
      context.registerTab({
        id: props.id,
        label: props.label,
        icon: props.icon,
        disabled: props.disabled
      });
    }
  }
);

onBeforeUnmount(() => {
  if (context) {
    context.unregisterTab(props.id);
  }
});
</script>

<template>
  <div
    v-show="isCurrentTab"
    :id="`${id}-panel`"
    class="val-tab-panel"
    role="tabpanel"
    :aria-labelledby="`${id}-label`"
  >
    <slot></slot>
  </div>
</template>

<style>
.val-tab-panel {
  width: 100%;
}
</style>
