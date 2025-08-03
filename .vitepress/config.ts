import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kndwin",
  description: "kndwin's blog",
  themeConfig: {
    lastUpdated: { text: "" },
    search: { provider: "local" },
    outline: 2,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Blog", link: "/2025/08-03" },
      { text: "Resume", link: "/resume.html" },
    ],

    sidebar: generateSidebar({
      useTitleFromFrontmatter: true,
      excludeFilesByFrontmatterFieldName: "exclude",
      manualSortFileNameByPriority: ["2025", "2024"],
    }),
  },
});
