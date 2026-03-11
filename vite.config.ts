import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    nitro({
      serverDir: "./server",
      experimental: {
        vite: {
          serverReload: true,
        },
      },
      alias: {
        "#prisma": path.resolve("./app/generated/prisma/client.ts"),
      },
    }),
  ],
  resolve: {
    alias: {
      "#prisma": path.resolve("./app/generated/prisma/client.ts"),
    },
  },
});
