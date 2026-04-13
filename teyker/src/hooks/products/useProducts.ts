"use client";

import { useState, useEffect } from "react";
import { Product, FilterOptions } from "@/types";
import supabase from "@/lib/supabase";

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export const useProducts = (
  filters?: FilterOptions,
  pageSize: number = 12,
): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from("productos").select("*", { count: "exact" });

      if (filters?.categoria) {
        query = query.eq("categoria", filters.categoria);
      }

      if (filters?.precio_min) {
        query = query.gte("precio", filters.precio_min);
      }

      if (filters?.precio_max) {
        query = query.lte("precio", filters.precio_max);
      }

      if (filters?.busqueda) {
        query = query.ilike("nombre", `%${filters.busqueda}%`);
      }

      switch (filters?.ordenar_por) {
        case "precio_asc":
          query = query.order("precio", { ascending: true });
          break;
        case "precio_desc":
          query = query.order("precio", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error: queryError } = await query.range(from, to);

      if (queryError) throw queryError;

      setProducts(data || []);
      if (count) {
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar productos",
      );
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  return {
    products,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    refetch: fetchProducts,
  };
};

export const useProductDetail = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const { data, error: queryError } = await supabase
          .from("productos")
          .select("*")
          .eq("id", productId)
          .single();

        if (queryError) throw queryError;

        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar producto",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        const { data, error: queryError } = await supabase
          .from("productos")
          .select("categoria")
          .not("categoria", "is", null);

        if (queryError) throw queryError;

        const unique = Array.from(
          new Set(data?.map((item: { categoria: string }) => item.categoria)),
        ) as string[];

        setCategories(unique.sort());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar categorías",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
