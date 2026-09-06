import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { DBData, Order, Product, Category } from "@/lib/types";
import { seedProducts, seedCategories } from "@/data/seed";
import { DATA_DIR } from "@/lib/paths";

const DB_FILE = path.join(DATA_DIR, "db.json");

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function readDB(): Promise<DBData> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as DBData;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const seed: DBData = {
      products: seedProducts,
      categories: seedCategories,
      orders: [],
    };
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
    return clone(seed);
  }
}

async function writeDB(db: DBData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

export async function getProducts(): Promise<Product[]> {
  const db = await readDB();
  return clone(db.products);
}

export async function getCategories(): Promise<Category[]> {
  const db = await readDB();
  return clone(db.categories);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readDB();
  const product = db.products.find((p) => p.id === id || p.slug === id);
  return product ? clone(product) : null;
}

export async function getOrders(): Promise<Order[]> {
  const db = await readDB();
  return clone(db.orders);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await readDB();
  const order = db.orders.find((o) => o.id === id);
  return order ? clone(order) : null;
}

export async function insertProduct(product: Product): Promise<void> {
  const db = await readDB();
  db.products.unshift(product);
  await writeDB(db);
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | null> {
  const db = await readDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...patch, id };
  await writeDB(db);
  return clone(db.products[index]);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.products.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function insertCategory(category: Category): Promise<void> {
  const db = await readDB();
  db.categories.push(category);
  await writeDB(db);
}

export async function updateCategory(
  id: string,
  patch: Partial<Category>
): Promise<Category | null> {
  const db = await readDB();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...patch, id };
  await writeDB(db);
  return clone(db.categories[index]);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await readDB();
  const used = db.products.some((p) => p.categoryId === id);
  if (used) return false;
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return false;
  db.categories.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function insertOrder(order: Order): Promise<void> {
  const db = await readDB();
  db.orders.unshift(order);
  await writeDB(db);
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const db = await readDB();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.orders[index] = { ...db.orders[index], ...patch, id };
  await writeDB(db);
  return clone(db.orders[index]);
}