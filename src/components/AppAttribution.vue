<script setup lang="ts">
const ATTRIBUTION_EYEBROW = 'powered by'
const ATTRIBUTION_BRAND = 'Arguslog.org'
const ATTRIBUTION_HREF = 'https://arguslog.org'
const ATTRIBUTION_ARIA_LABEL = 'powered by Arguslog.org (opens in a new tab)'
</script>

<template>
  <div class="app-attribution">
    <a
      class="app-attribution__link"
      :aria-label="ATTRIBUTION_ARIA_LABEL"
      :href="ATTRIBUTION_HREF"
      rel="noopener noreferrer"
      target="_blank"
    >
      <span class="app-attribution__eyebrow">{{ ATTRIBUTION_EYEBROW }}</span>
      <span class="app-attribution__brand">{{ ATTRIBUTION_BRAND }}</span>
    </a>
  </div>
</template>

<style scoped>
.app-attribution {
  display: flex;
  justify-content: center;
}

.app-attribution__link {
  align-items: center;
  background:
    linear-gradient(
      135deg,
      var(--color-surface) 0%,
      var(--color-attribution-surface) 58%,
      var(--color-accent-soft) 100%
    );
  border: 1px solid var(--color-attribution-border);
  border-radius: 999px;
  box-shadow: var(--shadow-attribution);
  color: var(--color-text);
  display: inline-flex;
  gap: 0.625rem;
  justify-content: center;
  line-height: 1;
  max-width: 100%;
  overflow: hidden;
  padding: 0.75rem 1rem;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.app-attribution__link::before {
  background: linear-gradient(120deg, transparent 20%, rgb(255 255 255 / 0.7) 50%, transparent 80%);
  content: '';
  inset: 0;
  opacity: 0.85;
  position: absolute;
  transform: translateX(-70%);
  transition: transform 220ms ease;
}

.app-attribution__link:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-attribution-hover);
  transform: translateY(-1px);
}

.app-attribution__link:hover::before {
  transform: translateX(70%);
}

.app-attribution__link:focus-visible {
  border-color: var(--color-accent-strong);
  box-shadow:
    var(--shadow-attribution-hover),
    0 0 0 3px var(--color-surface),
    0 0 0 5px var(--color-accent-soft);
  outline: none;
}

.app-attribution__link:active {
  box-shadow: var(--shadow-attribution);
  transform: translateY(0);
}

.app-attribution__eyebrow,
.app-attribution__brand {
  position: relative;
  z-index: 1;
}

.app-attribution__eyebrow {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.app-attribution__brand {
  font-size: 0.9375rem;
  font-weight: 800;
}

@media (max-width: 420px) {
  .app-attribution__link {
    flex-wrap: wrap;
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-attribution__link,
  .app-attribution__link::before {
    transition: none;
  }
}
</style>
