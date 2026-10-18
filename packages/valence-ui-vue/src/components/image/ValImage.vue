<script setup lang="ts">
import { ref } from 'vue';

export interface ImageProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  preview?: boolean;
  loading?: 'eager' | 'lazy';
  indicatorIcon?: string;
  imageClass?: string;
  imageStyle?: string | Record<string, string>;
  styleClass?: string;
}

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  width: 'auto',
  height: 'auto',
  preview: false,
  loading: 'eager',
  indicatorIcon: 'eye',
  imageClass: '',
  imageStyle: '',
  styleClass: ''
});

const isPreviewOpen = ref(false);
const zoomScale = ref(1);
const rotation = ref(0);

function openPreview() {
  if (!props.preview) return;
  zoomScale.value = 1;
  rotation.value = 0;
  isPreviewOpen.value = true;
}

function closePreview() {
  isPreviewOpen.value = false;
}

function zoomIn() {
  zoomScale.value = Math.min(zoomScale.value + 0.25, 3);
}

function zoomOut() {
  zoomScale.value = Math.max(zoomScale.value - 0.25, 0.5);
}

function rotateLeft() {
  rotation.value -= 90;
}

function rotateRight() {
  rotation.value += 90;
}
</script>

<template>
  <div
    class="val-image"
    :class="[
      styleClass,
      { 'val-image--preview-enabled': preview }
    ]"
    :style="{ width, height }"
  >
    <img
      :src="src"
      :alt="alt"
      :loading="loading"
      class="val-image__img"
      :class="imageClass"
      :style="imageStyle"
      @click="openPreview"
    />

    <!-- Hover Indicator Mask -->
    <div v-if="preview" class="val-image__mask" @click="openPreview">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </div>

    <!-- Fullscreen Lightbox Modal -->
    <Teleport to="body">
      <transition name="val-image-preview-fade">
        <div
          v-if="isPreviewOpen"
          class="val-image-lightbox"
          @click="closePreview"
        >
          <!-- Lightbox Toolbar -->
          <div class="val-image-lightbox__toolbar" @click.stop>
            <button type="button" class="val-image-lightbox__btn" title="Rotar Izquierda" @click="rotateLeft">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <polyline points="3 3 3 8 8 8" />
              </svg>
            </button>

            <button type="button" class="val-image-lightbox__btn" title="Rotar Derecha" @click="rotateRight">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <polyline points="21 3 21 8 16 8" />
              </svg>
            </button>

            <button type="button" class="val-image-lightbox__btn" title="Zoom In" @click="zoomIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            <button type="button" class="val-image-lightbox__btn" title="Zoom Out" @click="zoomOut">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            <button type="button" class="val-image-lightbox__btn val-image-lightbox__btn--close" title="Cerrar" @click="closePreview">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Previewed Image -->
          <div class="val-image-lightbox__container" @click.stop>
            <img
              :src="src"
              :alt="alt"
              class="val-image-lightbox__img"
              :style="{
                transform: `scale(${zoomScale}) rotate(${rotation}deg)`
              }"
            />
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.val-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: var(--radius-md, 8px);
  vertical-align: middle;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &--preview-enabled {
    cursor: pointer;

    &:hover .val-image__mask {
      opacity: 1;
    }
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
}

.val-image-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  &__toolbar {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.375rem 0.625rem;
    border-radius: 9999px;
    backdrop-filter: blur(4px);
    z-index: 10;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: transparent;
    border: none;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }

  &__container {
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
  }
}

.val-image-preview-fade-enter-active,
.val-image-preview-fade-leave-active {
  transition: opacity 0.2s ease;
}

.val-image-preview-fade-enter-from,
.val-image-preview-fade-leave-to {
  opacity: 0;
}
</style>
