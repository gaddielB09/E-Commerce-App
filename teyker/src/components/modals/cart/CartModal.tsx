import React from 'react'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/store/useCart'
import { Product } from '@/types'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  products: Map<string, Product>
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, products }) => {
  const cart = useCart()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      cart.updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    cart.removeItem(productId)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary-black">Carrito de Compras</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart size={32} className="text-primary-gray" />
                </div>
                <p className="text-primary-gray font-medium">Tu carrito está vacío</p>
                <p className="text-xs text-gray-400 mt-1">Explora nuestros productos</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.items.map((item) => {
                const product = products.get(item.product_id)
                return (
                  <div key={item.product_id} className="flex gap-4 pb-4 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product && (
                        <img
                          src={product.imagen_url}
                          alt={product.nombre}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-primary-black line-clamp-2">
                        {product?.nombre}
                      </h4>
                      <p className="text-sm text-primary-blue font-bold mt-1">
                        ${item.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.cantidad - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.cantidad <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.cantidad + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="font-semibold text-primary-black text-sm">
                        ${(item.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="space-y-2 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${cart.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span>Calculado al pagar</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg text-primary-black mb-4">
              <span>Total</span>
              <span>${cart.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <button className="w-full btn-primary">
              Proceder a pagar
            </button>
            <button
              onClick={onClose}
              className="w-full btn-outline"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}

const ShoppingCart: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)