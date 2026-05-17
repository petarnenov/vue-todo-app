<script setup lang="ts">
defineProps<{
  message: string
  tone: 'error' | 'warning'
}>()
</script>

<template>
  <p
    class="inline-message"
    :class="`inline-message--${tone}`"
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>

<style scoped>
.inline-message {
  border-radius: 0.875rem;
  border: 1px solid transparent;
  margin: 0;
  padding: 0.875rem 1rem;
}

.inline-message--error {
  background: color-mix(in srgb, var(--color-danger) 10%, white);
  border-color: color-mix(in srgb, var(--color-danger) 30%, white);
  color: var(--color-danger);
}

.inline-message--warning {
  background: color-mix(in srgb, var(--color-warning) 16%, white);
  border-color: color-mix(in srgb, var(--color-warning) 35%, white);
  color: var(--color-warning-strong);
}
</style>
