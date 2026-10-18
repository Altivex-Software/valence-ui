import { ref, readonly } from 'vue';

export type ToastSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'error'
  | 'warning'
  | 'warn'
  | 'info';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

export type ToastVariant = 'standard' | 'filled' | 'outlined';

export interface ToastMessage {
  id?: number;
  severity?: ToastSeverity;
  summary?: string;
  detail?: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
  variant?: ToastVariant;
  data?: unknown;
}

const messagesState = ref<ToastMessage[]>([]);
const positionState = ref<ToastPosition>('top-right');

export function useToast() {
  function setPosition(position: ToastPosition) {
    positionState.value = position;
  }

  function add(message: ToastMessage) {
    const id = message.id ?? Date.now() + Math.random();
    const newMessage: ToastMessage = {
      ...message,
      id,
      severity: message.severity ?? 'info',
      life: message.life ?? 3000,
      closable: message.closable ?? true,
      variant: message.variant ?? 'standard'
    };

    messagesState.value.push(newMessage);

    if (!newMessage.sticky && newMessage.life && newMessage.life > 0) {
      setTimeout(() => {
        remove(id);
      }, newMessage.life);
    }

    return id;
  }

  function remove(id: number) {
    messagesState.value = messagesState.value.filter((m) => m.id !== id);
  }

  function clear() {
    messagesState.value = [];
  }

  return {
    messages: readonly(messagesState),
    position: readonly(positionState),
    setPosition,
    add,
    remove,
    clear
  };
}
