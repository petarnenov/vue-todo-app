<template>
  <section class="empty-state" aria-label="Empty todo state">
    <h2>No todos yet</h2>
    <p>Add your first task above to start building your list.</p>
  </section>
</template>

<style scoped>
.empty-state {
  background: var(--color-surface-muted);
  border: 1px dashed var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

h2 {
  margin: 0 0 0.5rem;
}

p {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
