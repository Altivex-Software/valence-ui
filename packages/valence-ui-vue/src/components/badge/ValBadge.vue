<script setup lang="ts">
import { computed } from 'vue';
import type { ValenceSeverity, ValenceSize, ValenceColor } from '../../types';

export type BadgeVariant = 'filled' | 'outlined' | 'flat';

export interface BadgeProps {
  value?: string | number;
  severity?: ValenceSeverity | ValenceColor;
  variant?: BadgeVariant;
  size?: ValenceSize;
  pill?: boolean;
  dot?: boolean;
  overlay?: boolean;
  ariaLabel?: string | null;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  severity: 'primary',
  variant: 'filled',
  size: 'md',
  pill: false,
  dot: false,
  overlay: false,
  ariaLabel: null
});

const badgeClasses = computed(() => [
  'val-badge',
  `val-badge--${props.severity}`,
  `val-badge--${props.variant}`,
  `val-badge--${props.size}`,
  props.pill ? 'val-badge--pill' : '',
  props.dot ? 'val-badge--dot' : '',
  props.overlay ? 'val-badge--overlay' : ''
].filter(Boolean));

const effectiveAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  if (props.dot) return undefined;
  return props.value?.toString();
});
</script>

<template>
  <span
    :class="badgeClasses"
    :role="dot ? undefined : 'status'"
    :aria-label="effectiveAriaLabel"
    :aria-hidden="dot && !ariaLabel ? 'true' : undefined"
  >
    <slot v-if="!dot">{{ value }}</slot>
  </span>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/badge/badge.component.scss';
</style>
