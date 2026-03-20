<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.show" class="toast-wrapper" :class="bgClass">
        <component :is="currentIcon" class="toast-icon" />
        <div class="toast-body">
          <span class="toast-title">{{ toast.title }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click="toast.close()">
          <XIcon :size="14" />
        </button>
        <div class="toast-progress" :style="{ animationDuration: `${toast.duration}ms` }" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores'
import { CheckCircle, XCircle, AlertTriangle, Info, X as XIcon } from 'lucide-vue-next'

const toast = useToastStore()

// 替换原来的 bgClass
const bgClass = computed(() => ({
  'dk--success': toast.type === 'success',
  'dk--error': toast.type === 'error',
  'dk--warning': toast.type === 'warning',
  'dk--info': toast.type === 'info',
}))

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}
const currentIcon = computed(() => iconMap[toast.type] ?? CheckCircle)
</script>

<style scoped>
/* ===== Dark Toast ===== */
.toast-wrapper {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 15px 14px;
  border-radius: 14px;
  border: 0.5px solid;
  min-width: 250px;
  max-width: 320px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 1px 4px rgba(0, 0, 0, 0.3);
}

.toast-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  opacity: 0.6;
}

/* 类型配色 */
.dk--success {
  background: #0e1a13;
  border-color: #1e3d28;
  --t: #6ee89a;
  --m: #4db870;
  --bar: #3da85e;
}
.dk--success::before {
  background: linear-gradient(90deg, transparent, #3da85e, transparent);
}

.dk--error {
  background: #1a0e0e;
  border-color: #3d1e1e;
  --t: #f87171;
  --m: #d95555;
  --bar: #c44040;
}
.dk--error::before {
  background: linear-gradient(90deg, transparent, #c44040, transparent);
}

.dk--warning {
  background: #1a1508;
  border-color: #3d3010;
  --t: #fbbf24;
  --m: #d4960a;
  --bar: #c28200;
}
.dk--warning::before {
  background: linear-gradient(90deg, transparent, #c28200, transparent);
}

.dk--info {
  background: #0a1020;
  border-color: #1a2a4a;
  --t: #60a5fa;
  --m: #4080e0;
  --bar: #2060cc;
}
.dk--info::before {
  background: linear-gradient(90deg, transparent, #2060cc, transparent);
}

/* 内部元素 */
.toast-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--t);
}

.toast-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--t);
  line-height: 1.35;
}

.toast-msg {
  font-size: 12px;
  color: var(--m);
  line-height: 1.5;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--t);
  opacity: 0.3;
  padding: 0;
  line-height: 1;
  transition: opacity 0.15s;
  margin-top: 2px;
}
.toast-close:hover {
  opacity: 0.7;
}

/* 进度条 */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1.5px;
  width: 100%;
  background: var(--bar);
  animation: barShrink linear forwards;
}

@keyframes barShrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 入场 / 离场 */
.toast-enter-active {
  animation: darkToastIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.toast-leave-active {
  animation: darkToastOut 0.2s ease forwards;
}

@keyframes darkToastIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-16px) scale(0.93);
    filter: blur(4px);
  }
  60% {
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes darkToastOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px) scale(0.96);
    filter: blur(2px);
  }
}
</style>
