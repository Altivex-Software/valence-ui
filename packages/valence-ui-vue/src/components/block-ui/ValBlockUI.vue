<script setup lang="ts">
import ValProgressSpinner from '../progress-spinner/ValProgressSpinner.vue';

export interface BlockUIProps {
  blocked?: boolean;
  message?: string;
  fullScreen?: boolean;
}

withDefaults(defineProps<BlockUIProps>(), {
  blocked: false,
  message: '',
  fullScreen: false
});
</script>

<template>
  <div class="val-block-ui-container" :class="{ 'val-block-ui--blocked': blocked }">
    <slot />

    <Teleport to="body" :disabled="!fullScreen">
      <transition name="val-block-ui-fade">
        <div
          v-if="blocked"
          class="val-block-ui-overlay"
          :class="{ 'val-block-ui-overlay--fullscreen': fullScreen }"
          role="alert"
          aria-busy="true"
          aria-live="assertive"
        >
          <div class="val-block-ui-content">
            <slot name="message">
              <span v-if="message" class="val-block-ui-message">{{ message }}</span>
              <ValProgressSpinner v-else size="3rem" severity="primary" />
            </slot>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.val-block-ui-container {
  position: relative;
  width: 100%;
}

.val-block-ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  border-radius: inherit;

  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
  }
}

.val-block-ui-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.val-block-ui-message {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

// Fade animation
.val-block-ui-fade-enter-active,
.val-block-ui-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.val-block-ui-fade-enter-from,
.val-block-ui-fade-leave-to {
  opacity: 0;
}
</style>
