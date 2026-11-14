<script setup lang="ts">
import { useData } from "vitepress";

const { page } = useData();
</script>

<template>
  <main class="paper">
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
