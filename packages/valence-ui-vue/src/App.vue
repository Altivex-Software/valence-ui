<script setup lang="ts">
import { ref } from 'vue';
import ValButton from './components/button/ValButton.vue';
import ValCard from './components/card/ValCard.vue';
import ValBadge from './components/badge/ValBadge.vue';
import ValInput from './components/input/ValInput.vue';
import ValDialog from './components/dialog/ValDialog.vue';
import ValCheckbox from './components/checkbox/ValCheckbox.vue';
import ValSwitch from './components/switch/ValSwitch.vue';
import ValPassword from './components/input/ValPassword.vue';
import ValTextarea from './components/input/ValTextarea.vue';
import ValDropdown, { type DropdownOption } from './components/dropdown/ValDropdown.vue';
import ValToast from './components/toast/ValToast.vue';
import ValTabs from './components/tabs/ValTabs.vue';
import ValTab from './components/tabs/ValTab.vue';
import ValAccordion from './components/accordion/ValAccordion.vue';
import ValAccordionItem from './components/accordion/ValAccordionItem.vue';
import ValTable, { type TableColumn } from './components/table/ValTable.vue';
import ValDivider from './components/divider/ValDivider.vue';
import ValTag from './components/tag/ValTag.vue';
import ValProgressBar from './components/progress-bar/ValProgressBar.vue';
import ValBreadcrumb, { type BreadcrumbItem } from './components/breadcrumb/ValBreadcrumb.vue';
import ValStepper from './components/stepper/ValStepper.vue';
import ValStep from './components/stepper/ValStep.vue';
import ValSidebar from './components/sidebar/ValSidebar.vue';
import ValSkeleton from './components/skeleton/ValSkeleton.vue';
import ValTimeline, { type TimelineItem } from './components/timeline/ValTimeline.vue';
import ValToolbar from './components/toolbar/ValToolbar.vue';
import ValRadio from './components/radio/ValRadio.vue';
import ValRadioGroup, { type RadioOption } from './components/radio/ValRadioGroup.vue';
import ValSelectButton from './components/select-button/ValSelectButton.vue';
import ValSlider from './components/input/ValSlider.vue';
import ValRating from './components/input/ValRating.vue';
import ValChips from './components/chips/ValChips.vue';
import ValOtp from './components/input/ValOtp.vue';
import ValDatePicker from './components/date-picker/ValDatePicker.vue';
import ValAlert from './components/alert/ValAlert.vue';
import ValProgressSpinner from './components/progress-spinner/ValProgressSpinner.vue';
import ValTooltip from './components/tooltip/ValTooltip.vue';
import ValPopover from './components/popover/ValPopover.vue';
import ValConfirmDialog from './components/confirm/ValConfirmDialog.vue';
import ValBlockUI from './components/block-ui/ValBlockUI.vue';
import ValPaginator, { type PageChangeEvent } from './components/paginator/ValPaginator.vue';
import ValTree from './components/tree/ValTree.vue';
import ValTreeSelect from './components/tree/ValTreeSelect.vue';
import ValTreeTable, { type TreeTableColumn } from './components/tree/ValTreeTable.vue';
import ValSplitter from './components/splitter/ValSplitter.vue';
import ValFileUpload from './components/file-upload/ValFileUpload.vue';
import ValCarousel from './components/carousel/ValCarousel.vue';
import ValGalleria, { type GalleriaItem } from './components/galleria/ValGalleria.vue';
import ValMenubar, { type MenuItem } from './components/menubar/ValMenubar.vue';
import ValMegaMenu, { type MegaMenuItem } from './components/mega-menu/ValMegaMenu.vue';
import ValPanelMenu, { type PanelMenuItem } from './components/panel-menu/ValPanelMenu.vue';
import ValContextMenu, { type ContextMenuItem } from './components/context-menu/ValContextMenu.vue';
import ValSpeedDial, { type SpeedDialItem } from './components/speed-dial/ValSpeedDial.vue';
import ValPanel from './components/panel/ValPanel.vue';
import ValFieldset from './components/fieldset/ValFieldset.vue';
import ValImage from './components/image/ValImage.vue';
import ValAutoComplete from './components/auto-complete/ValAutoComplete.vue';
import ValInputMask from './components/input-mask/ValInputMask.vue';
import ValIcon from './components/icon/ValIcon.vue';
import ValFormField from './components/form-field/ValFormField.vue';
import ValFormFieldLabel from './components/form-field/ValFormFieldLabel.vue';
import ValFormFieldHint from './components/form-field/ValFormFieldHint.vue';
import ValFormFieldError from './components/form-field/ValFormFieldError.vue';
import ValMultiSelect from './components/multi-select/ValMultiSelect.vue';
import ValKnob from './components/input/ValKnob.vue';
import ValDateInput from './components/input/ValDateInput.vue';
import ValToggleButton from './components/select-button/ValToggleButton.vue';
import ValConfirmPopup from './components/confirm-popup/ValConfirmPopup.vue';
import ValDynamicDialog from './components/dynamic-dialog/ValDynamicDialog.vue';
import type { TreeNode } from './components/tree/tree.types';
import { useToast } from './composables/useToast';
import { useConfirm } from './composables/useConfirm';
import { useDynamicDialog } from './composables/useDynamicDialog';

// Parity Showcase state
const selectedMulti = ref(['vue', 'vite']);
const multiOptions = [
  { label: 'Vue 3 Core', value: 'vue' },
  { label: 'Vite 6 Fast Bundler', value: 'vite' },
  { label: 'TypeScript Strict', value: 'ts' },
  { label: 'Sass Styling Engine', value: 'sass' },
  { label: 'Valence UI Design System', value: 'val' }
];
const knobValue = ref(72);
const birthDate = ref('1998-05-14');
const toggleActive = ref(true);
const formFieldText = ref('valence.dev');
const dynamicDialog = useDynamicDialog();

function openDynamicModal() {
  dynamicDialog.open({
    header: 'Diálogo Dinámico (useDynamicDialog)',
    message: 'Este modal ha sido abierto programáticamente desde cualquier punto de la app con el composable useDynamicDialog(), con paridad al DynamicDialogService de Angular.',
    width: '480px'
  });
}

// Phase 1 state
const username = ref('Sebastian');
const showModal = ref(false);
const counter = ref(0);

// Phase 2 state
const checkTerms = ref(true);
const switchActive = ref(true);
const password = ref('Valence2026!');
const comments = ref('¡Valence UI en Vue 3 funciona de maravilla! Soporte para auto-resize y composición limpia.');

const frameworks: DropdownOption[] = [
  { label: 'Vue 3 (Composition API)', value: 'vue' },
  { label: 'Angular 18+ (Signals)', value: 'angular' },
  { label: 'React 19 (Hooks)', value: 'react' },
  { label: 'Svelte 5 (Runes)', value: 'svelte' },
  { label: 'SolidJS', value: 'solid', disabled: true }
];
const selectedFramework = ref('vue');

