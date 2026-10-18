export type ValenceSize = 'sm' | 'md' | 'lg';

export type ValenceSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'primary';

export type ValenceColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export type ButtonVariantPrefix = 'outline' | 'ghost';

export type ButtonVariant = ValenceColor | `${ButtonVariantPrefix}-${ValenceColor}`;

export type ValencePosition = 'left' | 'right' | 'top' | 'bottom';
