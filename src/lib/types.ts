export type PaymentMethod = "upi";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  mrp?: number;
  description: string;
  sustainability: string[];
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
  badge?: string;
  createdAt: string;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  userId?: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  paymentId?: string;
  verificationToken?: string;
  verificationSentAt?: string;
  verificationVerified?: boolean;
  createdAt: string;
}

export interface DBData {
  products: Product[];
  categories: Category[];
  orders: Order[];
}