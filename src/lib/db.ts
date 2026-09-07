import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Order, Product, Category } from "@/lib/types";
import { seedProducts, seedCategories } from "@/data/seed";
import { DATA_DIR } from "@/lib/paths";
import { syncCatalogToGit } from "@/lib/gitsync";

const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface CatalogData {
  products: Product[];
  categories: Category[];
}

interface OrdersData {
  orders: Order[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function readOrders(): Promise<OrdersData> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<OrdersData>;
    return { orders: parsed.orders ?? [] };
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const empty: OrdersData = { orders: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(empty, null, 2), "utf8");
    return clone(empty);
  }
}

async function writeOrders(data: OrdersData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function readCatalog(): Promise<CatalogData> {
  try {
    const raw = await fs.readFile(CATALOG_FILE, "utf8");
    return JSON.parse(raw) as CatalogData;
  } catch {
    // On first run: migrate any existing catalog from the legacy db.json
    // (previously products/categories/orders lived in one file) so admin
    // edits made before this change are not lost.
    let migrated: CatalogData | null = null;
    try {
      const raw = await fs.readFile(DB_FILE, "utf8");
      const legacy = JSON.parse(raw) as Partial<CatalogData & OrdersData>;
      if (Array.isArray(legacy.products) || Array.isArray(legacy.categories)) {
        migrated = {
          products: legacy.products ?? seedProducts,
          categories: legacy.categories ?? seedCategories,
        };
      }
    } catch {
      // ignore missing/invalid legacy db
    }

    const seed: CatalogData = migrated ?? {
      products: seedProducts,
      categories: seedCategories,
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CATALOG_FILE, JSON.stringify(seed, null, 2), "utf8");
    return clone(seed);
  }
}

async function writeCatalog(data: CatalogData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CATALOG_FILE, JSON.stringify(data, null, 2), "utf8");
  syncCatalogToGit();
}

export async function getProducts(): Promise<Product[]> {
  const db = await readCatalog();
  return clone(db.products);
}

export async function getCategories(): Promise<Category[]> {
  const db = await readCatalog();
  return clone(db.categories);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readCatalog();
  const product = db.products.find((p) => p.id === id || p.slug === id);
  return product ? clone(product) : null;
}

export async function getOrders(): Promise<Order[]> {
  const db = await readOrders();
  return clone(db.orders);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await readOrders();
  const order = db.orders.find((o) => o.id === id);
  return order ? clone(order) : null;
}

export async function insertProduct(product: Product): Promise<void> {
  const db = await readCatalog();
  db.products.unshift(product);
  await writeCatalog(db);
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<Product | null> {
  const db = await readCatalog();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...patch, id };
  await writeCatalog(db);
  return clone(db.products[index]);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readCatalog();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.products.splice(index, 1);
  await writeCatalog(db);
  return true;
}

export async function insertCategory(category: Category): Promise<void> {
  const db = await readCatalog();
  db.categories.push(category);
  await writeCatalog(db);
}

export async function updateCategory(
  id: string,
  patch: Partial<Category>
): Promise<Category | null> {
  const db = await readCatalog();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...patch, id };
  await writeCatalog(db);
  return clone(db.categories[index]);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await readCatalog();
  const used = db.products.some((p) => p.categoryId === id);
  if (used) return false;
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return false;
  db.categories.splice(index, 1);
  await writeCatalog(db);
  return true;
}

export async function insertOrder(order: Order): Promise<void> {
  const db = await readOrders();
  db.orders.unshift(order);
  await writeOrders(db);
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const db = await readOrders();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.orders[index] = { ...db.orders[index], ...patch, id };
  await writeOrders(db);
  return clone(db.orders[index]);
}