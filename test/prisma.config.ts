import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-sqlite/config";

const databasePath = process.env.DATABASE_PATH ?? "./books.db";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: ormConfig({
    contract: "./src/prisma/contract.ts",
    output: "./src/prisma/generated",
    db: {
      connection: databasePath,
    },
    migrations: { dir: "./migrations-sqlite" },
  }),
});
