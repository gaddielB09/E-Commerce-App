import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { FilterOptions } from "@/types";
import { useCategories } from "@/hooks/products/useProducts";

interface FiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onSearch: (query: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  onFiltersChange,
  onSearch,
}) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<
    "relevancia" | "precio_asc" | "precio_desc" | "rating"
  >("relevancia");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? undefined : category;
    setSelectedCategory(newCategory);
    applyFilters(newCategory, priceRange, sortBy);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange: [number, number] =
      type === "min" ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(newRange);
    applyFilters(selectedCategory, newRange, sortBy);
  };

  const handleSortChange = (value: typeof sortBy) => {
    setSortBy(value);
    applyFilters(selectedCategory, priceRange, value);
  };

  const applyFilters = (
    category?: string,
    range?: [number, number],
    sort?: typeof sortBy,
  ) => {
    onFiltersChange({
      categoria: category,
      precio_min: range?.[0],
      precio_max: range?.[1],
      busqueda: searchQuery || undefined,
      ordenar_por: sort,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setPriceRange([0, 50000]);
    setSortBy("relevancia");
    onFiltersChange({});
    onSearch("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-primary-black mb-2">
          Buscar
        </label>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleSearch}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary-black mb-2">
          Ordenar por
        </label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
          className="input-field cursor-pointer"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio_asc">Precio: Menor a Mayor</option>
          <option value="precio_desc">Precio: Mayor a Menor</option>
          <option value="rating">Rating más alto</option>
        </select>
      </div>

      <div>
        <button
          onClick={() =>
            setExpandedFilter(
              expandedFilter === "categories" ? null : "categories",
            )
          }
          className="w-full flex items-center justify-between py-2 font-semibold text-primary-black hover:text-primary-blue transition-colors"
        >
          <span>Categorías</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${expandedFilter === "categories" ? "rotate-180" : ""}`}
          />
        </button>

        {expandedFilter === "categories" && (
          <div className="mt-3 space-y-2 animate-slide-up">
            {categoriesLoading ? (
              <p className="text-sm text-primary-gray">
                Cargando categorías...
              </p>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-blue cursor-pointer"
                  />
                  <span className="text-sm text-primary-gray">{category}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-primary-gray">
                No hay categorías disponibles
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() =>
            setExpandedFilter(expandedFilter === "price" ? null : "price")
          }
          className="w-full flex items-center justify-between py-2 font-semibold text-primary-black hover:text-primary-blue transition-colors"
        >
          <span>Rango de Precios</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${expandedFilter === "price" ? "rotate-180" : ""}`}
          />
        </button>

        {expandedFilter === "price" && (
          <div className="mt-4 space-y-4 animate-slide-up">
            <div>
              <label className="text-xs text-primary-gray block mb-2">
                Mínimo: ${priceRange[0].toLocaleString("es-MX")}
              </label>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange[0]}
                onChange={(e) =>
                  handlePriceChange("min", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
              />
            </div>

            <div>
              <label className="text-xs text-primary-gray block mb-2">
                Máximo: ${priceRange[1].toLocaleString("es-MX")}
              </label>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceChange("max", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-blue"
              />
            </div>
          </div>
        )}
      </div>

      {(searchQuery ||
        selectedCategory ||
        sortBy !== "relevancia" ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 50000) && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-primary-blue border border-primary-blue rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          <X size={18} />
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
