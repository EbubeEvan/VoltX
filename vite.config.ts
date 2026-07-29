import { defineConfig } from "vite";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

if (!process.env.DATABASE_URL) {
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...rest] = trimmed.split("=");
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  }
}

export default defineConfig({
  plugins: [
    tanstackStart({
      start: { entry: "start" },
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
    nitro(),
  ],
});
