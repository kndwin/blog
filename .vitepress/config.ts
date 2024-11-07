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
        items: [{ text: "Welcome", link: "/content/2024/welcome" }],
      },
    ],
  },
});
