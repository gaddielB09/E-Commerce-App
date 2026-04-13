"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types"; 
interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

/**
 * Store global del carrito persistente en localStorage
 */
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product_id === newItem.product_id,
          );

          let updatedItems: CartItem[];
          if (existingItem) {
            updatedItems = state.items.map((item) =>
              item.product_id === newItem.product_id
                ? { ...item, cantidad: item.cantidad + newItem.cantidad }
                : item,
            );
          } else {
            updatedItems = [...state.items, newItem];
          }

          const total = updatedItems.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0,
          );

          return { items: updatedItems, total };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.product_id !== productId,
          );
          const total = updatedItems.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0,
          );
          return { items: updatedItems, total };
        });
      },

      updateQuantity: (productId: string, cantidad: number) => {
        set((state) => {
          if (cantidad <= 0) {
            const updatedItems = state.items.filter(
              (item) => item.product_id !== productId,
            );
            const total = updatedItems.reduce(
              (sum, item) => sum + item.precio * item.cantidad,
              0,
            );
            return { items: updatedItems, total };
          }

          const updatedItems = state.items.map((item) =>
            item.product_id === productId ? { ...item, cantidad } : item,
          );

          const total = updatedItems.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0,
          );
          return { items: updatedItems, total };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      calculateTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0,
        );
      },
    }),
    {
      name: "ecommerce-cart",
      version: 1,
    },
  ),
);
