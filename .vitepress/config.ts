import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kndwin",
  description: "kndwin's blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "/content/index" },
    ],

    sidebar: [
      {
        text: "2024",
        collapsed: true,
        items: [{ text: "Welcome", link: "/content/2024/welcome" }],
      },
    ],
  },
});
