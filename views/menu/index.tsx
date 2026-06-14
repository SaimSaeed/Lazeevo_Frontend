"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { ProtectedAPI } from "@/lib/axios";
import { toast } from "sonner";
import { Category, MenuItem } from "./types/menuTypes";
import { CategoriesPanel } from "./components/CategoriesPanel";
import { ItemsGrid } from "./components/ItemsGrid";
import { CategoryModal } from "./components/CategoryModal";
import { ItemModal } from "./components/ItemModal";
import { Search, X, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import TabsSwitcher from "@/components/common/TabSwitcher";
import { DebouncedSearch } from "@/components/common/DebouncedSearch";

export default function MenuManagementPage() {
  const { isDark } = useTheme();

  // -- State
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");
  
  const [catSearch, setCatSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  // -- Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  // -- Fetching
  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const res = await ProtectedAPI.get("/menu/categories", {
        params: { search: catSearch, pageSize: 100 }
      });
      if (res.data?.data) {
        setCategories(res.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoadingCats(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const res = await ProtectedAPI.get("/menu/items", {
        params: {
          search: itemSearch,
          categoryId: activeCategoryId === "all" ? undefined : activeCategoryId,
          pageSize: 500
        }
      });
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch items");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchCategories, 300);
    return () => clearTimeout(delay);
  }, [catSearch]);

  useEffect(() => {
    const delay = setTimeout(fetchItems, 300);
    return () => clearTimeout(delay);
  }, [itemSearch, activeCategoryId]);

  // -- Handlers
  const handleAddCategory = () => {
    setEditingCat(null);
    setIsCatModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setIsCatModalOpen(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteCatId) return;
    try {
      await ProtectedAPI.delete(`/menu/categories/${deleteCatId}`);
      toast.success("Category deleted");
      setDeleteCatId(null);
      fetchCategories();
      if (activeCategoryId === deleteCatId) setActiveCategoryId("all");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete category");
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItemConfirm = async () => {
    if (!deleteItemId) return;
    try {
      await ProtectedAPI.delete(`/menu/items/${deleteItemId}`);
      toast.success("Item deleted");
      setDeleteItemId(null);
      fetchItems();
      fetchCategories(); // Update counts
    } catch (error: any) {
      toast.error("Failed to delete item");
    }
  };

  const TABS = [
    { label: "Categories", value: "categories" },
    { label: "Menu Items", value: "items" },
  ];

  return (
    <div className={`min-h-screen w-full p-6 md:p-8 transition-colors duration-300 flex flex-col ${isDark ? "bg-[#0c0c0e]" : "bg-[#f0fafa]"}`}>
      {/* -- Header -- */}
      <div className="mb-6 flex flex-col gap-4 flex-wrap">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
              Menu Management
            </h1>
            <p className={`text-sm mt-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
              Manage your categories, food items, variants, and toppings. Changes automatically sync to the desktop POS.
            </p>
          </div>
          <div>
            <button 
              onClick={activeTab === "categories" ? handleAddCategory : handleAddItem}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-sm shadow-teal-500/20"
            >
              <Plus size={16} /> 
              {activeTab === "categories" ? "Add Category" : "Add Item"}
            </button>
          </div>
        </div>

        <TabsSwitcher
          tabs={TABS}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
          className="w-auto max-w-[300px]"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {activeTab === "categories" && (
          <div className="w-full flex-shrink-0 flex flex-col">
            {loadingCats && categories.length === 0 ? (
              <div className="flex-1 flex items-center justify-center"><Spinner className="text-primary" /></div>
            ) : (
              <CategoriesPanel
                categories={categories}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={(id) => setDeleteCatId(id)}
                search={catSearch}
                setSearch={setCatSearch}
              />
            )}
          </div>
        )}

        {activeTab === "items" && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
            <div className="flex items-center justify-between">
              <DebouncedSearch
                value={itemSearch}
                onChange={setItemSearch}
                placeholder="Search items..."
                isDark={isDark}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loadingItems && items.length === 0 ? (
                <div className="h-full flex items-center justify-center"><Spinner className="text-primary" /></div>
              ) : (
                <ItemsGrid
                  items={items}
                  onEditItem={handleEditItem}
                  onDeleteItem={(id) => setDeleteItemId(id)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <CategoryModal
        open={isCatModalOpen}
        onOpenChange={setIsCatModalOpen}
        category={editingCat}
        onSuccess={() => {
          fetchCategories();
          fetchItems();
        }}
      />

      <ItemModal
        open={isItemModalOpen}
        onOpenChange={setIsItemModalOpen}
        item={editingItem}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSuccess={() => {
          fetchItems();
          fetchCategories();
        }}
      />

      {!!deleteCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteCatId(null)} />
          <div className={`relative w-full max-w-sm rounded-2xl border p-8 flex flex-col gap-6 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`} style={{ boxShadow: isDark ? "0 2px 40px rgba(0,0,0,0.6)" : "0 2px 24px rgba(13,148,136,0.12)" }}>
            <div>
              <h2 className={`text-xl font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`} style={{ fontFamily: "'Syne', sans-serif" }}>Delete Category</h2>
              <p className={`text-sm mt-2 leading-relaxed ${isDark ? "text-[#888]" : "text-gray-500"}`}>Are you sure you want to delete this category? All items inside it will also be deleted. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCatId(null)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}>Cancel</button>
              <button onClick={handleDeleteCategoryConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {!!deleteItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteItemId(null)} />
          <div className={`relative w-full max-w-sm rounded-2xl border p-8 flex flex-col gap-6 ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`} style={{ boxShadow: isDark ? "0 2px 40px rgba(0,0,0,0.6)" : "0 2px 24px rgba(13,148,136,0.12)" }}>
            <div>
              <h2 className={`text-xl font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`} style={{ fontFamily: "'Syne', sans-serif" }}>Delete Item</h2>
              <p className={`text-sm mt-2 leading-relaxed ${isDark ? "text-[#888]" : "text-gray-500"}`}>Are you sure you want to delete this menu item? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteItemId(null)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDark ? "border-white/[0.08] text-[#888] hover:text-white hover:bg-white/[0.05]" : "border-black/[0.08] text-[#999] hover:text-black hover:bg-black/[0.04]"}`}>Cancel</button>
              <button onClick={handleDeleteItemConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
