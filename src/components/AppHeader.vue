<template>
  <header class="app-header">
    <p class="eyebrow">Vue 3 + Pinia</p>
    <h1>Todo App</h1>
    <p class="description">Track the basics: add, finish, edit, filter, and keep everything saved locally.</p>
  </header>
</template>

<style scoped>
.app-header {
  display: grid;
  gap: 0.75rem;
}

.eyebrow {
  color: var(--color-accent-strong);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.1;
  margin: 0;
}

.description {
  color: var(--color-text-muted);
  margin: 0;
  max-width: 40rem;
}
</style>
