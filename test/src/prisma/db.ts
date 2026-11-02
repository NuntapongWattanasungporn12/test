import sqlite from "@prisma/orm-sqlite/runtime";
import { contractFromJson } from "@prisma/orm-sqlite/static";

import "temporal-polyfill/global";

import type { Contract } from "./generated/contract.d.ts";
import contractJson from "./generated/contract.json" with { type: "json" };

export const contract = contractFromJson<Contract>(contractJson);

export const db = sqlite({
  contract,
  path: process.env.DATABASE_PATH ?? "./books.db",
});
