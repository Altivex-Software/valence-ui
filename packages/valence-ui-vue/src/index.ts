import type { App, Plugin } from 'vue';
import './components/tooltip/tooltip.scss';

// Phase 1 Components
import ValButton from './components/button/ValButton.vue';
import ValCard from './components/card/ValCard.vue';
import ValBadge from './components/badge/ValBadge.vue';
import ValInput from './components/input/ValInput.vue';
import ValDialog from './components/dialog/ValDialog.vue';

// Phase 2 Components
import ValCheckbox from './components/checkbox/ValCheckbox.vue';
import ValSwitch from './components/switch/ValSwitch.vue';
import ValPassword from './components/input/ValPassword.vue';
import ValTextarea from './components/input/ValTextarea.vue';
import ValDropdown from './components/dropdown/ValDropdown.vue';
import ValToast from './components/toast/ValToast.vue';

// Phase 3 Components
import ValTabs from './components/tabs/ValTabs.vue';
import ValTab from './components/tabs/ValTab.vue';
import ValAccordion from './components/accordion/ValAccordion.vue';
import ValAccordionItem from './components/accordion/ValAccordionItem.vue';
import ValTable from './components/table/ValTable.vue';
import ValDivider from './components/divider/ValDivider.vue';
import ValTag from './components/tag/ValTag.vue';
import ValProgressBar from './components/progress-bar/ValProgressBar.vue';

// Phase 4 Components
import ValBreadcrumb from './components/breadcrumb/ValBreadcrumb.vue';
import ValStepper from './components/stepper/ValStepper.vue';
import ValStep from './components/stepper/ValStep.vue';
import ValSidebar from './components/sidebar/ValSidebar.vue';
import ValSkeleton from './components/skeleton/ValSkeleton.vue';
import ValTimeline from './components/timeline/ValTimeline.vue';
import ValToolbar from './components/toolbar/ValToolbar.vue';

// Phase 5 Components
import ValRadio from './components/radio/ValRadio.vue';
import ValRadioGroup from './components/radio/ValRadioGroup.vue';
import ValSelectButton from './components/select-button/ValSelectButton.vue';
import ValSlider from './components/input/ValSlider.vue';
import ValRating from './components/input/ValRating.vue';
import ValChips from './components/chips/ValChips.vue';
import ValOtp from './components/input/ValOtp.vue';
import ValDatePicker from './components/date-picker/ValDatePicker.vue';

// Phase 6 Components
import ValAlert from './components/alert/ValAlert.vue';
import ValProgressSpinner from './components/progress-spinner/ValProgressSpinner.vue';
import ValTooltip from './components/tooltip/ValTooltip.vue';
import ValPopover from './components/popover/ValPopover.vue';
import ValConfirmDialog from './components/confirm/ValConfirmDialog.vue';
import ValBlockUI from './components/block-ui/ValBlockUI.vue';

// Phase 7 Components
import ValPaginator from './components/paginator/ValPaginator.vue';
import ValTree from './components/tree/ValTree.vue';
import ValTreeNode from './components/tree/ValTreeNode.vue';
import ValTreeSelect from './components/tree/ValTreeSelect.vue';
import ValTreeTable from './components/tree/ValTreeTable.vue';
import ValSplitter from './components/splitter/ValSplitter.vue';
import ValFileUpload from './components/file-upload/ValFileUpload.vue';
import ValCarousel from './components/carousel/ValCarousel.vue';
import ValGalleria from './components/galleria/ValGalleria.vue';

// Phase 8 Components
import ValMenubar from './components/menubar/ValMenubar.vue';
import ValMegaMenu from './components/mega-menu/ValMegaMenu.vue';
import ValPanelMenu from './components/panel-menu/ValPanelMenu.vue';
import ValContextMenu from './components/context-menu/ValContextMenu.vue';
import ValSpeedDial from './components/speed-dial/ValSpeedDial.vue';
import ValPanel from './components/panel/ValPanel.vue';
import ValFieldset from './components/fieldset/ValFieldset.vue';
import ValImage from './components/image/ValImage.vue';
import ValAutoComplete from './components/auto-complete/ValAutoComplete.vue';
import ValInputMask from './components/input-mask/ValInputMask.vue';

