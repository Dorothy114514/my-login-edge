import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index", name: "index" },
    { path: "/docs", component: "docs", name: "docs" },
    { path: "/login", component: "login", name: "login" },
  ],

  npmClient: "pnpm",
  plugins: ["@umijs/plugins/dist/react-query", "@umijs/plugins/dist/dva"],
  reactQuery: {},
  dva: {},
});
