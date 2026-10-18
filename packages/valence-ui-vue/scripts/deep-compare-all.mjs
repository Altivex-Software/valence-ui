import fs from 'fs';
import path from 'path';

// Load the Angular dump
const ngDump = JSON.parse(fs.readFileSync('packages/valence-ui-vue/scripts/ng-components-dump.json', 'utf-8'));

// Helper to extract props and emits from Vue SFC
function parseVueComponent(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');

  const props = [];
  const emits = [];

  // Match defineProps interface Props { ... } or defineProps<{ ... }>() or defineProps({ ... })
  // 1. Look for interface Props { ... } or interface DropdownProps { ... }
  const interfaceRegex = /interface\s+([A-Za-z0-9_]+Props|[A-Za-z0-9_]*Props|Props)\s*\{([^}]+)\}/gs;
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    const lines = match[2].split('\n');
    for (const line of lines) {
      const propMatch = /^\s*([a-zA-Z0-9_$]+)\s*\??\s*:\s*([^;]+);?/.exec(line);
      if (propMatch && !propMatch[1].startsWith('//') && propMatch[1] !== 'modelValue') {
        props.push({ name: propMatch[1], type: propMatch[2].trim() });
      } else if (propMatch && propMatch[1] === 'modelValue') {
        props.push({ name: 'modelValue', type: propMatch[2].trim() });
      }
    }
  }

  // 2. Look for defineProps({ prop: ... })
  const objectPropsRegex = /defineProps\s*\(\s*\{([^}]+)\}\s*\)/gs;
  while ((match = objectPropsRegex.exec(content)) !== null) {
    const lines = match[1].split('\n');
    for (const line of lines) {
      const pMatch = /^\s*([a-zA-Z0-9_$]+)\s*:\s*([^,]+)/.exec(line);
      if (pMatch && !pMatch[1].startsWith('//')) {
        props.push({ name: pMatch[1], type: pMatch[2].trim() });
      }
    }
  }

  // 3. Look for defineEmits
  const emitRegex = /defineEmits\s*<\s*\{([^}]+)\}\s*>/gs;
  while ((match = emitRegex.exec(content)) !== null) {
    const lines = match[1].split('\n');
    for (const line of lines) {
      const eMatch = /^\s*\(\s*e\s*:\s*['"]([^'"]+)['"]/.exec(line);
      if (eMatch) {
        emits.push(eMatch[1]);
      }
    }
  }

  return { props, emits };
}