// Phase 3 state
const activeTab = ref(0);
const accordionActive = ref<string | string[] | null>('item-1');
const progressValue = ref(78);
const removableTags = ref(['Vue 3', 'TypeScript', 'Sass', 'Vite']);

function removeTag(tag: string) {
  removableTags.value = removableTags.value.filter((t) => t !== tag);
}

// Phase 4 state
const showSidebar = ref(false);
const currentStep = ref(0);
const stepperRef = ref<InstanceType<typeof ValStepper> | null>(null);

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Inicio', url: '#' },
  { label: 'Plataforma', url: '#' },
  { label: 'Valence UI Vue', url: '#' },
  { label: 'Fase 8 (100% Paridad)' }
];

const timelineEvents: TimelineItem[] = [
  {
    status: 'Proyecto Inicializado',
    date: '10:00 AM',
    color: '#0066ff',
    description: 'Vite 6 + Vue 3 + TypeScript configurado con tokens Valence.'
  },
  {
    status: 'Fases 1, 2 y 3 Completadas',
    date: '02:30 PM',
    color: '#22c55e',
    description: '19 componentes validados y compilados sin errores.'
  },
  {
    status: 'Fase 4 & 5 Activas',
    date: '05:30 PM',
    color: '#f59e0b',
    description: '26 componentes nativos listos con cobertura completa.'
  }
];

// Phase 5 state
const selectedPayment = ref('stripe');
const paymentOptions: RadioOption[] = [
  { label: 'Stripe Checkout', value: 'stripe' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Cripto / Web3', value: 'crypto', disabled: true }
];

const billingCycle = ref('annual');
const billingOptions = [
  { label: 'Mensual', value: 'monthly' },
  { label: 'Anual (20% OFF)', value: 'annual' },
  { label: 'Vitalicio', value: 'lifetime' }
];

const sliderValue = ref(45);
const ratingValue = ref(4);
const tagsValue = ref(['Frontend', 'SaaS', 'Design System']);
const otpCode = ref('849201');
const pickedDate = ref('2026-10-15');

// Table data
interface UserRow {
  id: number;
  name: string;
  role: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  progress: number;
}

const tableColumns: TableColumn[] = [
  { field: 'id', header: 'ID', sortable: true, width: '60px' },
  { field: 'name', header: 'Usuario', sortable: true },
  { field: 'role', header: 'Rol', sortable: true },
  { field: 'status', header: 'Estado', sortable: true },
  { field: 'progress', header: 'Progreso', sortable: true }
];

const usersData = ref<UserRow[]>([
  { id: 1, name: 'Sebastian Altivex', role: 'Lead Architect', status: 'Activo', progress: 95 },
  { id: 2, name: 'Elena Rostova', role: 'Senior Frontend', status: 'Activo', progress: 85 },
  { id: 3, name: 'Carlos Mendez', role: 'UI/UX Designer', status: 'Pendiente', progress: 50 },
  { id: 4, name: 'Maria Gomez', role: 'DevOps Engineer', status: 'Inactivo', progress: 20 },
  { id: 5, name: 'David Kim', role: 'QA Automation', status: 'Activo', progress: 75 }
]);

const tableSelection = ref<UserRow | null>(null);
const tableFilter = ref('');
const tableRef = ref<InstanceType<typeof ValTable> | null>(null);

// Toast
const toast = useToast();

function triggerToast(severity: 'success' | 'info' | 'warning' | 'danger', variant: 'standard' | 'filled' | 'outlined' = 'standard') {
  toast.add({
    severity,
    variant,
    summary: severity === 'success' ? '¡Operación Exitosa!' : severity === 'danger' ? 'Error Detectado' : severity === 'warning' ? 'Advertencia' : 'Información',
    detail: `Notificación ${severity} disparada desde useToast().`,
    life: 3000
  });
}

// Phase 6 state & handlers
const confirm = useConfirm();
const isCardBlocked = ref(false);
const showAlertBox = ref(true);

function handleConfirmDemo() {
  confirm.require({
    header: 'Confirmar Eliminación',
    message: '¿Está seguro de que desea eliminar permanentemente este registro del sistema?',
    acceptLabel: 'Sí, Eliminar',
    rejectLabel: 'Cancelar',
    acceptVariant: 'primary',
    rejectVariant: 'outline-secondary',
    accept: () => {
      triggerToast('success', 'filled');
    },
    reject: () => {
      triggerToast('info', 'standard');
    }
  });
}

function simulateBlockUI() {
  isCardBlocked.value = true;
  setTimeout(() => {
    isCardBlocked.value = false;
    triggerToast('success', 'standard');
  }, 2200);
}

// Phase 7 state
const paginatorPage = ref(0);
const paginatorRows = ref(10);
const paginatorTotal = ref(120);

function handlePageChange(event: PageChangeEvent) {
  paginatorPage.value = event.page;
  paginatorRows.value = event.rows;
  triggerToast('info', 'standard');
}

const selectedTreeKeys = ref<string[]>(['src', 'components']);
const selectedTreeSelectKey = ref<string>('app-vue');
const fileTreeData = ref<TreeNode[]>([
  {
    key: 'src',
    label: 'src',
    expanded: true,
    children: [
      {
        key: 'components',
        label: 'components',
        expanded: true,
        children: [
          { key: 'btn', label: 'ValButton.vue', leaf: true },
          { key: 'card', label: 'ValCard.vue', leaf: true },
          { key: 'tree', label: 'ValTree.vue', leaf: true }
        ]
      },
      {
        key: 'composables',
        label: 'composables',
        expanded: false,
        children: [
          { key: 'useToast', label: 'useToast.ts', leaf: true },
          { key: 'useConfirm', label: 'useConfirm.ts', leaf: true }
        ]
      },
      { key: 'app-vue', label: 'App.vue', leaf: true },
      { key: 'main-ts', label: 'main.ts', leaf: true }
    ]
  },
  {
    key: 'public',
    label: 'public',
    expanded: false,
    children: [
      { key: 'favicon', label: 'favicon.ico', leaf: true },
      { key: 'robots', label: 'robots.txt', leaf: true }
    ]
  },
  { key: 'pkg', label: 'package.json', leaf: true }
]);

const treeTableColumns: TreeTableColumn[] = [
  { field: 'name', header: 'Nombre', expando: true, width: '40%' },
  { field: 'size', header: 'Tamaño', width: '20%' },
  { field: 'type', header: 'Tipo', width: '20%' },
  { field: 'updated', header: 'Modificado', width: '20%' }
];

const treeTableData = ref<TreeNode[]>([
  {
    key: 'docs',
    label: 'Documentos',
    expanded: true,
    data: { name: 'Documentos', size: '1.2 MB', type: 'Carpeta', updated: 'Hoy 10:30' },
    children: [
      { key: 'spec', label: 'especificaciones.pdf', leaf: true, data: { name: 'especificaciones.pdf', size: '850 KB', type: 'PDF', updated: 'Ayer' } },
      { key: 'arch', label: 'arquitectura.png', leaf: true, data: { name: 'arquitectura.png', size: '350 KB', type: 'Imagen', updated: 'Hace 2 días' } }
    ]
  },
  {
    key: 'projs',
    label: 'Proyectos',
    expanded: true,
    data: { name: 'Proyectos', size: '14.5 MB', type: 'Carpeta', updated: 'Hace 1h' },
    children: [
      { key: 'vue-app', label: 'valence-ui-vue', leaf: true, data: { name: 'valence-ui-vue', size: '8.2 MB', type: 'Módulo ESM', updated: 'Justo ahora' } },
      { key: 'ng-app', label: 'valence-ui', leaf: true, data: { name: 'valence-ui', size: '6.3 MB', type: 'Angular Lib', updated: 'Hoy 09:00' } }
    ]
  }
]);

const carouselItems = ref([
  { title: 'Velocidad Máxima', subtitle: 'Vite 6 + Composition API', color: '#3b82f6', icon: '⚡' },
  { title: 'Tipado Riguroso', subtitle: 'TypeScript estricto con .d.ts', color: '#10b981', icon: '🛡️' },
  { title: 'Fidelidad Visual', subtitle: 'Paridad 1:1 con tokens SCSS', color: '#8b5cf6', icon: '🎨' },
  { title: 'Diseño Enterprise', subtitle: '54 componentes listos para producción', color: '#f59e0b', icon: '🚀' }
]);

const galleriaImages = ref<GalleriaItem[]>([
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    alt: 'Diseño abstracto minimalista azul y esmeralda',
    title: 'Arquitectura Valence 2026'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    alt: 'Colores vibrantes en gradiente digital',
    title: 'Tokens de Color Dinámicos'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    alt: 'Hardware retro con estética futurista',
    title: 'Rendimiento y Optimización'
  }
]);

