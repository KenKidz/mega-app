<template>
  <div class="auth-layout">
    <div class="absolute top-0 right-2">
      <ThemeToggle />
    </div>
    <div class="background" aria-hidden="true">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
    </div>
    <UCard class="w-full max-w-[450px] p-4 md:p-6 mx-4 auth-card bg-base">
      <!-- Animated background elements -->
      <div class="card-bg-effect"></div>
      <div class="card-particle particle1"></div>
      <div class="card-particle particle2"></div>
      <div class="card-particle particle3"></div>
      <div class="card-particle particle4"></div>
      <div class="card-particle particle5"></div>
      <div class="card-particle particle6"></div>
      <slot />
    </UCard>
  </div>
</template>

<script setup lang="ts">
useHead({
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  ],
});
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 1rem 0;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--surface-0) 0%, var(--surface-2) 100%);
  z-index: -1;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  opacity: 0.6;
  border-radius: 40%;
  background-color: rgba(77, 155, 255, 0.3);
  bottom: -90%;
  left: -50%;
  animation: wave 18s infinite linear;
}

.wave1 {
  animation: wave 25s infinite linear;
  background-color: rgba(32, 119, 239, 0.2);
}

.wave2 {
  animation: wave 20s infinite linear;
  background-color: rgba(77, 155, 255, 0.3);
  animation-delay: -5s;
}

.wave3 {
  animation: wave 17s infinite linear;
  background-color: rgba(142, 189, 255, 0.4);
  animation-delay: -2s;
}

.wave4 {
  animation: wave 15s infinite linear;
  background-color: rgba(188, 218, 255, 0.3);
  animation-delay: -8s;
}

@keyframes wave {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Login/Register Card styling */
:deep(.login-card),
:deep(.register-card),
.auth-card {
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

:deep(.card-bg-effect) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  background: radial-gradient(
      circle at 10% 20%,
      rgba(59, 130, 246, 0.07) 0%,
      rgba(0, 0, 0, 0) 30%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(59, 130, 246, 0.07) 0%,
      rgba(0, 0, 0, 0) 30%
    ),
    linear-gradient(
      135deg,
      rgba(219, 234, 254, 0.15) 0%,
      rgba(147, 197, 253, 0.15) 100%
    );
  opacity: 0.8;
}

:deep(.card-particle) {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  opacity: 0.45;
  pointer-events: none;
  filter: blur(1px);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}

:deep(.particle1) {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  top: 30px;
  left: 20px;
  animation: float-slow 7s ease-in-out infinite;
}

:deep(.particle2) {
  width: 25px;
  height: 25px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  top: 70%;
  right: 15%;
  animation: float-slow 8s ease-in-out infinite 1s;
}

:deep(.particle3) {
  width: 15px;
  height: 15px;
  background: linear-gradient(135deg, #93c5fd, #bfdbfe);
  bottom: 20%;
  left: 10%;
  animation: float-reverse 9s ease-in-out infinite 0.5s;
}

:deep(.particle4) {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #60a5fa, #93c5fd);
  top: 60px;
  right: 30px;
  animation: float-slow 10s ease-in-out infinite 2s;
}

:deep(.particle5) {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  bottom: 40px;
  right: 25%;
  animation: float-reverse 12s ease-in-out infinite 1.5s;
}

:deep(.particle6) {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
  top: 40%;
  left: 15%;
  animation: float-slow 15s ease-in-out infinite 3s;
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-15px) translateX(10px);
  }
  50% {
    transform: translateY(5px) translateX(15px);
  }
  75% {
    transform: translateY(10px) translateX(-5px);
  }
}

@keyframes float-reverse {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(10px) translateX(-10px);
  }
  50% {
    transform: translateY(-5px) translateX(-15px);
  }
  75% {
    transform: translateY(-10px) translateX(5px);
  }
}

/* Add decorative corners to match screenshot */
:deep(.login-card)::before,
:deep(.login-card)::after,
:deep(.register-card)::before,
:deep(.register-card)::after,
.auth-card::before,
.auth-card::after {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(191, 219, 254, 0.5);
  filter: blur(20px);
  z-index: -1;
}

:deep(.login-card)::before,
:deep(.register-card)::before,
.auth-card::before {
  top: 10px;
  left: 10px;
  animation: pulse 8s infinite alternate;
}

:deep(.login-card)::after,
:deep(.register-card)::after,
.auth-card::after {
  bottom: 10px;
  right: 10px;
  animation: pulse 8s infinite alternate-reverse;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* Responsive styles */
@media (max-width: 640px) {
  :deep(.card-particle) {
    /* Reduce animation intensity on small screens */
    opacity: 0.3;
  }

  :deep(.particle1),
  :deep(.particle2),
  :deep(.particle4) {
    /* Hide some particles on small screens for better performance */
    display: none;
  }

  .wave {
    /* Adjust wave animation for better performance on mobile */
    animation-duration: 25s;
  }
}

/* Landscape mode on mobile devices */
@media (max-height: 600px) and (orientation: landscape) {
  .auth-layout {
    padding: 2rem 0;
  }

  :deep(.login-card),
  :deep(.register-card),
  .auth-card {
    max-height: 85vh;
    overflow-y: auto;
  }

  .wave {
    /* Reduce wave visibility on landscape mode */
    opacity: 0.4;
  }
}
</style>
