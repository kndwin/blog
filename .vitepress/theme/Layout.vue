<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'

import { useData } from 'vitepress'
import { computed } from 'vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

interface BlogFrontmatter {
  title?: string
  date?: string
  author?: string
  tags?: string[]
  layout?: string
}

const formattedDate = computed(() => {
  const fm = frontmatter.value as BlogFrontmatter
  if (!fm.date) return ''

  const date = new Date(fm.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

</script>

<template>
  <Layout>
    <template #doc-before>
      <h1 class="blog-post-title">{{ frontmatter.title }}</h1>
      <time 
        v-if="frontmatter.date" 
        class="blog-post-date" 
        :datetime="frontmatter.date"
      >
        {{ formattedDate }}
      </time>
    </template>
  </Layout>
</template>

<style scoped>
.blog-post-title {
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}
.blog-post-date {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