// Complete Parity Additions (Icon, FormField, MultiSelect, Knob, DateInput, ToggleButton, ConfirmPopup, DynamicDialog)
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

// Directives
import { vTooltip } from './directives/vTooltip';

// Composables
export * from './composables/useToast';
export * from './composables/useConfirm';
export * from './composables/useDynamicDialog';

// Directives Export
export { vTooltip };

// Component Types & Exports
export type { ButtonProps } from './components/button/ValButton.vue';
export type { CardProps } from './components/card/ValCard.vue';
export type { BadgeProps, BadgeVariant } from './components/badge/ValBadge.vue';
export type { InputProps, InputSize, InputVariant, InputFocusColor } from './components/input/ValInput.vue';
export type { DialogProps } from './components/dialog/ValDialog.vue';
export type { CheckboxProps } from './components/checkbox/ValCheckbox.vue';
export type { SwitchProps } from './components/switch/ValSwitch.vue';
export type { PasswordProps } from './components/input/ValPassword.vue';
export type { TextareaProps } from './components/input/ValTextarea.vue';
export type { DropdownProps, DropdownOption } from './components/dropdown/ValDropdown.vue';
export type { TabsProps, TabData } from './components/tabs/ValTabs.vue';
export type { AccordionProps } from './components/accordion/ValAccordion.vue';
export type { AccordionItemProps, AccordionColor, AccordionVariant } from './components/accordion/ValAccordionItem.vue';
export type { TableProps, TableColumn } from './components/table/ValTable.vue';
export type { DividerProps, DividerOrientation, DividerLabelPosition, DividerBorderStyle } from './components/divider/ValDivider.vue';
export type { TagProps } from './components/tag/ValTag.vue';
export type { ProgressBarProps } from './components/progress-bar/ValProgressBar.vue';
export type { BreadcrumbProps, BreadcrumbItem } from './components/breadcrumb/ValBreadcrumb.vue';
export type { StepperProps, StepData } from './components/stepper/ValStepper.vue';
export type { StepProps } from './components/stepper/ValStep.vue';
export type { SidebarProps } from './components/sidebar/ValSidebar.vue';
export type { SkeletonProps } from './components/skeleton/ValSkeleton.vue';
export type { TimelineProps, TimelineItem } from './components/timeline/ValTimeline.vue';
export type { ToolbarProps } from './components/toolbar/ValToolbar.vue';
export type { RadioProps, RadioOption } from './components/radio/ValRadio.vue';
export type { RadioGroupProps } from './components/radio/ValRadioGroup.vue';
export type { SelectButtonProps, SelectButtonOption } from './components/select-button/ValSelectButton.vue';
export type { SliderProps } from './components/input/ValSlider.vue';
export type { RatingProps } from './components/input/ValRating.vue';
export type { ChipsProps } from './components/chips/ValChips.vue';
export type { OtpProps } from './components/input/ValOtp.vue';
export type { DatePickerProps, DatePickerSize, DatePickerVariant } from './components/date-picker/ValDatePicker.vue';
export type { AlertProps, AlertSeverity, AlertVariant } from './components/alert/ValAlert.vue';
export type { ProgressSpinnerProps, ProgressSpinnerSeverity } from './components/progress-spinner/ValProgressSpinner.vue';
export type { TooltipProps, TooltipPosition } from './components/tooltip/ValTooltip.vue';
export type { PopoverProps } from './components/popover/ValPopover.vue';
export type { ConfirmDialogProps } from './components/confirm/ValConfirmDialog.vue';
export type { BlockUIProps } from './components/block-ui/ValBlockUI.vue';

// Phase 7 Types
export type { PaginatorProps, PageChangeEvent } from './components/paginator/ValPaginator.vue';
export type { TreeNode, TreeSelectionMode, TreeFilterMode, TreeNodeSelectEvent } from './components/tree/tree.types';
export type { TreeProps } from './components/tree/ValTree.vue';
export type { TreeSelectProps } from './components/tree/ValTreeSelect.vue';
export type { TreeTableProps, TreeTableColumn } from './components/tree/ValTreeTable.vue';
export type { SplitterProps, SplitterLayout } from './components/splitter/ValSplitter.vue';
export type { FileUploadProps, FileUploadSelectEvent, FileUploadRemoveEvent, FileUploadErrorEvent } from './components/file-upload/ValFileUpload.vue';
export type { CarouselProps, CarouselEffect, CarouselResponsiveOption } from './components/carousel/ValCarousel.vue';
export type { GalleriaProps, GalleriaItem, GalleriaResponsiveOption } from './components/galleria/ValGalleria.vue';

