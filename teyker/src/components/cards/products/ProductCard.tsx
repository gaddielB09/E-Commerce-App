"use client";

import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const discount =
    product.precio_original && product.precio_original > product.precio
      ? Math.round(
          ((product.precio_original - product.precio) /
            product.precio_original) *
            100,
        )
      : null;

  return (
    <div className="card overflow-hidden group h-full flex flex-col">
      {" "}
      <div className="relative overflow-hidden bg-gray-100 h-48 sm:h-56">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            -{discount}%
          </div>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            Solo {product.stock} disponibles
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {" "}
        <span className="text-xs text-primary-gray uppercase tracking-wider font-medium mb-1">
          {product.categoria}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-primary-blue transition-colors">
          {product.nombre}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-primary-gray">
            ({product.resenas_count})
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 group-hover:line-clamp-none transition-all">
          {product.descripcion}
        </p>
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary-blue">
              $
              {product.precio.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

            {product.precio_original && (
              <span className="text-sm text-gray-400 line-through">
                $
                {product.precio_original.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        </div>
        <div className="mb-4 text-xs">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">Disponible</span>
          ) : (
            <span className="text-red-600 font-medium">Agotado</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Agregar al carrito</span>
          <span className="sm:hidden">Agregar</span>
        </button>
      </div>
    </div>
  );
};
