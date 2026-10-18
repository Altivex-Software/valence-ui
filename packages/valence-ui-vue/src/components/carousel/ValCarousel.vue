<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export type CarouselEffect = 'slide' | 'coverflow' | 'perspective' | 'cards' | 'fade';

export interface CarouselResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

export interface CarouselProps {
  value?: any[];
  effect?: CarouselEffect;
  numVisible?: number;
  numScroll?: number;
  responsiveOptions?: CarouselResponsiveOption[];
  orientation?: 'horizontal' | 'vertical';
  verticalViewPortHeight?: string;
  itemWidth?: string;
  circular?: boolean;
  autoplayInterval?: number;
  showNavigators?: boolean;
  showIndicators?: boolean;
  indicatorsContentPosition?: 'bottom' | 'top' | 'left' | 'right';
}

const props = withDefaults(defineProps<CarouselProps>(), {
  value: () => [],
  effect: 'slide',
  numVisible: 1,
  numScroll: 1,
  responsiveOptions: () => [],
  orientation: 'horizontal',
  verticalViewPortHeight: '300px',
  circular: false,
  autoplayInterval: 0,
  showNavigators: true,
  showIndicators: true,
  indicatorsContentPosition: 'bottom'
});

const emit = defineEmits<{
  (e: 'pageChange', page: number): void;
}>();

const currentPage = ref(0);
let timer: number | null = null;

const totalPages = computed(() => {
  if (!props.value || props.value.length === 0) return 0;
  return Math.ceil((props.value.length - props.numVisible + props.numScroll) / props.numScroll);
});

const isFirst = computed(() => currentPage.value === 0);
const isLast = computed(() => currentPage.value >= totalPages.value - 1);

function prev() {
  if (currentPage.value > 0) {
    setPage(currentPage.value - 1);
  } else if (props.circular) {
    setPage(totalPages.value - 1);
  }
}

function next() {
  if (currentPage.value < totalPages.value - 1) {
    setPage(currentPage.value + 1);
  } else if (props.circular) {
    setPage(0);
  }
}

function setPage(page: number) {
  currentPage.value = page;
  emit('pageChange', page);
}

function startAutoplay() {
  if (props.autoplayInterval > 0) {
    stopAutoplay();
    timer = window.setInterval(() => {
      next();
    }, props.autoplayInterval);
  }
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

watch(() => props.autoplayInterval, () => {
  startAutoplay();
});

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <div
    class="val-carousel"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="val-carousel-content">
      <!-- Prev Navigator -->
      <button
        v-if="showNavigators"
        type="button"
        class="val-carousel-prev"
        :disabled="!circular && isFirst"
        aria-label="Página anterior"
        @click="prev"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- Viewport & Track -->
      <div class="val-carousel-viewport">
        <div
          class="val-carousel-track"
          :style="{
            transform: `translateX(-${currentPage * (100 / numVisible) * numScroll}%)`,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }"
        >
          <div
            v-for="(item, index) in value"
            :key="index"
            class="val-carousel-item"
            :style="{ flexBasis: `${100 / numVisible}%`, maxWidth: `${100 / numVisible}%` }"
          >
            <slot :item="item" :index="index">
              <div class="val-carousel-item-fallback">{{ item }}</div>
            </slot>
          </div>
        </div>
      </div>

      <!-- Next Navigator -->
      <button
        v-if="showNavigators"
        type="button"
        class="val-carousel-next"
        :disabled="!circular && isLast"
        aria-label="Página siguiente"
        @click="next"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <!-- Indicators -->
    <div v-if="showIndicators && totalPages > 1" class="val-carousel-indicators">
      <button
        v-for="p in totalPages"
        :key="p - 1"
        type="button"
        class="val-carousel-indicator"
        :class="{ 'val-carousel-indicator--active': (p - 1) === currentPage }"
        :aria-label="`Ir a página ${p}`"
        @click="setPage(p - 1)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.val-carousel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  &-content {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }

  &-viewport {
    overflow: hidden;
    width: 100%;
  }

  &-track {
    display: flex;
    width: 100%;
  }

  &-item {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  &-prev, &-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    color: #475569;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
    flex-shrink: 0;
    z-index: 2;

    &:hover:not(:disabled) {
      background: #f8fafc;
      color: var(--val-primary, #3b82f6);
      border-color: #cbd5e1;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &-prev {
    margin-right: 0.5rem;
  }

  &-next {
    margin-left: 0.5rem;
  }

  &-indicators {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 0 0.25rem;
  }

  &-indicator {
    width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
    border: none;
    background-color: #cbd5e1;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #94a3b8;
    }

    &--active {
      background-color: var(--val-primary, #3b82f6);
      width: 24px;
      border-radius: 5px;
    }
  }
}
</style>
