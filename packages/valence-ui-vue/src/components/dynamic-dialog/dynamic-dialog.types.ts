import type { Component } from 'vue';

export interface DynamicDialogConfig<T = any> {
  data?: T;
  header?: string;
  width?: string;
  height?: string;
  closable?: boolean;
  maximizable?: boolean;
  dismissableMask?: boolean;
  closeOnEscape?: boolean;
  styleClass?: string;
  contentStyle?: Record<string, string>;
}

export interface DynamicDialogInstance {
  id: string;
  component: Component;
  config: DynamicDialogConfig;
  isMaximized: boolean;
  close: (result?: any) => void;
}
