<script setup lang="ts">
import { useDynamicDialog } from '../../composables/useDynamicDialog';
import ValIcon from '../icon/ValIcon.vue';

const { activeDialogs } = useDynamicDialog();

function toggleMaximize(dialog: any) {
  dialog.isMaximized = !dialog.isMaximized;
}

function onMaskClick(dialog: any, event: MouseEvent) {
  if (dialog.config.dismissableMask && event.target === event.currentTarget) {
    dialog.close();
  }
}
</script>

<template>
  <teleport to="body">
    <div
      v-for="dialog in activeDialogs"
      :key="dialog.id"
      class="val-dialog-mask"
      @click="onMaskClick(dialog, $event)"
    >
      <div
        class="val-dialog val-elevation-4"
        :class="[
          dialog.config.styleClass || '',
          { 'val-dialog-maximized': dialog.isMaximized }
        ]"
        :style="{
          width: dialog.isMaximized ? '100vw' : (dialog.config.width || '500px'),
          height: dialog.isMaximized ? '100vh' : (dialog.config.height || 'auto')
        }"
        @click.stop
      >
        <!-- Header -->
        <div
          v-if="dialog.config.header || dialog.config.closable || dialog.config.maximizable"
          class="val-dialog-header"
        >
          <span class="val-dialog-title">{{ dialog.config.header }}</span>
          <div class="val-dialog-header-actions">
            <button
              v-if="dialog.config.maximizable"
              type="button"
              class="val-dialog-header-icon"
              aria-label="Maximize dialog"
              @click="toggleMaximize(dialog)"
            >
              <ValIcon :name="dialog.isMaximized ? 'minimize' : 'maximize'" size="1rem" />
            </button>
            <button
              v-if="dialog.config.closable"
              type="button"
              class="val-dialog-close"
              aria-label="Close dialog"
              @click="dialog.close()"
            >
              <ValIcon name="x" size="1.125rem" />
            </button>
          </div>
        </div>

        <!-- Dynamic Content -->
        <div class="val-dialog-content" :style="dialog.config.contentStyle">
          <component :is="dialog.component" :dialog-data="dialog.config.data" @close="dialog.close" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss">
@use '../../../../../projects/valence-ui/src/lib/components/dialog/dialog.component.scss';

.val-dialog-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.val-dialog-header-icon {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
}

.val-dialog-maximized {
  width: 100vw !important;
  height: 100vh !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
}
</style>
