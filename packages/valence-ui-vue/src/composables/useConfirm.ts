import { ref } from 'vue';
import type { ButtonVariant } from '../types';

export interface ConfirmationOptions {
  header?: string;
  message?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptVariant?: ButtonVariant;
  rejectVariant?: ButtonVariant;
  key?: string;
  accept?: () => void;
  reject?: () => void;
}

export interface ActiveConfirmation extends ConfirmationOptions {
  id: number;
  resolve?: (value: boolean) => void;
}

const currentConfirmation = ref<ActiveConfirmation | null>(null);
let confirmationCounter = 0;

export function useConfirm() {
  function require(options: ConfirmationOptions) {
    currentConfirmation.value = {
      ...options,
      id: ++confirmationCounter
    };
  }

  function confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      currentConfirmation.value = {
        ...options,
        id: ++confirmationCounter,
        resolve
      };
    });
  }

  function close() {
    if (currentConfirmation.value?.resolve) {
      currentConfirmation.value.resolve(false);
    }
    currentConfirmation.value = null;
  }

  return {
    currentConfirmation,
    require,
    confirm,
    close
  };
}
