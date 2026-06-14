import { MenuItem } from "../types/menuTypes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useTheme } from "@/context/themeContext";

interface ItemsGridProps {
  items: MenuItem[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: number) => void;
}

export const ItemsGrid = ({ items, onEditItem, onDeleteItem }: ItemsGridProps) => {
  const { isDark } = useTheme();

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No items found in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className={`overflow-hidden flex flex-col rounded-2xl border transition-all hover:shadow-md ${
            isDark 
              ? "bg-[#111113] border-white/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.2)] hover:border-white/[0.12]" 
              : "bg-white border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black/[0.12]"
          } ${!item.isAvailable ? "opacity-75" : ""}`}
        >
          {item.image && (
            <div className="h-32 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <span className="text-4xl">{item.image}</span>
            </div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-semibold text-lg line-clamp-1 ${isDark ? "text-white" : "text-black"}`}>{item.name}</h3>
              <span className={`font-bold whitespace-nowrap ml-2 ${isDark ? "text-white" : "text-black"}`}>
                PKR {Number(item.price || 0).toFixed(2)}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
              {item.description || "No description"}
            </p>

            <div className="flex gap-2 flex-wrap mb-4">
              {!item.isAvailable && (
                <span className={`text-xs px-2 py-1 rounded font-medium ${isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-600"}`}>
                  Unavailable
                </span>
              )}
              {item.variants?.length > 0 && (
                <span className={`text-xs px-2 py-1 rounded font-medium ${isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                  {item.variants.length} Variants
                </span>
              )}
              {item.toppings?.length > 0 && (
                <span className={`text-xs px-2 py-1 rounded font-medium ${isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
                  {item.toppings.length} Toppings
                </span>
              )}
            </div>

            <div className={`flex items-center justify-end gap-2 pt-3 border-t ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
              <button
                className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isDark ? "bg-white/[0.08] text-white hover:bg-white/[0.12]" : "bg-black/[0.05] text-black hover:bg-black/[0.08]"}`}
                onClick={() => onEditItem(item)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
                onClick={() => onDeleteItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
