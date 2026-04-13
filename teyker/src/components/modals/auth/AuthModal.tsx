import React, { useState } from "react";
import { X, Mail, Lock, User, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup";

/**
 * Modal de autenticación
 * Permite login y registro con Supabase Auth
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, error, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setNombre("");
    setLocalError(null);
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email) {
      setLocalError("El correo es requerido");
      return;
    }
    if (!password || password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (mode === "signup" && !nombre) {
      setLocalError("El nombre es requerido");
      return;
    }

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, nombre);
      }
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error de autenticación:", err);
    }
  };

  if (!isOpen) return null;

  const displayError = localError || error;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-primary-black">
              {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {displayError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle
                  size={18}
                  className="text-red-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3 text-primary-gray"
                    />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre"
                      className="input-field pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-3 text-primary-gray"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="input-field pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3 text-primary-gray"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                    disabled={isLoading}
                  />
                </div>
                {mode === "signup" && (
                  <p className="text-xs text-primary-gray mt-1">
                    Mínimo 6 caracteres
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader size={18} className="animate-spin" />}
                <span>
                  {isLoading
                    ? "Procesando..."
                    : mode === "login"
                      ? "Inicia sesión"
                      : "Crear cuenta"}
                </span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-primary-gray mb-3">
                {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              </p>
              <button
                onClick={() =>
                  handleModeSwitch(mode === "login" ? "signup" : "login")
                }
                disabled={isLoading}
                className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === "login" ? "Crear cuenta" : "Inicia sesión"}
              </button>
            </div>

            <p className="text-xs text-primary-gray text-center mt-4">
              Al {mode === "login" ? "ingresar" : "registrarte"}, aceptas
              nuestros{" "}
              <a href="#" className="text-primary-blue hover:underline">
                términos de servicio
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
