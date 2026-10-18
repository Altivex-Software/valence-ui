<script setup lang="ts">
export interface TimelineItem {
  status: string;
  date?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface TimelineProps {
  value?: TimelineItem[];
  layout?: 'vertical' | 'horizontal';
}

withDefaults(defineProps<TimelineProps>(), {
  value: () => [],
  layout: 'vertical'
});
</script>

<template>
  <div
    class="val-timeline"
    :class="{ 'val-timeline-horizontal': layout === 'horizontal' }"
  >
    <div
      v-for="(item, index) in value"
      :key="item.status + index"
      class="val-timeline-event"
    >
      <!-- Opposite content (e.g. date) -->
      <div class="val-timeline-event-opposite">
        <slot name="opposite" :item="item" :index="index">
          <span class="val-timeline-date">{{ item.date }}</span>
        </slot>
      </div>

      <!-- Separator with marker and connector -->
      <div class="val-timeline-event-separator">
        <div
          class="val-timeline-event-marker"
          :style="{ backgroundColor: item.color || 'var(--val-primary, #0066ff)' }"
        >
          <slot name="marker" :item="item" :index="index">
            <span v-if="item.icon" class="val-timeline-icon">
              <i :class="item.icon"></i>
            </span>
            <span v-else class="val-timeline-marker-dot"></span>
          </slot>
        </div>

        <div
          v-if="index < value.length - 1"
          class="val-timeline-event-connector"
        ></div>
      </div>

      <!-- Main Content -->
      <div class="val-timeline-event-content">
        <slot name="content" :item="item" :index="index">
          <div class="val-timeline-status">{{ item.status }}</div>
          <div v-if="item.description" class="val-timeline-description">
            {{ item.description }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.val-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: var(--font-primary, 'Manrope', sans-serif);
  box-sizing: border-box;

  &-event {
    display: flex;
    position: relative;
    min-height: 70px;

    &-opposite {
      flex: 1;
      padding: 0 1rem;
      text-align: right;
      font-size: 0.8125rem;
      color: #64748b;
    }

    &-separator {
      flex: 0;
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    &-marker {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 0.875rem;
      z-index: 1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    &-connector {
      width: 2px;
      flex-grow: 1;
      background: #e2e8f0;
      min-height: 1.5rem;
    }

    &-content {
      flex: 1;
      padding: 0 1rem;
    }
  }

  &-marker-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffffff;
  }

  .val-timeline-status {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
  }

  .val-timeline-description {
    font-size: 0.8125rem;
    color: #64748b;
    margin-top: 2px;
    line-height: 1.4;
  }

  // Horizontal Layout
  &-horizontal {
    flex-direction: row;

    .val-timeline-event {
      flex-direction: column;
      flex: 1;
      min-height: auto;

      &-opposite {
        text-align: center;
        padding: 0 0 0.5rem 0;
      }

      &-separator {
        flex-direction: row;
        width: 100%;
      }

      &-connector {
        height: 2px;
        width: 100%;
        min-height: auto;
      }

      &-content {
        text-align: center;
        padding: 0.5rem 0 0 0;
      }
    }
  }
}
</style>