// Phase 8 state
const contextMenuRef = ref<InstanceType<typeof ValContextMenu> | null>(null);

const menubarItems: MenuItem[] = [
  {
    label: 'Archivo',
    icon: '📁',
    items: [
      { label: 'Nuevo Proyecto', icon: '✨' },
      { label: 'Abrir Reciente...', icon: '📂' },
      { separator: true },
      { label: 'Exportar Bundle', icon: '📦' }
    ]
  },
  {
    label: 'Editar',
    icon: '✏️',
    items: [
      { label: 'Deshacer (Ctrl+Z)' },
      { label: 'Rehacer (Ctrl+Y)' },
      { separator: true },
      { label: 'Preferencias' }
    ]
  },
  {
    label: 'Ver',
    icon: '👁️',
    items: [
      { label: 'Pantalla Completa' },
      { label: 'Modo Oscuro' }
    ]
  },
  {
    label: 'Ayuda',
    icon: '❓',
    items: [
      { label: 'Documentación Oficial' },
      { label: 'Acerca de Valence UI' }
    ]
  }
];

const megaMenuItems: MegaMenuItem[] = [
  {
    label: 'Ecosistema Valence',
    icon: '⚡',
    columns: [
      {
        title: 'Frameworks',
        items: [
          { label: 'Vue 3 (Composition API)', icon: '🟢' },
          { label: 'Angular 18+ (Signals)', icon: '🔴' },
          { label: 'React 19 (Hooks)', icon: '🔵' }
        ]
      },
      {
        title: 'Herramientas',
        items: [
          { label: 'Vite 6 Bundler', icon: '⚡' },
          { label: 'Sass Core Engine', icon: '🎨' },
          { label: 'TypeScript Strict', icon: '🛡️' }
        ]
      }
    ]
  },
  {
    label: 'Recursos',
    icon: '📚',
    columns: [
      {
        title: 'Documentación',
        items: [
          { label: 'Guía de Inicio Rápido' },
          { label: 'Tokens de Diseño' },
          { label: 'Changelog' }
        ]
      }
    ]
  }
];

const panelMenuItems: PanelMenuItem[] = [
  {
    label: 'Panel de Control',
    icon: '📊',
    expanded: true,
    items: [
      { label: 'Métricas de Rendimiento', icon: '📈' },
      { label: 'Monitoreo de APIs', icon: '🌐', badge: 'En vivo', badgeSeverity: 'success' }
    ]
  },
  {
    label: 'Facturación & Planes',
    icon: '💳',
    expanded: false,
    items: [
      { label: 'Historial de Pagos' },
      { label: 'Cambiar a Plan Enterprise', badge: 'PRO' }
    ]
  },
  {
    label: 'Configuración Global',
    icon: '⚙️',
    expanded: false,
    items: [
      { label: 'Seguridad y 2FA' },
      { label: 'Tokens de API' }
    ]
  }
];

const contextMenuItems: ContextMenuItem[] = [
  { label: 'Copiar Registro', icon: '📋' },
  { label: 'Pegar', icon: '📄' },
  { separator: true },
  { label: 'Inspeccionar Elemento', icon: '🔍' },
  { label: 'Eliminar Elemento', icon: '🗑️', danger: true }
];

const speedDialItems: SpeedDialItem[] = [
  { icon: '➕', label: 'Nuevo', tooltip: 'Crear nuevo registro' },
  { icon: '💾', label: 'Guardar', tooltip: 'Guardar cambios' },
  { icon: '📤', label: 'Exportar', tooltip: 'Exportar datos' },
  { icon: '🗑️', label: 'Eliminar', tooltip: 'Eliminar elemento' }
];

const techCatalog = [
  'Vue 3', 'TypeScript', 'Vite', 'Sass', 'Angular', 'React', 'Pinia', 'Tailwind', 'Node.js', 'Docker', 'GraphQL'
];
const autoCompleteValue = ref('Vue 3');
const autoCompleteSuggestions = ref<string[]>(techCatalog);

function handleAutoComplete(e: { query: string }) {
  if (!e.query) {
    autoCompleteSuggestions.value = techCatalog;
  } else {
    autoCompleteSuggestions.value = techCatalog.filter(t =>
      t.toLowerCase().includes(e.query.toLowerCase())
    );
  }
}

const maskedPhone = ref('5512345678');
const maskedDate = ref('12102026');
</script>

