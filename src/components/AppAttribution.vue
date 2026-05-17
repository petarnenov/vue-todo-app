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
  max-width: 100%;
}

.app-attribution__link {
  align-items: center;
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  box-shadow: none;
  color: var(--color-text);
  display: inline-flex;
  gap: 0.375rem;
  justify-content: center;
  line-height: 1;
  max-width: 100%;
  overflow: hidden;
  padding: 0.5rem 0.75rem;
  text-align: center;
  text-decoration: none;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.app-attribution__link:hover {
  border-color: var(--color-accent);
  background: var(--color-attribution-surface);
  transform: translateY(-1px);
}

.app-attribution__link:focus-visible {
  border-color: var(--color-accent-strong);
  box-shadow:
    0 0 0 3px var(--color-surface),
    0 0 0 5px var(--color-accent-soft);
  outline: none;
}

.app-attribution__link:active {
  box-shadow: var(--shadow-attribution);
  transform: translateY(0);
}

.app-attribution__eyebrow {
  color: var(--color-text-muted);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.app-attribution__brand {
  font-size: 0.8125rem;
  font-weight: 800;
}

@media (max-width: 420px) {
  .app-attribution__link {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-attribution__link {
    transition: none;
  }
}
</style>
