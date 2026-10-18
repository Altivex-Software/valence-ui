<script setup lang="ts">
import { computed } from 'vue';
import type { ValIconName, ValIconSize, ValIconColor, ValIconVariant } from './icon.types';
import { VAL_ICONS, type IconDefinition } from './icons';

export interface IconProps {
  name?: ValIconName | string;
  size?: ValIconSize;
  color?: ValIconColor;
  strokeWidth?: number;
  fill?: boolean;
  variant?: ValIconVariant;
  spin?: boolean;
  rotate?: number;
}

const props = withDefaults(defineProps<IconProps>(), {
  name: 'info',
  size: 'md',
  color: 'inherit',
  strokeWidth: 2,
  fill: false,
  variant: 'outline',
  spin: false,
  rotate: 0
});

const isFilled = computed<boolean>(() => {
  return props.fill || props.variant === 'fill' || (typeof props.name === 'string' && props.name.endsWith('-fill'));
});

const activeIconDef = computed<IconDefinition>(() => {
  const rawName = props.name as string;
  const filled = isFilled.value;
  const baseName = rawName.endsWith('-fill') ? rawName.replace(/-fill$/, '') as ValIconName : rawName as ValIconName;
  const fillName = (baseName + '-fill') as ValIconName;

  if (filled && VAL_ICONS[fillName]) {
    return VAL_ICONS[fillName]!;
  }
  if (VAL_ICONS[rawName as ValIconName]) {
    return VAL_ICONS[rawName as ValIconName]!;
  }
  if (VAL_ICONS[baseName]) {
    return VAL_ICONS[baseName]!;
  }
  return VAL_ICONS['info']!;
});

const resolvedFill = computed<string>(() => {
  return isFilled.value ? 'currentColor' : 'none';
});

const resolvedStroke = computed<string>(() => {
  const def = activeIconDef.value;
  if (isFilled.value && def.strokeInFill === false) {
    return 'none';
  }
  return 'currentColor';
});

const resolvedStrokeWidth = computed<number>(() => {
  const def = activeIconDef.value;
  if (isFilled.value && def.strokeInFill === false) {
    return 0;
  }
  return props.strokeWidth;
});

const dimension = computed<string>(() => {
  const s = props.size;
  if (typeof s === 'number') {
    return `${s}px`;
  }
  switch (s) {
    case 'xs': return '14px';
    case 'sm': return '16px';
    case 'md': return '20px';
    case 'lg': return '24px';
    case 'xl': return '32px';
    case '2xl': return '40px';
    case '3xl': return '48px';
    default:
      return isNaN(Number(s)) ? s : `${s}px`;
  }
});

const resolvedColor = computed<string>(() => {
  const c = props.color;
  switch (c) {
    case 'primary': return 'var(--val-primary, #0066ff)';
    case 'secondary': return 'var(--val-secondary, #64748b)';
    case 'success': return 'var(--val-success, #28a745)';
    case 'danger': return 'var(--val-danger, #e74c3c)';
    case 'warning': return 'var(--val-warning, #f1c40f)';
    case 'info': return 'var(--val-info, #3498db)';
    case 'muted': return '#94a3b8';
    case 'light': return '#f8fafc';
    case 'dark': return '#0f172a';
    case 'white': return '#ffffff';
    case 'inherit': return 'currentColor';
    default: return c || 'currentColor';
  }
});

const transformStyle = computed<string>(() => {
  if (props.rotate && !props.spin) {
    return `rotate(${props.rotate}deg)`;
  }
  return '';
});

const rawSvgHtml = computed<string>(() => {
  const def = activeIconDef.value;
  const rawPaths = (isFilled.value && def.fillPaths) ? def.fillPaths : def.paths;
  const fill = resolvedFill.value;
  const stroke = resolvedStroke.value;
  const strokeWidth = resolvedStrokeWidth.value;
  const width = dimension.value;
  const height = dimension.value;
  const color = resolvedColor.value;
  const transform = transformStyle.value;
  const spinClass = props.spin ? ' val-icon-spin' : '';

  const styleStr = `width:${width};height:${height};color:${color};${transform ? `transform:${transform};` : ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" style="${styleStr}" class="val-icon-svg${spinClass}">${rawPaths}</svg>`;
});
</script>

<template>
  <span class="val-icon" v-html="rawSvgHtml" />
</template>

<style lang="scss">
.val-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 0;
  flex-shrink: 0;
}

.val-icon-svg {
  display: block;
  transition: color 0.15s ease, transform 0.15s ease;
}

.val-icon-spin {
  animation: valIconSpin 1s linear infinite;
}

@keyframes valIconSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
