<template>
  <Teleport to="body">
    <Transition name="cf-overlay">
      <div v-if="store.show" class="cf-overlay" @click.self="store.cancel()">
        <Transition name="cf-box">
          <div v-if="store.show" class="cf-box" :class="`cf--${store.type}`">
            <div class="cf-scanline" />
            <div class="cf-topline" />

            <div class="cf-icon-wrap">
              <component :is="currentIcon" :size="24" />
            </div>

            <p class="cf-title">{{ store.title }}</p>
            <p class="cf-msg">{{ store.message }}</p>

            <div class="cf-btns">
              <button class="cf-btn cf-btn-cancel" @click="store.cancel()">
                {{ store.cancelText }}
              </button>
              <button class="cf-btn cf-btn-confirm" @click="store.confirm()">
                {{ store.confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Trash2, AlertTriangle, Info } from 'lucide-vue-next'
import { useConfirmStore } from '@/stores'

const store = useConfirmStore()

const iconMap = { danger: Trash2, warning: AlertTriangle, info: Info }
const currentIcon = computed(() => iconMap[store.type] ?? Info)
</script>

<style>
/* 直接把预览里的 CSS 整体复制过来，去掉 scoped */
/* ===== Dark Confirm ===== */

.cf-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.cf-box {
  width: 300px;
  border-radius: 18px;
  border: 0.5px solid;
  position: relative;
  overflow: hidden;
  padding: 28px 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 顶部扫光 */
.cf-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, var(--glow-soft) 0%, transparent 100%);
  pointer-events: none;
  animation: scanline 3s linear infinite;
  opacity: 0.12;
}

/* 顶部边框发光线 */
.cf-topline {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: borderGlow 2s ease infinite;
}

.cf-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: var(--icon-bg);
  animation: iconPulse 2.5s ease infinite;
  position: relative;
  z-index: 1;
}

.cf-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--title);
  margin: 0 0 8px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cf-msg {
  font-size: 13px;
  color: var(--msg);
  text-align: center;
  line-height: 1.6;
  margin: 0 0 22px;
  position: relative;
  z-index: 1;
}

.cf-btns {
  display: flex;
  gap: 10px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.cf-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 0.5px solid;
  transition: all 0.15s;
  letter-spacing: 0.02em;
}

.cf-btn-cancel {
  background: transparent;
  border-color: #2a2a35;
  color: #666;
}
.cf-btn-cancel:hover {
  background: #1a1a22;
  color: #999;
  border-color: #3a3a45;
}

.cf-btn-confirm {
  border-color: var(--accent);
  color: var(--title);
  background: var(--btn-bg);
}
.cf-btn-confirm:hover {
  filter: brightness(1.15);
}
.cf-btn-confirm:active {
  transform: scale(0.97);
}

/* ===== 类型配色 ===== */

.cf--danger {
  background: #110a0a;
  border-color: #3d1a1a;
  --accent: #c44040;
  --glow: rgba(196, 64, 64, 0.35);
  --glow-soft: rgba(196, 64, 64, 1);
  --title: #f87171;
  --msg: #8a4545;
  --btn-bg: rgba(196, 64, 64, 0.12);
  --icon-bg: rgba(196, 64, 64, 0.1);
  --icon-color: #f87171;
}

.cf--warning {
  background: #110f07;
  border-color: #3d3010;
  --accent: #c28200;
  --glow: rgba(194, 130, 0, 0.35);
  --glow-soft: rgba(194, 130, 0, 1);
  --title: #fbbf24;
  --msg: #8a6a20;
  --btn-bg: rgba(194, 130, 0, 0.12);
  --icon-bg: rgba(194, 130, 0, 0.1);
  --icon-color: #fbbf24;
}

.cf--info {
  background: #080e1a;
  border-color: #1a2a4a;
  --accent: #2060cc;
  --glow: rgba(32, 96, 204, 0.35);
  --glow-soft: rgba(32, 96, 204, 1);
  --title: #60a5fa;
  --msg: #2a4a7a;
  --btn-bg: rgba(32, 96, 204, 0.12);
  --icon-bg: rgba(32, 96, 204, 0.1);
  --icon-color: #60a5fa;
}

/* ===== 动画 ===== */

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(400%);
  }
}

@keyframes borderGlow {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes iconPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 var(--glow);
  }
  50% {
    box-shadow: 0 0 18px 4px var(--glow);
  }
}

/* ===== Transition ===== */

.cf-overlay-enter-active {
  animation: overlayIn 0.2s ease forwards;
}
.cf-overlay-leave-active {
  animation: overlayOut 0.2s ease forwards;
}

.cf-box-enter-active {
  animation: cfIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.cf-box-leave-active {
  animation: cfOut 0.2s ease forwards;
}

@keyframes overlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes overlayOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes cfIn {
  0% {
    opacity: 0;
    transform: scale(0.88) translateY(16px);
    filter: blur(6px);
  }
  70% {
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes cfOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.93) translateY(8px);
    filter: blur(4px);
  }
}
</style>
