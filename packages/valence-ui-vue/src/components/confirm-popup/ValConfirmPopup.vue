<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ValButton from '../button/ValButton.vue';
import ValIcon from '../icon/ValIcon.vue';
import type { ButtonVariant } from '../../types';

export interface ConfirmPopupProps {
  message?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptVariant?: ButtonVariant;
}

withDefaults(defineProps<ConfirmPopupProps>(), {
  message: 'Are you sure you want to proceed?',
  icon: 'alert-triangle',
  acceptLabel: 'Yes',
  rejectLabel: 'No',
  acceptVariant: 'primary'
});

const emit = defineEmits<{
  (e: 'accept'): void;
  (e: 'reject'): void;
}>();

const isOpen = ref(false);
const targetRef = ref<HTMLElement | null>(null);

function toggle() {
  if (isOpen.value) {
    reject();
  } else {
    open();
  }
}

function open() {
  isOpen.value = true;
}

function accept() {
  isOpen.value = false;
  emit('accept');
}

function reject() {
  if (isOpen.value) {
    isOpen.value = false;
    emit('reject');
  }
}

function onDocumentClick(event: MouseEvent) {
  if (isOpen.value && targetRef.value && !targetRef.value.contains(event.target as Node)) {
    reject();
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
  <div ref="targetRef" class="val-confirm-popup-wrapper" style="display: inline-block; position: relative;">
    <div class="val-confirm-popup-target" @click="toggle">
      <slot />
    </div>

    <!-- Popup Overlay -->
    <transition name="val-popup-fade">
      <div v-if="isOpen" class="val-confirm-popup-panel val-elevation-3" @click.stop>
        <div class="val-confirm-popup-header">
          <span class="val-confirm-popup-icon">
            <ValIcon :name="icon" size="md" color="warning" />
          </span>
          <span class="val-confirm-popup-message">{{ message }}</span>
        </div>
        <div class="val-confirm-popup-footer">
          <ValButton size="sm" variant="ghost-secondary" @click="reject">
            {{ rejectLabel }}
          </ValButton>
          <ValButton size="sm" :variant="acceptVariant" @click="accept">
            {{ acceptLabel }}
          </ValButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/confirm-popup/confirm-popup.component.scss';

.val-confirm-popup-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1100;
  min-width: 280px;
}
</style>