// Phase 8 Types
export type { MenuItem, MenubarProps } from './components/menubar/ValMenubar.vue';
export type { MegaMenuItem, MegaMenuColumn, MegaMenuSubItem, MegaMenuProps } from './components/mega-menu/ValMegaMenu.vue';
export type { PanelMenuItem, PanelMenuProps } from './components/panel-menu/ValPanelMenu.vue';
export type { ContextMenuItem, ContextMenuProps } from './components/context-menu/ValContextMenu.vue';
export type { SpeedDialItem, SpeedDialProps, SpeedDialDirection, SpeedDialType, SpeedDialTooltipPosition } from './components/speed-dial/ValSpeedDial.vue';
export type { PanelProps, PanelVariant, PanelHeaderPosition } from './components/panel/ValPanel.vue';
export type { FieldsetProps, FieldsetVariant } from './components/fieldset/ValFieldset.vue';
export type { ImageProps } from './components/image/ValImage.vue';
export type { AutoCompleteProps, AutoCompleteSize, AutoCompleteVariant, AutoCompleteSeverity } from './components/auto-complete/ValAutoComplete.vue';
export type { InputMaskProps, InputMaskSize, InputMaskVariant, InputMaskSeverity } from './components/input-mask/ValInputMask.vue';

// Parity Component Types
export type { IconProps } from './components/icon/ValIcon.vue';
export type { ValIconName, ValIconSize, ValIconColor, ValIconVariant } from './components/icon/icon.types';
export type { FormFieldProps, FormFieldAppearance, FormFieldSize } from './components/form-field/ValFormField.vue';
export type { FormFieldLabelProps } from './components/form-field/ValFormFieldLabel.vue';
export type { FormFieldHintProps } from './components/form-field/ValFormFieldHint.vue';
export type { FormFieldErrorProps } from './components/form-field/ValFormFieldError.vue';
export type { MultiSelectOption, MultiSelectProps, MultiSelectSize, MultiSelectVariant, MultiSelectSeverity } from './components/multi-select/ValMultiSelect.vue';
export type { KnobProps, KnobVariant } from './components/input/ValKnob.vue';
export type { DateInputProps, DateInputSize, DateInputVariant } from './components/input/ValDateInput.vue';
export type { ToggleButtonProps } from './components/select-button/ValToggleButton.vue';
export type { ConfirmPopupProps } from './components/confirm-popup/ValConfirmPopup.vue';
export type { DynamicDialogConfig, DynamicDialogInstance } from './components/dynamic-dialog/dynamic-dialog.types';

// Export individual components
export {
  ValButton,
  ValCard,
  ValBadge,
  ValInput,
  ValDialog,
  ValCheckbox,
  ValSwitch,
  ValSwitch as ValInputSwitch,
  ValPassword,
  ValTextarea,
  ValDropdown,
  ValToast,
  ValTabs,
  ValTab,
  ValAccordion,
  ValAccordionItem,
  ValTable,
  ValDivider,
  ValTag,
  ValProgressBar,
  ValBreadcrumb,
  ValStepper,
  ValStep,
  ValSidebar,
  ValSkeleton,
  ValTimeline,
  ValToolbar,
  ValRadio,
  ValRadioGroup,
  ValSelectButton,
  ValSlider,
  ValRating,
  ValChips,
  ValOtp,
  ValOtp as ValInputOtp,
  ValDatePicker,
  ValAlert,
  ValProgressSpinner,
  ValTooltip,
  ValPopover,
  ValConfirmDialog,
  ValBlockUI,
  ValPaginator,
  ValTree,
  ValTreeNode,
  ValTreeSelect,
  ValTreeTable,
  ValSplitter,
  ValFileUpload,
  ValCarousel,
  ValGalleria,
  ValMenubar,
  ValMegaMenu,
  ValPanelMenu,
  ValContextMenu,
  ValSpeedDial,
  ValPanel,
  ValFieldset,
  ValImage,
  ValAutoComplete,
  ValInputMask,
  ValIcon,
  ValFormField,
  ValFormFieldLabel,
  ValFormFieldHint,
  ValFormFieldError,
  ValMultiSelect,
  ValKnob,
  ValDateInput,
  ValToggleButton,
  ValConfirmPopup,
  ValDynamicDialog
};

