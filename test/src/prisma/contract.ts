import { defineContract } from '@prisma/orm-sqlite/contract-builder';

export const contract = defineContract({}, ({ field, model, rel, type }) => {
  // Catalog (หมวดหมู่หนังสือ)
  const Category = model('Category', {
    fields: {
      id: field.id.uuidv7String(),
      name: field.column(type.String()).unique(),
      description: field.column(type.String()).optional(),
      createdAt: field.temporal.createdAt(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  // Book (หนังสือ) — the cover image is stored in the database as bytes
  const Book = model('Book', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.column(type.String()),
      author: field.column(type.String()),
      isbn: field.column(type.String()).optional(),
      price: field.column(type.Float()),
      publishedYear: field.column(type.Int()).optional(),
      description: field.column(type.String()).optional(),
      coverData: field.column(type.Bytes()).optional(),
      coverType: field.column(type.String()).optional(),
      categoryId: field.uuidString(),
      createdAt: field.temporal.createdAt(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  return {
    models: {
      Category: Category.relations({
        books: rel.hasMany(Book, { by: 'categoryId' }),
      }),
      Book: Book.relations({
        category: rel.belongsTo(Category, { from: 'categoryId', to: 'id' }),
      }),
    },
  };
});
