export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original?: number;
  imagen_url: string;
  categoria: string;
  stock: number;
  rating: number;
  resenas_count: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  producto_id: string;
  nombre: string;
  valor: string;
  tipo: "color" | "talla" | "otro";
}

export interface Review {
  id: string;
  producto_id: string;
  usuario_id: string;
  rating: number;
  comentario: string;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  cantidad: number;
  precio: number;
  variantes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface User {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  created_at: string;
}

export interface AuthSession {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  busqueda?: string;
  ordenar_por?: "relevancia" | "precio_asc" | "precio_desc" | "rating";
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: string;
}
