import type { Directive, DirectiveBinding } from 'vue';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipValue {
  text?: string;
  position?: TooltipPosition;
  delay?: number;
}

interface TooltipElement extends HTMLElement {
  _valTooltipEl?: HTMLElement | null;
  _valTooltipEnter?: () => void;
  _valTooltipLeave?: () => void;
  _valTooltipTimeout?: number | null;
}

function getPosition(binding: DirectiveBinding<string | TooltipValue>): TooltipPosition {
  if (binding.modifiers.bottom) return 'bottom';
  if (binding.modifiers.left) return 'left';
  if (binding.modifiers.right) return 'right';
  if (typeof binding.value === 'object' && binding.value?.position) {
    return binding.value.position;
  }
  return 'top';
}

function getText(binding: DirectiveBinding<string | TooltipValue>): string {
  if (typeof binding.value === 'string') return binding.value;
  if (typeof binding.value === 'object' && binding.value?.text) return binding.value.text;
  return '';
}

function getDelay(binding: DirectiveBinding<string | TooltipValue>): number {
  if (typeof binding.value === 'object' && typeof binding.value?.delay === 'number') {
    return binding.value.delay;
  }
  return 150;
}

function createTooltip(el: TooltipElement, text: string, position: TooltipPosition) {
  if (el._valTooltipEl) return;

  const tooltip = document.createElement('div');
  tooltip.className = `val-tooltip-directive val-tooltip--${position}`;
  tooltip.textContent = text;
  tooltip.setAttribute('role', 'tooltip');

  const arrow = document.createElement('span');
  arrow.className = 'val-tooltip__arrow';
  tooltip.appendChild(arrow);

  document.body.appendChild(tooltip);
  el._valTooltipEl = tooltip;

  // Calculate coordinates relative to viewport
  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let top = 0;
  let left = 0;

  switch (position) {
    case 'top':
      top = rect.top + scrollY - tooltip.offsetHeight - 8;
      left = rect.left + scrollX + (rect.width - tooltip.offsetWidth) / 2;
      break;
    case 'bottom':
      top = rect.bottom + scrollY + 8;
      left = rect.left + scrollX + (rect.width - tooltip.offsetWidth) / 2;
      break;
    case 'left':
      top = rect.top + scrollY + (rect.height - tooltip.offsetHeight) / 2;
      left = rect.left + scrollX - tooltip.offsetWidth - 8;
      break;
    case 'right':
      top = rect.top + scrollY + (rect.height - tooltip.offsetHeight) / 2;
      left = rect.right + scrollX + 8;
      break;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.opacity = '1';
  tooltip.style.transform = 'scale(1)';
}

function removeTooltip(el: TooltipElement) {
  if (el._valTooltipTimeout) {
    clearTimeout(el._valTooltipTimeout);
    el._valTooltipTimeout = null;
  }
  if (el._valTooltipEl) {
    el._valTooltipEl.remove();
    el._valTooltipEl = null;
  }
}

export const vTooltip: Directive<TooltipElement, string | TooltipValue> = {
  mounted(el, binding) {
    const text = getText(binding);
    if (!text) return;

    const delay = getDelay(binding);

    el._valTooltipEnter = () => {
      el._valTooltipTimeout = window.setTimeout(() => {
        createTooltip(el, getText(binding), getPosition(binding));
      }, delay);
    };

    el._valTooltipLeave = () => {
      removeTooltip(el);
    };

    el.addEventListener('mouseenter', el._valTooltipEnter);
    el.addEventListener('mouseleave', el._valTooltipLeave);
    el.addEventListener('focusin', el._valTooltipEnter);
    el.addEventListener('focusout', el._valTooltipLeave);
  },

  updated(el, binding) {
    const text = getText(binding);
    if (el._valTooltipEl && text) {
      el._valTooltipEl.firstChild!.textContent = text;
    }
  },

  unmounted(el) {
    removeTooltip(el);
    if (el._valTooltipEnter) {
      el.removeEventListener('mouseenter', el._valTooltipEnter);
      el.removeEventListener('focusin', el._valTooltipEnter);
    }
    if (el._valTooltipLeave) {
      el.removeEventListener('mouseleave', el._valTooltipLeave);
      el.removeEventListener('focusout', el._valTooltipLeave);
    }
  }
};