// Export types
export * from './types';

// Vue Plugin installer
const ValenceUiVue: Plugin = {
  install(app: App) {
    // Components
    app.component('ValButton', ValButton);
    app.component('ValCard', ValCard);
    app.component('ValBadge', ValBadge);
    app.component('ValInput', ValInput);
    app.component('ValDialog', ValDialog);
    app.component('ValCheckbox', ValCheckbox);
    app.component('ValSwitch', ValSwitch);
    app.component('ValInputSwitch', ValSwitch);
    app.component('ValPassword', ValPassword);
    app.component('ValTextarea', ValTextarea);
    app.component('ValDropdown', ValDropdown);
    app.component('ValToast', ValToast);
    app.component('ValTabs', ValTabs);
    app.component('ValTab', ValTab);
    app.component('ValAccordion', ValAccordion);
    app.component('ValAccordionItem', ValAccordionItem);
    app.component('ValTable', ValTable);
    app.component('ValDivider', ValDivider);
    app.component('ValTag', ValTag);
    app.component('ValProgressBar', ValProgressBar);
    app.component('ValBreadcrumb', ValBreadcrumb);
    app.component('ValStepper', ValStepper);
    app.component('ValStep', ValStep);
    app.component('ValSidebar', ValSidebar);
    app.component('ValSkeleton', ValSkeleton);
    app.component('ValTimeline', ValTimeline);
    app.component('ValToolbar', ValToolbar);
    app.component('ValRadio', ValRadio);
    app.component('ValRadioGroup', ValRadioGroup);
    app.component('ValSelectButton', ValSelectButton);
    app.component('ValSlider', ValSlider);
    app.component('ValRating', ValRating);
    app.component('ValChips', ValChips);
    app.component('ValOtp', ValOtp);
    app.component('ValInputOtp', ValOtp);
    app.component('ValDatePicker', ValDatePicker);
    app.component('ValAlert', ValAlert);
    app.component('ValProgressSpinner', ValProgressSpinner);
    app.component('ValTooltip', ValTooltip);
    app.component('ValPopover', ValPopover);
    app.component('ValConfirmDialog', ValConfirmDialog);
    app.component('ValBlockUI', ValBlockUI);
    app.component('ValPaginator', ValPaginator);
    app.component('ValTree', ValTree);
    app.component('ValTreeNode', ValTreeNode);
    app.component('ValTreeSelect', ValTreeSelect);
    app.component('ValTreeTable', ValTreeTable);
    app.component('ValSplitter', ValSplitter);
    app.component('ValFileUpload', ValFileUpload);
    app.component('ValCarousel', ValCarousel);
    app.component('ValGalleria', ValGalleria);
    app.component('ValMenubar', ValMenubar);
    app.component('ValMegaMenu', ValMegaMenu);
    app.component('ValPanelMenu', ValPanelMenu);
    app.component('ValContextMenu', ValContextMenu);
    app.component('ValSpeedDial', ValSpeedDial);
    app.component('ValPanel', ValPanel);
    app.component('ValFieldset', ValFieldset);
    app.component('ValImage', ValImage);
    app.component('ValAutoComplete', ValAutoComplete);
    app.component('ValInputMask', ValInputMask);

    // Parity additions
    app.component('ValIcon', ValIcon);
    app.component('ValFormField', ValFormField);
    app.component('ValFormFieldLabel', ValFormFieldLabel);
    app.component('ValFormFieldHint', ValFormFieldHint);
    app.component('ValFormFieldError', ValFormFieldError);
    app.component('ValMultiSelect', ValMultiSelect);
    app.component('ValKnob', ValKnob);
    app.component('ValDateInput', ValDateInput);
    app.component('ValToggleButton', ValToggleButton);
    app.component('ValConfirmPopup', ValConfirmPopup);
    app.component('ValDynamicDialog', ValDynamicDialog);

    // Directives
    app.directive('tooltip', vTooltip);
    app.directive('val-tooltip', vTooltip);
  }
};

export default ValenceUiVue;
