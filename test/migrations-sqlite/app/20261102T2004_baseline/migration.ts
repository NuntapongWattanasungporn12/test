#!/usr/bin/env -S node
import { Migration, MigrationCLI, col, primaryKey, unique } from '@prisma/orm-sqlite/migration';
import type { Contract as End } from '../../snapshots/3f22fb75f1bd46212345e7b026dbcb0f1a37f0eed6a1bd2aaa67c443542b11c7/contract';
import endContract from '../../snapshots/3f22fb75f1bd46212345e7b026dbcb0f1a37f0eed6a1bd2aaa67c443542b11c7/contract.json' with { type: 'json' };

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        table: 'Book',
        columns: [
          col('author', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('categoryId', 'CHARACTER', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('coverData', 'BLOB', { codecRef: { codecId: 'sqlite/blob@1' } }),
          col('coverType', 'TEXT', { codecRef: { codecId: 'sqlite/text@1' } }),
          col('createdAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('description', 'TEXT', { codecRef: { codecId: 'sqlite/text@1' } }),
          col('id', 'CHARACTER', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('isbn', 'TEXT', { codecRef: { codecId: 'sqlite/text@1' } }),
          col('price', 'REAL', { notNull: true, codecRef: { codecId: 'sqlite/real@1' } }),
          col('publishedYear', 'INTEGER', { codecRef: { codecId: 'sqlite/integer@1' } }),
          col('title', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        table: 'Category',
        columns: [
          col('createdAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('description', 'TEXT', { codecRef: { codecId: 'sqlite/text@1' } }),
          col('id', 'CHARACTER', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('name', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
        ],
        constraints: [primaryKey(['id']), unique(['name'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
