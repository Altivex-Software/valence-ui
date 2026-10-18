<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export interface GalleriaItem {
  itemImageSrc: string;
  thumbnailImageSrc?: string;
  alt?: string;
  title?: string;
  [key: string]: any;
}

export interface GalleriaResponsiveOption {
  breakpoint: string;
  numVisible: number;
}

export interface GalleriaProps {
  value?: GalleriaItem[];
  activeIndex?: number;
  numVisible?: number;
  responsiveOptions?: GalleriaResponsiveOption[];
  showItemNavigators?: boolean;
  showItemNavigatorsOnHover?: boolean;
  showThumbnails?: boolean;
  showThumbnailNavigators?: boolean;
  thumbnailsPosition?: 'bottom' | 'top' | 'left' | 'right';
  showIndicators?: boolean;
  showIndicatorsOnItem?: boolean;
  showCaption?: boolean;
  circular?: boolean;
  autoPlay?: boolean;
  transitionInterval?: number;
  containerStyle?: string;
  containerClass?: string;
}

const props = withDefaults(defineProps<GalleriaProps>(), {
  value: () => [],
  activeIndex: 0,
  numVisible: 5,
  responsiveOptions: () => [],
  showItemNavigators: false,
  showItemNavigatorsOnHover: false,
  showThumbnails: true,
  showThumbnailNavigators: true,
  thumbnailsPosition: 'bottom',
  showIndicators: false,
  showIndicatorsOnItem: false,
  showCaption: false,
  circular: true,
  autoPlay: false,
  transitionInterval: 4000,
  containerStyle: '',
  containerClass: ''
});

const emit = defineEmits<{
  (e: 'update:activeIndex', index: number): void;
}>();

const internalIndex = ref(props.activeIndex);
let timer: number | null = null;

watch(() => props.activeIndex, (newVal) => {
  internalIndex.value = newVal;
});

const currentItem = computed(() => {
  if (!props.value || props.value.length === 0) return null;
  return props.value[internalIndex.value] || props.value[0];
});

function setIndex(index: number) {
  if (index >= 0 && index < props.value.length) {
    internalIndex.value = index;
    emit('update:activeIndex', index);
  }
}

function prev() {
  if (internalIndex.value > 0) {
    setIndex(internalIndex.value - 1);
  } else if (props.circular) {
    setIndex(props.value.length - 1);
  }
}

function next() {
  if (internalIndex.value < props.value.length - 1) {
    setIndex(internalIndex.value + 1);
  } else if (props.circular) {
    setIndex(0);
  }
}

function startAutoPlay() {
  if (props.autoPlay && props.transitionInterval > 0) {
    stopAutoPlay();
    timer = window.setInterval(() => {
      next();
    }, props.transitionInterval);
  }
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div
    class="val-galleria"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <!-- Main Display Viewport -->
    <div class="val-galleria-item-container">
      <!-- Prev Button -->
      <button
        type="button"
        class="val-galleria-nav val-galleria-nav-prev"
        aria-label="Imagen previa"
        @click="prev"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- Main Item Preview -->
      <div v-if="currentItem" class="val-galleria-item-wrapper">
        <slot name="item" :item="currentItem">
          <img
            :src="currentItem.itemImageSrc"
            :alt="currentItem.alt || ''"
            class="val-galleria-image"
          />
        </slot>

        <!-- Caption Overlay -->
        <div v-if="currentItem.title || $slots.caption" class="val-galleria-caption">
          <slot name="caption" :item="currentItem">
            <h4 class="val-galleria-caption-title">{{ currentItem.title }}</h4>
            <p v-if="currentItem.alt" class="val-galleria-caption-desc">{{ currentItem.alt }}</p>
          </slot>
        </div>
      </div>

      <!-- Next Button -->
      <button
        type="button"
        class="val-galleria-nav val-galleria-nav-next"
        aria-label="Imagen siguiente"
        @click="next"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <!-- Thumbnail Strip -->
    <div v-if="showThumbnails && value.length > 1" class="val-galleria-thumbnail-strip">
      <div
        v-for="(item, idx) in value"
        :key="idx"
        class="val-galleria-thumbnail-item"
        :class="{ 'val-galleria-thumbnail-item--active': idx === internalIndex }"
        @click="setIndex(idx)"
      >
        <slot name="thumbnail" :item="item" :index="idx">
          <img
            :src="item.thumbnailImageSrc || item.itemImageSrc"
            :alt="item.alt || ''"
            class="val-galleria-thumbnail-img"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.val-galleria {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  &-item-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f172a;
    width: 100%;
    min-height: 280px;
    max-height: 480px;
    overflow: hidden;
  }

  &-item-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-image {
    max-width: 100%;
    max-height: 380px;
    object-fit: contain;
    display: block;
    user-select: none;
  }

  &-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border: none;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: translateY(-50%) scale(1.1);
    }

    &-prev {
      left: 1rem;
    }

    &-next {
      right: 1rem;
    }
  }

  &-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
    color: #ffffff;
    padding: 1.5rem 1rem 0.75rem;

    &-title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 600;
    }

    &-desc {
      margin: 0.25rem 0 0;
      font-size: 0.8125rem;
      opacity: 0.85;
    }
  }

  &-thumbnail-strip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    overflow-x: auto;
  }

  &-thumbnail-item {
    width: 56px;
    height: 42px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.6;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      opacity: 0.9;
    }

    &--active {
      opacity: 1;
      border-color: var(--val-primary, #3b82f6);
      transform: scale(1.05);
    }
  }

  &-thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>
