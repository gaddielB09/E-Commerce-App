"use client";

import React, { useState } from "react";
import { Menu, X, ShoppingCart, LogOut, LogIn, User, Mail } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/hooks/auth/useAuth";
import Image from "next/image";

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = useCart();
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSupport = () => {
    window.location.href =
      "mailto:soporte@teykersupport.com";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/teykerLogo.ico"
                alt="Teyker Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-bold text-lg text-primary-black hidden sm:inline">
                Teyker
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-primary-gray hover:text-primary-blue transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/"
              className="text-primary-gray hover:text-primary-blue transition-colors font-medium"
            >
              Catálogo
            </Link>
            <button
              onClick={handleSupport}
              className="text-primary-gray hover:text-primary-blue transition-colors font-medium flex items-center gap-2"
            >
              <Mail size={18} />
              Soporte
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSupport}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Mail size={20} className="text-primary-gray" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <ShoppingCart size={20} className="text-primary-gray" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <LogIn size={18} className="text-primary-blue" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3 animate-slide-up">
            <Link href="/" className="block px-4 py-2 hover:bg-gray-100">
              Inicio
            </Link>
            <Link href="/" className="block px-4 py-2 hover:bg-gray-100">
              Catálogo
            </Link>

            <div className="border-t pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-primary-gray">
                    {user?.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
