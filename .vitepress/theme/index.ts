import { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import Layout from "./Layout.vue";
import StackAnatomy from "./StackAnatomy.vue";
import "./kami.css";
import "./resume.css";
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("StackAnatomy", StackAnatomy);
  },
} satisfies Theme;
