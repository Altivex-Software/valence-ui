<script setup lang="ts">
import { computed } from 'vue';
import ValDialog from '../dialog/ValDialog.vue';
import ValButton from '../button/ValButton.vue';
import { useConfirm, type ConfirmationOptions } from '../../composables/useConfirm';

export interface ConfirmDialogProps {
  key?: string;
  keyName?: string;
  width?: string;
  // Optional controlled props
  visible?: boolean;
  confirmation?: ConfirmationOptions | null;
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  key: undefined,
  keyName: undefined,
  width: '420px',
  visible: undefined,
  confirmation: null
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'accept'): void;
  (e: 'reject'): void;
}>();

const { currentConfirmation } = useConfirm();

const activeConfig = computed(() => {
  if (props.confirmation) return props.confirmation;
  if (!currentConfirmation.value) return null;
  const matchKey = props.key || props.keyName;
  if (matchKey && currentConfirmation.value.key !== matchKey) return null;
  return currentConfirmation.value;
});

const isVisible = computed({
  get: () => {
    if (props.visible !== undefined) return props.visible;
    return !!activeConfig.value;
  },
  set: (val: boolean) => {
    emit('update:visible', val);
    if (!val && currentConfirmation.value) {
      if (currentConfirmation.value.resolve) {
        currentConfirmation.value.resolve(false);
      }
      currentConfirmation.value = null;
    }
  }
});

function handleAccept() {
  if (activeConfig.value?.accept) {
    activeConfig.value.accept();
  }
  if (currentConfirmation.value?.resolve) {
    currentConfirmation.value.resolve(true);
  }
  emit('accept');
  currentConfirmation.value = null;
  emit('update:visible', false);
}

function handleReject() {
  if (activeConfig.value?.reject) {
    activeConfig.value.reject();
  }
  if (currentConfirmation.value?.resolve) {
    currentConfirmation.value.resolve(false);
  }
  emit('reject');
  currentConfirmation.value = null;
  emit('update:visible', false);
}
</script>

<template>
  <ValDialog
    v-model:visible="isVisible"
    :header="activeConfig?.header || 'Confirmar'"
    :width="width"
    :modal="true"
    :dismissable-mask="false"
  >
    <div class="val-confirm-content">
      <div v-if="activeConfig?.icon || true" class="val-confirm-icon-wrapper">
        <svg
          class="val-confirm-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div class="val-confirm-message">
        {{ activeConfig?.message || '¿Está seguro de continuar?' }}
      </div>
    </div>

    <template #footer>
      <div class="val-flex val-justify-content-end val-gap-2">
        <ValButton
          :variant="activeConfig?.rejectVariant || 'outline-primary'"
          size="sm"
          @click="handleReject"
        >
          {{ activeConfig?.rejectLabel || 'Cancelar' }}
        </ValButton>

        <ValButton
          :variant="activeConfig?.acceptVariant || 'primary'"
          size="sm"
          @click="handleAccept"
        >
          {{ activeConfig?.acceptLabel || 'Confirmar' }}
        </ValButton>
      </div>
    </template>
  </ValDialog>
</template>

<style lang="scss" scoped>
.val-confirm-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
}

.val-confirm-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background-color: rgba(245, 158, 11, 0.12);
  color: var(--val-warning, #f59e0b);
  flex-shrink: 0;
}

.val-confirm-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.val-confirm-message {
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.5;
  flex: 1;
}
</style>
