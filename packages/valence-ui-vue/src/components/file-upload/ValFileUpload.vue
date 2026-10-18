<script setup lang="ts">
import { ref } from 'vue';

export interface FileUploadProps {
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number;
  disabled?: boolean;
  chooseLabel?: string;
  showFileList?: boolean;
  customUpload?: boolean;
}

export interface FileUploadSelectEvent {
  originalEvent: Event;
  files: File[];
  currentFiles: File[];
}

export interface FileUploadRemoveEvent {
  file: File;
  currentFiles: File[];
}

export interface FileUploadErrorEvent {
  file: File;
  error: 'size' | 'type';
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  multiple: false,
  accept: '',
  maxFileSize: undefined,
  disabled: false,
  chooseLabel: 'Seleccionar archivo',
  showFileList: true,
  customUpload: false
});

const emit = defineEmits<{
  (e: 'select', event: FileUploadSelectEvent): void;
  (e: 'remove', event: FileUploadRemoveEvent): void;
  (e: 'error', event: FileUploadErrorEvent): void;
  (e: 'update:modelValue', files: File[]): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const isDragOver = ref(false);

function triggerChoose() {
  if (props.disabled) return;
  fileInputRef.value?.click();
}

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFiles(Array.from(target.files), event);
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

function onDragOver(event: DragEvent) {
  if (props.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  isDragOver.value = true;
}

function onDragLeave(event: DragEvent) {
  if (props.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  isDragOver.value = false;
}

function onDrop(event: DragEvent) {
  if (props.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  isDragOver.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    handleFiles(Array.from(event.dataTransfer.files), event);
  }
}

function isFileTypeValid(file: File, accepts: string): boolean {
  const acceptedTypes = accepts.split(',').map(t => t.trim());
  if (acceptedTypes.length === 0 || accepts === '') return true;

  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category + '/');
    }
    return file.type === type;
  });
}

function handleFiles(newFiles: File[], event: Event) {
  let validFiles: File[] = [];
  const max = props.maxFileSize;
  const accepts = props.accept;

  for (const file of newFiles) {
    if (max && file.size > max) {
      emit('error', { file, error: 'size' });
      continue;
    }

    if (accepts && !isFileTypeValid(file, accepts)) {
      emit('error', { file, error: 'type' });
      continue;
    }

    validFiles.push(file);
  }

  if (validFiles.length > 0) {
    if (!props.multiple) {
      validFiles = [validFiles[0]];
    }

    const currentFiles = props.multiple ? [...files.value, ...validFiles] : validFiles;
    files.value = currentFiles;

    emit('select', {
      originalEvent: event,
      files: validFiles,
      currentFiles
    });
    emit('update:modelValue', currentFiles);
  }
}

function removeFile(file: File, event: MouseEvent) {
  event.stopPropagation();
  if (props.disabled) return;

  const remaining = files.value.filter(f => f !== file);
  files.value = remaining;

  emit('remove', {
    file,
    currentFiles: remaining
  });
  emit('update:modelValue', remaining);
}

function clear() {
  files.value = [];
  emit('update:modelValue', []);
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

defineExpose({
  clear,
  files
});
</script>

<template>
  <div
    class="val-file-upload"
    :class="{
      'val-file-upload--disabled': disabled,
      'val-file-upload--dragover': isDragOver
    }"
  >
    <!-- Hidden File Input -->
    <input
      ref="fileInputRef"
      type="file"
      class="val-file-upload-input"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onFileSelect"
    />

    <!-- Dropzone Area -->
    <div
      v-if="!customUpload"
      class="val-file-upload-dropzone"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="triggerChoose"
    >
      <div class="val-file-upload-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <polyline points="12 12 12 16" />
          <polyline points="9 13 12 10 15 13" />
        </svg>
      </div>
      <p class="val-file-upload-text">{{ chooseLabel }}</p>
      <p class="val-file-upload-subtext">o arrastra y suelta aquí tus archivos</p>
    </div>
    <div v-else>
      <slot />
    </div>

    <!-- Uploaded Files List -->
    <div v-if="showFileList && files.length > 0" class="val-file-upload-list">
      <div
        v-for="file in files"
        :key="file.name + file.size"
        class="val-file-upload-item"
      >
        <div class="val-file-upload-item-info">
          <span class="val-file-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <div class="val-file-details">
            <span class="val-file-name" :title="file.name">{{ file.name }}</span>
            <span class="val-file-size">{{ formatSize(file.size) }}</span>
          </div>
        </div>

        <button
          type="button"
          class="val-file-remove-btn"
          title="Eliminar archivo"
          :disabled="disabled"
          @click="removeFile(file, $event)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.val-file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

  &-input {
    display: none;
  }

  &-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    border: 2px dashed #cbd5e1;
    border-radius: var(--radius-md, 8px);
    background-color: #f8fafc;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--val-primary, #3b82f6);
      background-color: #eff6ff;
    }
  }

  &--dragover &-dropzone {
    border-color: var(--val-primary, #3b82f6);
    background-color: #eff6ff;
    transform: scale(0.99);
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &-icon {
    color: var(--val-primary, #3b82f6);
    margin-bottom: 0.5rem;
  }

  &-text {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
  }

  &-subtext {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    color: #64748b;
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);

    &-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }
  }

  .val-file-icon {
    color: #64748b;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .val-file-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .val-file-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 260px;
  }

  .val-file-size {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .val-file-remove-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #94a3b8;
    cursor: pointer;
    transition: color 0.15s, background-color 0.15s;

    &:hover {
      color: #ef4444;
      background-color: rgba(239, 68, 68, 0.08);
    }
  }
}
</style>
