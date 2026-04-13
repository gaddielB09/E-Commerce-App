"use client";

import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/products/useProducts";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCart } from "@/store/useCart";
import { FilterOptions, Product } from "@/types";
import { Navbar } from "@/components/navbar/NavBar";
import { Filters } from "@/components/filters/Filters";
import { ProductCard } from "@/components/cards/products/ProductCard";
import { ProductSkeletonGrid } from "@/components/cards/products/ProductSkeleton";
import { CartModal } from "@/components/modals/cart/CartModal";
import { AuthModal } from "@/components/modals/auth/AuthModal";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const {
    products,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useProducts(filters, 12);

  const { isAuthenticated } = useAuth();
  const cart = useCart();

  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }

    cart.addItem({
      product_id: product.id,
      cantidad: 1,
      precio: product.precio,
    });
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      busqueda: query || undefined,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <section className="bg-gradient-to-r from-primary-black to-blue-900 text-white py-12 sm:py-16">
        <div className="container-app">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Bienvenido a Teyker
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Descubre los mejores productos de tecnología con precios increíbles. Envíos rápidos a todo el país.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-primary-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Explorar Catálogo
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>
      </section>
 
      <main className="container-app py-8 sm:py-12">
        <div className="flex items-center gap-2 text-sm text-primary-gray mb-8">
          <Link href="/" className="hover:text-primary-blue transition-colors">
            Inicio
          </Link>
          <ChevronRight size={16} />
          <span className="text-primary-black">Catálogo</span>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <aside className="lg:col-span-1">
            <Filters onFiltersChange={handleFiltersChange} onSearch={handleSearch} />
          </aside>
 
          <section className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-black mb-2">
                {Object.keys(filters).length > 0 ? 'Resultados de búsqueda' : 'Todos los productos'}
              </h2>
              <p className="text-primary-gray">
                Mostrando {products.length} productos
                {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
              </p>
            </div>
 
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                <p className="font-semibold">Error al cargar productos</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
 
            {isLoading ? (
              <ProductSkeletonGrid />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
 
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:border-primary-blue text-primary-gray hover:text-primary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
 
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                              currentPage === page
                                ? 'bg-primary-blue text-white'
                                : 'border border-gray-300 text-primary-gray hover:border-primary-blue hover:text-primary-blue'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                    </div>
 
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:border-primary-blue text-primary-gray hover:text-primary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-black mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-primary-gray mb-6">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <button
                  onClick={() => {
                    setFilters({})
                    handleSearch('')
                  }}
                  className="btn-primary"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
 
      <footer className="bg-primary-black text-white mt-16">
        <div className="container-app py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-blue rounded flex items-center justify-center text-sm">
                  T
                </div>
                TechStore
              </h3>
              <p className="text-gray-400 text-sm">
                Tu tienda de tecnología de confianza. Productos de calidad con los mejores precios.
              </p>
            </div>
 
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ofertas
                  </a>
                </li>
              </ul>
            </div>
 
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:soporte@techstore.com" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Preguntas frecuentes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos y condiciones
                  </a>
                </li>
              </ul>
            </div>
 
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>
 
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2024 TechStore. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
 
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} products={productsMap} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
