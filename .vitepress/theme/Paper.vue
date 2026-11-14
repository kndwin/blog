<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useData } from "vitepress";

const { page } = useData();

// Light/dark toggle. With no saved choice the page follows the OS setting.
const dark = ref(false);

function current(): boolean {
  const root = document.documentElement.classList;
  if (root.contains("dark")) return true;
  if (root.contains("light")) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function toggle() {
  const next = current() ? "light" : "dark";
  const root = document.documentElement.classList;
  root.remove("light", "dark");
  root.add(next);
  dark.value = next === "dark";
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

onMounted(() => {
  dark.value = current();
});
</script>

<template>
  <main class="paper">
    <button
      class="theme-toggle"
      type="button"
      :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'"
      :title="dark ? 'Light mode' : 'Dark mode'"
      @click="toggle"
    >
      <svg v-if="dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
    <article v-if="!page.isNotFound" class="sheet">
      <Content />
    </article>
    <article v-else class="sheet">
      <header class="title-block">
        <h1>Erratum</h1>
        <p class="affil">This page is not in the current edition.</p>
        <p class="contact"><a href="/">Return to the paper</a></p>
      </header>
    </article>
  </main>
</template>