<template>
  <div class="demo-page">
    <ValToast />
    <ValConfirmDialog />
    <ValDynamicDialog />
    <ValContextMenu ref="contextMenuRef" :model="contextMenuItems" />

    <!-- Sidebar Drawer Component (Fase 4) -->
    <ValSidebar
      v-model="showSidebar"
      position="right"
      header="Panel de Configuración Lateral"
    >
      <div class="val-flex val-flex-column val-gap-3">
        <p class="val-text-sm val-text-secondary val-m-0">
          Este panel deslizante es el componente <code>ValSidebar</code> de la Fase 4 con fondo difuminado.
        </p>

        <ValDivider />

        <div>
          <label class="val-text-xs val-font-bold val-text-secondary val-mb-2 val-block">Preferencias de Usuario</label>
          <div class="val-flex val-flex-column val-gap-2">
            <ValSwitch v-model="switchActive" label="Habilitar Modo Turbo" color="primary" />
            <ValCheckbox v-model="checkTerms" label="Guardar historial local" color="success" />
          </div>
        </div>

        <ValDivider />

        <div class="val-flex val-justify-content-end">
          <ValButton variant="primary" size="sm" @click="showSidebar = false">
            Guardar Cambios
          </ValButton>
        </div>
      </div>
    </ValSidebar>

    <div class="demo-container">
      <!-- Menubar Component (Fase 8) -->
      <ValMenubar :model="menubarItems" class="val-mb-3" />

      <!-- Toolbar Component (Fase 4) -->
      <ValToolbar color="surface" :shadow="true" class="val-mb-4">
        <template #left>
          <div class="val-flex val-align-items-center val-gap-2">
            <span class="val-font-bold val-text-lg val-text-primary">Valence UI</span>
            <ValBadge severity="primary" size="sm">Vue 3.5</ValBadge>
            <ValBadge severity="success" size="sm">Fase 8 (100% Paridad)</ValBadge>
          </div>
        </template>

        <template #default>
          <ValBreadcrumb :items="breadcrumbs" />
        </template>

        <template #right>
          <div class="val-flex val-gap-2">
            <ValButton variant="outline-primary" size="sm" @click="showSidebar = true">
              Abrir Sidebar
            </ValButton>
            <ValButton variant="primary" size="sm" @click="triggerToast('success', 'filled')">
              Toast
            </ValButton>
          </div>
        </template>
      </ValToolbar>

      <!-- Grid Layout -->
      <div class="val-row val-g-4">
        <!-- FASE 8: Menús Avanzados (MegaMenu & PanelMenu) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">1. Menús Avanzados (MegaMenu & PanelMenu)</span>
                <ValBadge severity="primary" size="sm">Fase 8</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  MegaMenú con Columnas (ValMegaMenu):
                </label>
                <ValMegaMenu :model="megaMenuItems" />
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Menú Jerárquico Acordeón (ValPanelMenu):
                </label>
                <ValPanelMenu :model="panelMenuItems" />
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 8: ContextMenu & SpeedDial -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">2. Menú Contextual & Botón Flotante</span>
                <ValBadge severity="primary" size="sm">Fase 8</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Zona con Menú Contextual (ValContextMenu - Haz clic derecho):
                </label>
                <div
                  class="val-p-4 val-rounded val-border val-flex val-flex-column val-align-items-center val-justify-content-center"
                  style="border-style: dashed; border-color: #94a3b8; background: #f8fafc; cursor: context-menu; min-height: 120px;"
                  @contextmenu.prevent="contextMenuRef?.show($event)"
                >
                  <span class="val-text-xl val-mb-1">🖱️</span>
                  <span class="val-font-semibold val-text-sm val-text-primary">Haz clic derecho aquí</span>
                  <span class="val-text-xs val-text-muted">Despliega acciones contextuales del sistema</span>
                </div>
              </div>

              <div class="val-p-3 val-rounded val-border val-flex val-align-items-center val-justify-content-between" style="background: #f1f5f9; border-color: #cbd5e1;">
                <div>
                  <span class="val-font-bold val-text-xs val-text-primary">Botón de Acción Rápida (ValSpeedDial):</span>
                  <p class="val-text-xs val-text-muted val-m-0 val-mt-1">
                    Ubicado en la esquina inferior derecha fija de la pantalla.
                  </p>
                </div>
                <ValBadge severity="info" size="sm">Flotante</ValBadge>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 8: Estructura (ValPanel & ValFieldset) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">3. Paneles Colapsables (ValPanel & ValFieldset)</span>
                <ValBadge severity="primary" size="sm">Fase 8</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <ValPanel header="Panel Expandible de Configuración" :toggleable="true">
                <template #icons>
                  <ValBadge severity="success" size="sm">Activo</ValBadge>
                </template>
                <p class="val-text-xs val-text-secondary val-m-0">
                  <code>ValPanel</code> permite colapsar y expandir secciones de contenido complejas con cabeceras personalizadas y transiciones suaves.
                </p>
              </ValPanel>

              <ValFieldset legend="Grupo de Opciones (ValFieldset)" :toggleable="true">
                <p class="val-text-xs val-text-secondary val-m-0">
                  <code>ValFieldset</code> provee una agrupación semántica nativa con leyenda integrada y soporte para colapsar su contenido al hacer clic.
                </p>
              </ValFieldset>
            </div>
          </ValCard>
        </div>

        <!-- FASE 8: ValImage, ValAutoComplete & ValInputMask -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">4. Imagen Preview & Inputs Especiales</span>
                <ValBadge severity="primary" size="sm">Fase 8</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Visor de Imagen con Zoom & Rotación (ValImage - Haz clic para ampliar):
                </label>
                <div class="val-flex val-justify-content-center">
                  <ValImage
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
                    alt="Valence UI Demo"
                    width="100%"
                    height="110px"
                    :preview="true"
                    image-style="border-radius: 8px; object-fit: cover; width: 100%; height: 110px;"
                  />
                </div>
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Autocompletado con Búsqueda (ValAutoComplete):
                </label>
                <ValAutoComplete
                  v-model="autoCompleteValue"
                  :suggestions="autoCompleteSuggestions"
                  :dropdown="true"
                  placeholder="Busca una tecnología..."
                  @complete="handleAutoComplete"
                />
              </div>

              <div class="val-row val-g-2">
                <div class="val-col-6">
                  <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                    Teléfono (ValInputMask):
                  </label>
                  <ValInputMask
                    v-model="maskedPhone"
                    mask="(99) 9999-9999"
                    placeholder="(55) 1234-5678"
                  />
                </div>
                <div class="val-col-6">
                  <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                    Fecha (ValInputMask):
                  </label>
                  <ValInputMask
                    v-model="maskedDate"
                    mask="99/99/9999"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
              </div>
            </div>
          </ValCard>
        </div>
        <!-- FASE 7: Árbol Jerárquico & TreeSelect -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">1. Árbol Jerárquico (ValTree & ValTreeSelect)</span>
                <ValBadge severity="primary" size="sm">Fase 7</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Selector de Archivos Desplegable (ValTreeSelect):
                </label>
                <ValTreeSelect
                  v-model="selectedTreeSelectKey"
                  :options="fileTreeData"
                  placeholder="Selecciona un archivo del proyecto..."
                />
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Explorador de Archivos Jerárquico con Búsqueda (ValTree):
                </label>
                <ValTree
                  v-model:selected-keys="selectedTreeKeys"
                  :value="fileTreeData"
                  selection-mode="checkbox"
                  :filter="true"
                  filter-placeholder="Filtrar archivos o carpetas..."
                  :lines="true"
                  :scrollable="true"
                  scroll-height="240px"
                />
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 7: Tabla Jerárquica & Paginador -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">2. TreeTable & Paginador Independiente</span>
                <ValBadge severity="primary" size="sm">Fase 7</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <ValTreeTable
                :value="treeTableData"
                :columns="treeTableColumns"
                :bordered="true"
                :striped="true"
              />

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Paginador Reutilizable (ValPaginator):
                </label>
                <ValPaginator
                  v-model:page="paginatorPage"
                  v-model:rows="paginatorRows"
                  :total-records="paginatorTotal"
                  :rows-per-page-options="[5, 10, 20, 50]"
                  @page-change="handlePageChange"
                />
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 7: Divisor Redimensionable & File Upload -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">3. Splitter & Carga de Archivos (Drag & Drop)</span>
                <ValBadge severity="primary" size="sm">Fase 7</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div style="height: 240px;">
                <ValSplitter layout="horizontal" :initial-size="45">
                  <template #panel1>
                    <div class="val-p-3 val-h-100 val-bg-light" style="font-size: 0.8125rem;">
                      <strong class="val-text-primary">Panel Izquierdo</strong>
                      <p class="val-text-xs val-text-secondary val-mt-1">
                        Arrastra el separador vertical central para cambiar el ancho dinámicamente.
                      </p>
                    </div>
                  </template>

                  <template #panel2>
                    <div class="val-p-2 val-h-100">
                      <ValFileUpload
                        :multiple="true"
                        choose-label="Subir archivos"
                        accept=".png,.jpg,.pdf,.ts"
                        :max-file-size="5000000"
                        @select="triggerToast('success', 'filled')"
                      />
                    </div>
                  </template>
                </ValSplitter>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 7: Carrusel & Galería de Medios -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">4. Carrusel Animado & Galleria</span>
                <ValBadge severity="primary" size="sm">Fase 7</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <!-- Carousel -->
              <ValCarousel
                :value="carouselItems"
                :num-visible="2"
                :num-scroll="1"
                :circular="true"
                :autoplay-interval="3500"
              >
                <template #item="{ item }">
                  <div
                    class="val-p-3 val-rounded val-text-center"
                    :style="{ background: `${item.color}15`, border: `1px solid ${item.color}40` }"
                  >
                    <div style="font-size: 1.5rem;">{{ item.icon }}</div>
                    <div class="val-font-bold val-text-sm val-mt-1" :style="{ color: item.color }">{{ item.title }}</div>
                    <div class="val-text-xs val-text-muted val-mt-1">{{ item.subtitle }}</div>
                  </div>
                </template>
              </ValCarousel>

              <!-- Galleria -->
              <div>
                <ValGalleria
                  :value="galleriaImages"
                  :show-thumbnails="true"
                  :circular="true"
                />
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 6: Alertas & Spinners de Carga -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">5. Alertas & Spinners (ValAlert & ValProgressSpinner)</span>
                <ValBadge severity="secondary" size="sm">Fase 6</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <!-- Flat Alert -->
              <ValAlert
                v-if="showAlertBox"
                severity="success"
                variant="flat"
                title="Sincronización Exitosa (ValAlert flat)"
                :closable="true"
                @close="showAlertBox = false"
              >
                Fase 6 completada con soporte para alertas flotantes, spinners reactivos y confirmación.
              </ValAlert>

              <div v-else class="val-mb-2">
                <ValButton variant="ghost-primary" size="sm" @click="showAlertBox = true">
                  Restaurar Alerta Cerrada
                </ValButton>
              </div>

              <!-- Outlined Alert -->
              <ValAlert
                severity="warning"
                variant="outlined"
                title="Advertencia de Configuración"
                :closable="false"
              >
                Recuerda que todas las animaciones y tokens CSS están sincronizados con la librería base.
              </ValAlert>

              <!-- Filled Danger Alert -->
              <ValAlert
                severity="danger"
                variant="filled"
                :show-icon="true"
                :closable="false"
              >
                Alerta de severidad crítica (filled) con icono SVG nativo y accesibilidad ARIA.
              </ValAlert>

              <!-- Progress Spinners Showcase -->
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-2 val-block">
                  Spinners Circulares Animados (ValProgressSpinner):
                </label>
                <div class="val-flex val-align-items-center val-gap-4 val-py-2">
                  <ValProgressSpinner size="1.75rem" severity="primary" />
                  <ValProgressSpinner size="2.25rem" severity="success" />
                  <ValProgressSpinner size="2.75rem" severity="warning" />
                  <ValProgressSpinner size="3.25rem" severity="danger" />
                  <span class="val-text-xs val-text-muted">Animación SVG con stroke de diseño Valence.</span>
                </div>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 6: Tooltip, Popover & Bloqueo -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">2. Overlays & Bloqueo (Tooltip, Popover, BlockUI, Confirm)</span>
                <ValBadge severity="primary" size="sm">Fase 6</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <!-- BlockUI Container -->
              <ValBlockUI :blocked="isCardBlocked" message="Procesando solicitud asíncrona...">
                <div class="val-p-3 val-rounded val-border val-bg-light">
                  <div class="val-flex val-justify-content-between val-align-items-center val-mb-2">
                    <span class="val-text-sm val-font-bold">Contenedor con ValBlockUI</span>
                    <ValBadge :severity="isCardBlocked ? 'warn' : 'success'" size="sm">
                      {{ isCardBlocked ? 'Bloqueado' : 'Activo' }}
                    </ValBadge>
                  </div>
                  <p class="val-text-xs val-text-secondary val-m-0 val-mb-3">
                    Simula la espera de APIs bloqueando este bloque de UI con efecto glassmorphism.
                  </p>
                  <div class="val-flex val-gap-2">
                    <ValButton variant="primary" size="sm" @click="simulateBlockUI">
                      Simular Carga (2.2s)
                    </ValButton>
                    <ValButton variant="outline-primary" size="sm" @click="handleConfirmDemo">
                      Detonar ValConfirmDialog
                    </ValButton>
                  </div>
                </div>
              </ValBlockUI>

              <!-- Popover and Tooltips -->
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-2 val-block">
                  Popovers Dinámicos & Tooltips Flotantes:
                </label>
                <div class="val-flex val-flex-wrap val-align-items-center val-gap-3">
                  <!-- Popover Example -->
                  <ValPopover width="280px">
                    <template #target>
                      <ValButton variant="outline-primary" size="sm">
                        Perfil (ValPopover)
                      </ValButton>
                    </template>
                    <template #default="{ close }">
                      <div class="val-flex val-flex-column val-gap-2">
                        <div class="val-flex val-align-items-center val-gap-2">
                          <div class="val-rounded-circle val-bg-primary val-flex val-align-items-center val-justify-content-center" style="width: 36px; height: 36px; color: white; font-weight: bold; border-radius: 50%;">
                            SA
                          </div>
                          <div>
                            <div class="val-font-bold val-text-sm">Sebastian Altivex</div>
                            <div class="val-text-xs val-text-muted">Lead Systems Architect</div>
                          </div>
                        </div>
                        <p class="val-text-xs val-text-secondary val-m-0 val-my-1">
                          Este panel flota de manera fluida y se cierra con click exterior.
                        </p>
                        <div class="val-flex val-justify-content-end val-mt-2">
                          <ValButton variant="secondary" size="sm" @click="close">Cerrar</ValButton>
                        </div>
                      </div>
                    </template>
                  </ValPopover>

                  <!-- Tooltip Component Examples -->
                  <ValTooltip text="Tooltip superior" position="top">
                    <ValButton variant="secondary" size="sm">Arriba</ValButton>
                  </ValTooltip>

                  <ValTooltip text="Tooltip inferior animado" position="bottom">
                    <ValButton variant="secondary" size="sm">Abajo</ValButton>
                  </ValTooltip>

                  <ValTooltip text="Tooltip izquierdo" position="left">
                    <ValButton variant="secondary" size="sm">Izq</ValButton>
                  </ValTooltip>

                  <!-- Directive Tooltip Example -->
                  <button
                    type="button"
                    class="val-btn val-btn--ghost val-btn--sm"
                    v-tooltip.right="'Tooltip accionado vía directiva v-tooltip!'"
                  >
                    Directiva v-tooltip
                  </button>
                </div>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 5: Controles Especializados 1 (DatePicker, OTP, Rating) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">3. DatePicker, OTP & Rating</span>
                <ValBadge severity="primary" size="sm">Fase 5</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <ValDatePicker
                  v-model="pickedDate"
                  label="Fecha de Lanzamiento (DatePicker):"
                  placeholder="Selecciona fecha..."
                />
                <span class="val-text-xs val-text-muted val-mt-1 val-block">
                  Fecha seleccionada: <strong class="val-text-primary">{{ pickedDate || '(ninguna)' }}</strong>
                </span>
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Código de Verificación de 6 dígitos (ValOtp):
                </label>
                <ValOtp
                  v-model="otpCode"
                  :length="6"
                  @complete="triggerToast('success', 'filled')"
                />
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Puntuación de Experiencia (ValRating):
                </label>
                <div class="val-flex val-align-items-center val-gap-2">
                  <ValRating v-model="ratingValue" :max="5" />
                  <span class="val-text-sm val-font-bold val-text-secondary">{{ ratingValue }} / 5</span>
                </div>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- FASE 5: Controles Especializados 2 (SelectButton, Slider, Chips, Radio) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">2. SelectButton, Slider, Chips & Radio</span>
                <ValBadge severity="primary" size="sm">Fase 5</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Plan de Facturación (ValSelectButton):
                </label>
                <ValSelectButton v-model="billingCycle" :options="billingOptions" />
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Capacidad de Servidores (ValSlider):
                </label>
                <ValSlider v-model="sliderValue" :min="0" :max="100" :step="5" />
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Etiquetas de Búsqueda (ValChips):
                </label>
                <ValChips v-model="tagsValue" placeholder="Escribe y presiona Enter..." />
              </div>

              <div>
                <label class="val-text-xs val-font-semibold val-text-secondary val-mb-1 val-block">
                  Método de Pago (ValRadioGroup & ValRadio):
                </label>
                <ValRadioGroup v-model="selectedPayment" :options="paymentOptions" />
                <div class="val-mt-2">
                  <ValRadio
                    v-model="selectedPayment"
                    value="wire"
                    label="Transferencia Bancaria Directa (ValRadio unitario)"
                    name="payment"
                  />
                </div>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- 3. Stepper Wizard (Fase 4) -->
        <div class="val-col-12">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">3. Flujo Guiado Paso a Paso (ValStepper)</span>
                <ValBadge severity="secondary" size="sm">Fase 4</ValBadge>
              </div>
            </template>

            <ValStepper ref="stepperRef" v-model="currentStep" orientation="horizontal">
              <ValStep label="Configuración Inicial">
                <div class="val-p-3 val-bg-light val-rounded">
                  <h4 class="val-m-0 val-mb-1 val-text-base val-font-bold">Paso 1: Datos de tu Entorno</h4>
                  <p class="val-text-sm val-text-secondary val-mb-3">
                    Personaliza la instancia de tu aplicación en Vue 3 con composición reactiva.
                  </p>
                  <ValInput v-model="username" placeholder="Nombre del proyecto o usuario" style="max-width: 320px;" />
                </div>
              </ValStep>

              <ValStep label="Seguridad & Acceso">
                <div class="val-p-3 val-bg-light val-rounded">
                  <h4 class="val-m-0 val-mb-1 val-text-base val-font-bold">Paso 2: Credenciales de Acceso</h4>
                  <p class="val-text-sm val-text-secondary val-mb-3">
                    Valida tu contraseña segura con el componente ValPassword.
                  </p>
                  <ValPassword v-model="password" style="max-width: 320px;" />
                </div>
              </ValStep>

              <ValStep label="Despliegue" :optional="true">
                <div class="val-p-3 val-bg-light val-rounded">
                  <h4 class="val-m-0 val-mb-1 val-text-base val-font-bold">Paso 3: ¡Listo para Producción!</h4>
                  <p class="val-text-sm val-text-secondary val-m-0">
                    Todos los pasos han sido verificados satisfactoriamente.
                  </p>
                </div>
              </ValStep>
            </ValStepper>

            <div class="val-flex val-justify-content-between val-align-items-center val-mt-3">
              <ValButton
                variant="outline-secondary"
                size="sm"
                :disabled="stepperRef?.isFirst"
                @click="stepperRef?.previous()"
              >
                Anterior
              </ValButton>

              <div class="val-flex val-gap-2">
                <ValButton
                  variant="outline-secondary"
                  size="sm"
                  @click="stepperRef?.reset()"
                >
                  Reiniciar
                </ValButton>
                <ValButton
                  variant="primary"
                  size="sm"
                  :disabled="stepperRef?.isLast"
                  @click="stepperRef?.next()"
                >
                  Siguiente
                </ValButton>
              </div>
            </div>
          </ValCard>
        </div>

        <!-- 4. Timeline Cronológica (Fase 4) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">4. Línea de Tiempo (ValTimeline)</span>
                <ValBadge severity="secondary" size="sm">Fase 4</ValBadge>
              </div>
            </template>

            <ValTimeline :value="timelineEvents" layout="vertical" />
          </ValCard>
        </div>

        <!-- 5. Skeleton Loading & Placeholders (Fase 4) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">5. Animaciones Shimmer (ValSkeleton)</span>
                <ValBadge severity="secondary" size="sm">Fase 4</ValBadge>
              </div>
            </template>

            <p class="val-text-sm val-text-secondary val-mb-3">
              Placeholders de carga con animación wave para perfiles y tarjetas:
            </p>

            <div class="val-p-3 val-border val-rounded val-bg-light val-mb-3">
              <div class="val-flex val-align-items-center val-gap-3 val-mb-3">
                <ValSkeleton shape="circle" width="48px" height="48px" animation="wave" />
                <div class="val-flex val-flex-column val-gap-2" style="flex: 1;">
                  <ValSkeleton width="55%" height="16px" animation="wave" />
                  <ValSkeleton width="35%" height="12px" animation="wave" />
                </div>
              </div>
              <ValSkeleton width="100%" height="12px" animation="wave" class="val-mb-2" />
              <ValSkeleton width="85%" height="12px" animation="wave" />
            </div>

            <div class="val-flex val-gap-2 val-align-items-center">
              <ValButton size="sm" variant="outline-primary" @click="showSidebar = true">
                Ver Sidebar Drawer
              </ValButton>
              <ValButton size="sm" variant="outline-primary" @click="showModal = true">
                Ver Modal Dialog
              </ValButton>
            </div>
          </ValCard>
        </div>

        <!-- 6. Tabla de Datos Reactiva (Fase 3) -->
        <div class="val-col-12">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between val-flex-wrap val-gap-2">
                <div class="val-flex val-align-items-center val-gap-2">
                  <span class="val-font-bold val-text-base">6. Tabla de Datos (ValTable)</span>
                  <ValBadge severity="success" size="sm">Fase 3</ValBadge>
                </div>

                <div class="val-flex val-align-items-center val-gap-2">
                  <ValInput
                    v-model="tableFilter"
                    placeholder="Filtrar registros..."
                    :clearable="true"
                    style="width: 220px;"
                  />
                  <ValButton
                    variant="outline-primary"
                    size="sm"
                    @click="tableRef?.exportCSV('usuarios_valence.csv')"
                  >
                    Exportar CSV
                  </ValButton>
                </div>
              </div>
            </template>

            <ValTable
              ref="tableRef"
              :value="usersData"
              :columns="tableColumns"
              :global-filter="tableFilter"
              selection-mode="single"
              v-model:selection="tableSelection"
              :hoverable="true"
              :bordered="true"
            >
              <template #body="{ row }">
                <td class="val-font-bold">{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>
                  <span class="val-text-sm val-text-secondary">{{ row.role }}</span>
                </td>
                <td>
                  <ValTag
                    :value="row.status"
                    :severity="row.status === 'Activo' ? 'success' : row.status === 'Pendiente' ? 'warning' : 'danger'"
                    :rounded="true"
                  />
                </td>
                <td>
                  <div class="val-flex val-align-items-center val-gap-2" style="min-width: 140px;">
                    <ValProgressBar
                      :value="row.progress"
                      :severity="row.progress >= 70 ? 'success' : row.progress >= 40 ? 'warning' : 'danger'"
                      :show-value="false"
                      style="height: 8px;"
                    />
                    <span class="val-text-xs val-font-semibold">{{ row.progress }}%</span>
                  </div>
                </td>
              </template>
            </ValTable>
          </ValCard>
        </div>

        <!-- 7. Tabs & Accordion (Fase 3) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">7. Tabs de Navegación</span>
                <ValBadge severity="secondary" size="sm">Fase 3</ValBadge>
              </div>
            </template>

            <ValTabs v-model="activeTab" color="primary">
              <ValTab label="Resumen">
                <div class="val-p-3 val-bg-light val-rounded val-mt-2">
                  <p class="val-text-sm val-text-secondary val-m-0">
                    Sincronización multi-framework nativa entre Angular y Vue 3.
                  </p>
                </div>
              </ValTab>

              <ValTab label="Progreso">
                <div class="val-p-3 val-bg-light val-rounded val-mt-2">
                  <div class="val-flex val-justify-content-between val-align-items-center val-mb-2">
                    <span class="val-text-sm val-font-semibold">Nivel de Cobertura:</span>
                    <strong class="val-text-primary">{{ progressValue }}%</strong>
                  </div>
                  <ValProgressBar :value="progressValue" severity="primary" class="val-mb-2" />
                </div>
              </ValTab>

              <ValTab label="Tags">
                <div class="val-p-3 val-bg-light val-rounded val-mt-2">
                  <div class="val-flex val-flex-wrap val-gap-2">
                    <ValTag
                      v-for="tag in removableTags"
                      :key="tag"
                      :value="tag"
                      severity="primary"
                      :removable="true"
                      @remove="removeTag(tag)"
                    />
                  </div>
                </div>
              </ValTab>
            </ValTabs>
          </ValCard>
        </div>

        <!-- 8. Acordeón (Fase 3) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">8. Acordeón Colapsable</span>
                <ValBadge severity="secondary" size="sm">Fase 3</ValBadge>
              </div>
            </template>

            <ValAccordion v-model="accordionActive">
              <ValAccordionItem id="item-1" title="¿Cómo se garantiza la paridad de estilos?">
                Valence UI compila variables CSS idénticas (`--val-primary`, `--val-border-color`, `--radius-md`).
              </ValAccordionItem>

              <ValAccordionItem id="item-2" title="¿Soporta Composition API y TypeScript?">
                Sí, todos los componentes usan SFC con TypeScript y exportan interfaces tipadas.
              </ValAccordionItem>

              <ValAccordionItem id="item-3" title="¿Qué métodos expone ValTable?">
                Exporta `exportCSV()`, `toggleSort(field)`, y filtros globales dinámicos.
              </ValAccordionItem>
            </ValAccordion>
          </ValCard>
        </div>

        <!-- 9. Form Controls (Fases 1 y 2) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">9. Checkbox, Switch & Password</span>
                <ValBadge severity="secondary" size="sm">Fase 2</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div class="val-flex val-gap-3 val-align-items-center">
                <ValCheckbox v-model="checkTerms" label="Acepto términos" color="primary" />
                <ValSwitch v-model="switchActive" label="Activo" color="success" />
              </div>

              <ValPassword
                v-model="password"
                label="Contraseña:"
                placeholder="Escribe contraseña"
                hint="Icono de ojo integrado para revelar/ocultar."
              />
            </div>
          </ValCard>
        </div>

        <!-- 10. Dropdown & Textarea (Fase 2) -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">10. Dropdown & Textarea</span>
                <ValBadge severity="secondary" size="sm">Fase 2</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <ValDropdown
                v-model="selectedFramework"
                :options="frameworks"
                :filter="true"
                placeholder="Selecciona framework"
                severity="primary"
              />

              <ValTextarea
                v-model="comments"
                label="Comentarios:"
                :rows="2"
                :auto-resize="true"
              />
            </div>
          </ValCard>
        </div>

        <!-- 11. ValIcon & ValToggleButton -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">11. Iconos SVG & Toggle Button</span>
                <ValBadge severity="success" size="sm">100% Paridad</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <div>
                <span class="val-text-xs val-font-bold val-text-secondary val-mb-2 val-block">Catálogo de Iconos Nativos SVG:</span>
                <div class="val-flex val-align-items-center val-gap-3 val-flex-wrap">
                  <ValIcon name="check" size="1.25rem" class="val-text-success" />
                  <ValIcon name="alert-triangle" size="1.25rem" class="val-text-warning" />
                  <ValIcon name="heart" size="1.25rem" class="val-text-danger" />
                  <ValIcon name="star" size="1.25rem" class="val-text-primary" />
                  <ValIcon name="search" size="1.25rem" class="val-text-secondary" />
                  <ValIcon name="settings" size="1.25rem" />
                  <ValIcon name="refresh-cw" size="1.25rem" class="val-text-info" />
                </div>
              </div>

              <div>
                <span class="val-text-xs val-font-bold val-text-secondary val-mb-2 val-block">ValToggleButton (Binario):</span>
                <ValToggleButton
                  v-model="toggleActive"
                  on-label="Activo"
                  off-label="Inactivo"
                  on-icon="check"
                  off-icon="close"
                />
              </div>
            </div>
          </ValCard>
        </div>

        <!-- 12. ValFormField & Affixes -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">12. FormField & Sub-componentes</span>
                <ValBadge severity="success" size="sm">100% Paridad</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <ValFormField appearance="outline">
                <ValFormFieldLabel>Dominio de Plataforma</ValFormFieldLabel>
                <div class="val-flex val-align-items-center val-gap-2">
                  <ValIcon name="globe" size="1rem" class="val-text-muted" />
                  <input
                    v-model="formFieldText"
                    class="val-input-field"
                    style="border: none; outline: none; background: transparent; width: 100%;"
                    placeholder="https://"
                  />
                </div>
                <ValFormFieldHint>Ejemplo: app.valence.dev</ValFormFieldHint>
                <ValFormFieldError v-if="!formFieldText">El dominio es requerido</ValFormFieldError>
              </ValFormField>
            </div>
          </ValCard>
        </div>

        <!-- 13. MultiSelect & Native DateInput -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">13. MultiSelect & DateInput</span>
                <ValBadge severity="success" size="sm">100% Paridad</ValBadge>
              </div>
            </template>

            <div class="val-flex val-flex-column val-gap-3">
              <ValMultiSelect
                v-model="selectedMulti"
                :options="multiOptions"
                :filter="true"
                :display-chips="true"
                placeholder="Seleccionar tecnologías..."
                severity="primary"
              />

              <ValDateInput
                v-model="birthDate"
                label="Fecha de Nacimiento:"
                placeholder="Seleccionar..."
                :float-label="false"
              />
            </div>
          </ValCard>
        </div>

        <!-- 14. Knob, ConfirmPopup & DynamicDialog -->
        <div class="val-col-12 val-col-md-6">
          <ValCard :bordered="true" box-shadow="sm">
            <template #header>
              <div class="val-flex val-align-items-center val-justify-content-between">
                <span class="val-font-bold val-text-base">14. Knob, ConfirmPopup & DynamicModal</span>
                <ValBadge severity="success" size="sm">100% Paridad</ValBadge>
              </div>
            </template>

            <div class="val-flex val-align-items-center val-justify-content-between val-gap-4">
              <div class="val-flex val-flex-column val-align-items-center">
                <ValKnob
                  v-model="knobValue"
                  :size="90"
                  :min="0"
                  :max="100"
                  unit="%"
                  label="Rendimiento"
                  value-color="#3b82f6"
                />
              </div>

              <div class="val-flex val-flex-column val-gap-2 val-flex-1">
                <ValConfirmPopup
                  message="¿Confirmas ejecutar la acción segura?"
                  icon="alert-triangle"
                  accept-label="Confirmar"
                  reject-label="Cancelar"
                >
                  <ValButton variant="outline-danger" size="sm">
                    Confirm Popup
                  </ValButton>
                </ValConfirmPopup>

                <ValButton variant="primary" size="sm" @click="openDynamicModal">
                  Abrir DynamicDialog
                </ValButton>
              </div>
            </div>
          </ValCard>
        </div>
      </div>
    </div>

    <!-- Modal Dialog Instance -->
    <ValDialog
      v-model:visible="showModal"
      header="Demostración de Diálogo en Vue 3"
      :modal="true"
      :dismissable-mask="true"
      width="520px"
    >
      <div class="val-flex val-flex-column val-gap-3">
        <p class="val-text-sm val-text-secondary val-m-0">
          ¡Hola <strong>{{ username || 'Desarrollador' }}</strong>! Este diálogo está implementado nativamente en Vue 3 con <code>&lt;Teleport to="body"&gt;</code> y comparte exactamente los mismos estilos y tokens SCSS de Valence UI.
        </p>

        <div class="val-p-3 val-rounded val-border" style="background: #f8fafc; border-color: #e2e8f0;">
          <span class="val-text-xs val-font-bold val-text-primary">Sincronización de Estado:</span>
          <p class="val-text-xs val-text-muted val-m-0 val-mt-1">
            Clicks acumulados en el botón exterior: <strong>{{ counter }}</strong>
          </p>
        </div>
      </div>

      <template #footer>
        <div class="val-flex val-justify-content-end val-gap-2">
          <ValButton variant="secondary" @click="showModal = false">Cancelar</ValButton>
          <ValButton variant="primary" @click="showModal = false">Aceptar</ValButton>
        </div>
      </template>
    </ValDialog>

    <!-- SpeedDial Floating Action Button (Fase 8) -->
    <div style="position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;">
      <ValSpeedDial :model="speedDialItems" direction="up" />
    </div>
  </div>
</template>

<style>
/* Page Reset & Presentation */
html, body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: var(--font-primary, 'Manrope', system-ui, sans-serif);
  -webkit-font-smoothing: antialiased;
}

.demo-page {
  min-height: 100vh;
  padding: 2rem 1.5rem 4rem;
}

.demo-container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
