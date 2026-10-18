import { ref, type Component } from 'vue';
import type { DynamicDialogConfig, DynamicDialogInstance } from '../components/dynamic-dialog/dynamic-dialog.types';

const activeDialogs = ref<DynamicDialogInstance[]>([]);
let nextId = 0;

export interface DynamicDialogRef<R = any> {
  close: (result?: R) => void;
  onClose: (callback: (result?: R) => void) => void;
}

export function useDynamicDialog() {
  function open<R = any>(
    component: Component,
    config: DynamicDialogConfig = {}
  ): DynamicDialogRef<R> {
    const id = `dialog-${nextId++}`;
    const closeCallbacks: ((result?: R) => void)[] = [];

    const close = (result?: R) => {
      activeDialogs.value = activeDialogs.value.filter(d => d.id !== id);
      closeCallbacks.forEach(cb => cb(result));
    };

    const instance: DynamicDialogInstance = {
      id,
      component,
      config: {
        closable: true,
        maximizable: false,
        dismissableMask: false,
        closeOnEscape: true,
        width: '500px',
        ...config
      },
      isMaximized: false,
      close
    };

    activeDialogs.value.push(instance);

    return {
      close,
      onClose: (cb: (result?: R) => void) => {
        closeCallbacks.push(cb);
      }
    };
  }

  return {
    open,
    activeDialogs
  };
}
