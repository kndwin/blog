import { defineConfig } from "vitepress";
import { jobsLayout } from "./jobs-markdown";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kevin Nguyen",
  description: "Kevin Nguyen, product engineer in Sydney: AI decision systems, platforms and infrastructure.",
  cleanUrls: true,
  // resume.md is the source for the CV PDF (bun run resume:pdf), not a page.
  srcExclude: ["resume.md", "assets/**", "scripts/**"],
  markdown: {
    config: (md) => {
      md.use(jobsLayout);
    },
  },
  head: [
    // Apply a saved light/dark choice before first paint (otherwise the OS setting wins).
    [
      "script",
      {},
      `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.classList.add(t)}catch(e){}`,
    ],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Charis+SIL:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  ],
});
