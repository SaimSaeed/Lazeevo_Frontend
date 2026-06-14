import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Category } from "../types/menuTypes";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/themeContext";
import { Edit2, Search, X, Plus, Trash2 } from "lucide-react";

interface CategoriesPanelProps {
  categories: Category[];
  activeCategoryId: number | "all";
  setActiveCategoryId: Dispatch<SetStateAction<number | "all">>;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: number) => void;
  search: string;
  setSearch: (search: string) => void;
}

export const CategoriesPanel = ({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  search,
  setSearch,
}: CategoriesPanelProps) => {
  const { isDark } = useTheme();
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>
          Categories
        </h2>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all w-full max-w-md ${isDark ? "bg-[#111113] border-white/[0.08] focus-within:border-teal-500/50" : "bg-white border-black/[0.08] focus-within:border-teal-400/60"}`}>
        <Search size={16} className={isDark ? "text-[#555]" : "text-[#999]"} />
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search categories..."
          className={`flex-1 text-sm outline-none bg-transparent ${isDark ? "text-white placeholder-[#444]" : "text-[#111] placeholder-[#bbb]"}`}
        />
        {localSearch && (
          <button onClick={() => setLocalSearch("")} className={`p-1 flex-shrink-0 rounded-md transition-colors ${isDark ? "text-[#555] hover:text-white hover:bg-white/[0.1]" : "text-[#999] hover:text-black hover:bg-black/[0.05]"}`}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4">

        {categories.map((category) => (
          <div
            key={category.id}
            className={`group p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between min-h-[120px] relative ${
              activeCategoryId === category.id
                ? isDark
                  ? "bg-teal-500/10 border-teal-500/30"
                  : "bg-teal-50 border-teal-200/60"
                : isDark
                ? "bg-[#111113] border-white/[0.07] hover:border-white/[0.15]"
                : "bg-white border-black/[0.06] hover:border-black/[0.12]"
            } ${!category.isActive ? "opacity-60" : ""}`}
            onClick={() => setActiveCategoryId(category.id)}
          >
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-white/[0.08]" : "text-gray-500 hover:text-black hover:bg-black/[0.05]"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(category);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center mt-2">
              <span className="text-4xl mb-2">{category.emoji || "📁"}</span>
              <div className="font-medium flex items-center gap-2 text-white">
                {category.name}
                {!category.isActive && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              {category.description && (
                <div className="text-xs text-gray-400 mt-1.5 line-clamp-2 max-w-full px-2">
                  {category.description}
                </div>
              )}
              <div className="text-sm text-gray-300 mt-2">
                {category.item_count} items
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
