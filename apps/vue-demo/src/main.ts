import "./assets/main.css";
import "../../../packages/ui/dist/style.css";
// @ts-ignore: side-effect import without type declarations
import "../../../packages/ui/dist/web-components.js";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