// Map NG component relative path to Vue SFC path
function mapNgToVue(ngFile) {
  const norm = ngFile.replace(/\\/g, '/');
  
  const mapping = {
    'button/button.component.ts': 'button/ValButton.vue',
    'card/card.component.ts': 'card/ValCard.vue',
    'badge/badge.component.ts': 'badge/ValBadge.vue',
    'input/input.component.ts': 'input/ValInput.vue',
    'input/password.component.ts': 'input/ValPassword.vue',
    'input/textarea.component.ts': 'input/ValTextarea.vue',
    'input/slider.component.ts': 'input/ValSlider.vue',
    'input/rating.component.ts': 'input/ValRating.vue',
    'input/otp.component.ts': 'input/ValOtp.vue',
    'input/radio.component.ts': 'radio/ValRadio.vue',
    'input/knob.component.ts': 'input/ValKnob.vue',
    'input/date-input.component.ts': 'input/ValDateInput.vue',
    'checkbox/checkbox.component.ts': 'checkbox/ValCheckbox.vue',
    'input-switch/input-switch.component.ts': 'switch/ValSwitch.vue',
    'dropdown/dropdown.component.ts': 'dropdown/ValDropdown.vue',
    'multi-select/multi-select.component.ts': 'multi-select/ValMultiSelect.vue',
    'chips/chips.component.ts': 'chips/ValChips.vue',
    'select-button/select-button.component.ts': 'select-button/ValSelectButton.vue',
    'select-button/toggle-button.component.ts': 'select-button/ValToggleButton.vue',
    'date-picker/date-picker.component.ts': 'date-picker/ValDatePicker.vue',
    'input-mask/input-mask.component.ts': 'input-mask/ValInputMask.vue',
    'auto-complete/auto-complete.component.ts': 'auto-complete/ValAutoComplete.vue',
    'form-field/form-field.component.ts': 'form-field/ValFormField.vue',
    'dialog/dialog.component.ts': 'dialog/ValDialog.vue',
    'dynamic-dialog/dynamic-dialog-container.component.ts': 'dynamic-dialog/ValDynamicDialog.vue',
    'confirm/confirm-dialog.component.ts': 'confirm/ValConfirmDialog.vue',
    'confirm-popup/confirm-popup.component.ts': 'confirm-popup/ValConfirmPopup.vue',
    'toast/toast.component.ts': 'toast/ValToast.vue',
    'alert/alert.component.ts': 'alert/ValAlert.vue',
    'progress-bar/progress-bar.component.ts': 'progress-bar/ValProgressBar.vue',
    'progress-spinner/progress-spinner.component.ts': 'progress-spinner/ValProgressSpinner.vue',
    'block-ui/block-ui.component.ts': 'block-ui/ValBlockUI.vue',
    'popover/popover.component.ts': 'popover/ValPopover.vue',
    'tabs/tabs.component.ts': 'tabs/ValTabs.vue',
    'tabs/tab.component.ts': 'tabs/ValTab.vue',
    'accordion/accordion.component.ts': 'accordion/ValAccordion.vue',
    'accordion/accordion-item/accordion-item.component.ts': 'accordion/ValAccordionItem.vue',
    'table/table.component.ts': 'table/ValTable.vue',
    'divider/divider.component.ts': 'divider/ValDivider.vue',
    'tag/tag.component.ts': 'tag/ValTag.vue',
    'breadcrumb/breadcrumb.component.ts': 'breadcrumb/ValBreadcrumb.vue',
    'stepper/stepper.component.ts': 'stepper/ValStepper.vue',
    'stepper/step.component.ts': 'stepper/ValStep.vue',
    'sidebar/sidebar.component.ts': 'sidebar/ValSidebar.vue',
    'skeleton/skeleton.component.ts': 'skeleton/ValSkeleton.vue',
    'timeline/timeline.component.ts': 'timeline/ValTimeline.vue',
    'toolbar/toolbar.component.ts': 'toolbar/ValToolbar.vue',
    'paginator/paginator.component.ts': 'paginator/ValPaginator.vue',
    'tree/tree.component.ts': 'tree/ValTree.vue',
    'tree-select/tree-select.component.ts': 'tree/ValTreeSelect.vue',
    'tree-table/tree-table.component.ts': 'tree/ValTreeTable.vue',
    'splitter/splitter.component.ts': 'splitter/ValSplitter.vue',
    'file-upload/file-upload.component.ts': 'file-upload/ValFileUpload.vue',
    'carousel/carousel.component.ts': 'carousel/ValCarousel.vue',
    'galleria/galleria.component.ts': 'galleria/ValGalleria.vue',
    'menubar/menubar.component.ts': 'menubar/ValMenubar.vue',
    'mega-menu/mega-menu.component.ts': 'mega-menu/ValMegaMenu.vue',
    'panel-menu/panel-menu.component.ts': 'panel-menu/ValPanelMenu.vue',
    'context-menu/context-menu.component.ts': 'context-menu/ValContextMenu.vue',
    'speed-dial/speed-dial.component.ts': 'speed-dial/ValSpeedDial.vue',
    'panel/panel.component.ts': 'panel/ValPanel.vue',
    'fieldset/fieldset.component.ts': 'fieldset/ValFieldset.vue',
    'image/image.component.ts': 'image/ValImage.vue',
    'icon/icon.component.ts': 'icon/ValIcon.vue'
  };

  return mapping[norm] || null;
}

const report = [];

for (const ngComp of ngDump) {
  const vueRel = mapNgToVue(ngComp.file);
  if (!vueRel) continue;

  const vueFull = path.join('packages/valence-ui-vue/src/components', vueRel);
  const exists = fs.existsSync(vueFull);

  if (!exists) {
    report.push({
      ngFile: ngComp.file,
      vueFile: vueRel,
      status: 'MISSING_IN_VUE',
      missingProps: ngComp.inputs.map(i => i.name)
    });
    continue;
  }

  const vueParsed = parseVueComponent(vueFull);
  const vuePropNames = (vueParsed?.props || []).map(p => p.name);

  // Check inputs in NG that are not in Vue
  const missingInVue = ngComp.inputs
    .map(i => i.name)
    .filter(name => {
      if (name === 'value' && vuePropNames.includes('modelValue')) return false;
      // ValenceTemplateDirective input on TableComponent file
      if (ngComp.file.includes('table') && name === 'name') return false;
      // TreeNodeComponent inputs on TreeComponent file (these exist on ValTreeNode.vue)
      if (ngComp.file.includes('tree.component') && ['node', 'tree', 'parent'].includes(name)) return false;
      return !vuePropNames.includes(name);
    });

  report.push({
    ngFile: ngComp.file,
    vueFile: vueRel,
    status: missingInVue.length === 0 ? 'IDENTICAL' : 'PROPS_DIFF',
    missingProps: missingInVue,
    ngInputs: ngComp.inputs.map(i => i.name),
    vueProps: vuePropNames
  });
}

fs.writeFileSync(
  'packages/valence-ui-vue/scripts/comparison-report.json',
  JSON.stringify(report, null, 2),
  'utf-8'
);

console.log('Report generated. Summary:');
const missing = report.filter(r => r.status === 'MISSING_IN_VUE');
const diff = report.filter(r => r.status === 'PROPS_DIFF');
const identical = report.filter(r => r.status === 'IDENTICAL');

console.log(`Total compared: ${report.length}`);
console.log(`Identical: ${identical.length}`);
console.log(`Missing in Vue: ${missing.length} (${missing.map(m => m.vueFile).join(', ')})`);
console.log(`Props diffs: ${diff.length}`);

for (const d of diff) {
  console.log(`- ${d.vueFile}: missing in Vue -> [${d.missingProps.join(', ')}]`);
}
