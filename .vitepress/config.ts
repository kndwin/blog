import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kndwin",
  description: "kndwin's blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Blog", link: "/content" },
      { text: "Resume", link: "/content/resume.html" },
    ],

    sidebar: [
      {
        text: "2024",
        collapsed: false,
        items: [
          { text: "Content is king", link: "/content/2024/content-is-king" },
          { text: "Spending time", link: "/content/2024/spending-time" },
          { text: "What to solve", link: "/content/2024/what-to-solve" },
        ],
      },
    ],
  },
});
