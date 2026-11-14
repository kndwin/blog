import type { Theme } from "vitepress";

import Paper from "./Paper.vue";
import "./paper.css";

// A single landing page typeset like a LaTeX paper; no default-theme chrome.
export default {
  Layout: Paper,
} satisfies Theme;
