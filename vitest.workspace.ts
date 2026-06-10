import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "unit",
      include: ["test/unit/**/*.test.ts"],
      environment: "node",
    },
  },
  {
    test: {
      name: "integration",
      include: ["test/integration/**/*.test.ts"],
      environment: "node",
      // Integration tests hit the live ODPT API and need a real network +
      // ODPT_ACCESS_TOKEN. Give them a generous timeout.
      testTimeout: 30_000,
      hookTimeout: 30_000,
    },
  },
]);
