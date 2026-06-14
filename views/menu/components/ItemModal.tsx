import { useState, useEffect } from "react";
import { MenuItem, Category } from "../types/menuTypes";
import { ProtectedAPI } from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/context/themeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmojiSelector } from "@/components/common/EmojiSelector";

interface ItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  categories: Category[];
  activeCategoryId?: number | "all";
  onSuccess: () => void;
}

export const ItemModal = ({ open, onOpenChange, item, categories, activeCategoryId, onSuccess }: ItemModalProps) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    code: "",
    description: "",
    price: "",
    costPrice: "",
    image: "", // emoji
    isAvailable: true,
    isKitchenItem: true,
    isTaxable: true,
    maxToppings: "0",
  });

  const [variants, setVariants] = useState<any[]>([]);
  const [toppings, setToppings] = useState<any[]>([]);

  useEffect(() => {
    if (item) {
      setFormData({
        categoryId: item.categoryId.toString(),
        name: item.name || "",
        code: item.code || "",
        description: item.description || "",
        price: item.price !== undefined ? item.price.toString() : "",
        costPrice: item.costPrice ? item.costPrice.toString() : "",
        image: item.image || "",
        isAvailable: item.isAvailable !== false,
        isKitchenItem: item.isKitchenItem !== false,
        isTaxable: item.isTaxable !== false,
        maxToppings: item.maxToppings?.toString() || "0",
      });
      setVariants(item.variants?.map(v => ({ ...v, price: v.price.toString() })) || []);
      setToppings(item.toppings?.map(t => ({ ...t, price: t.price.toString() })) || []);
    } else {
      setFormData({
        categoryId: activeCategoryId !== "all" ? String(activeCategoryId) : (categories[0]?.id.toString() || ""),
        name: "",
        code: "",
        description: "",
        price: "",
        costPrice: "",
        image: "",
        isAvailable: true,
        isKitchenItem: true,
        isTaxable: true,
        maxToppings: "0",
      });
      setVariants([]);
      setToppings([]);
    }
  }, [item, open, categories, activeCategoryId]);

  const handleSubmit = async () => {
    try {
      if (!formData.name) return toast.error("Name is required");
      if (!formData.price) return toast.error("Price is required");
      if (!formData.categoryId) return toast.error("Category is required");

      setLoading(true);

      const payload = {
        categoryId: Number(formData.categoryId),
        name: formData.name,
        code: formData.code,
        description: formData.description,
        price: Math.round(Number(formData.price)),
        costPrice: formData.costPrice ? Math.round(Number(formData.costPrice)) : undefined,
        image: formData.image,
        isAvailable: formData.isAvailable,
        isKitchenItem: formData.isKitchenItem,
        isTaxable: formData.isTaxable,
        maxToppings: Number(formData.maxToppings),
        variants: variants.map(v => ({ name: v.name, price: Math.round(Number(v.price)), isActive: v.isActive !== false })),
        toppings: toppings.map(t => ({ name: t.name, price: Math.round(Number(t.price)), isActive: t.isActive !== false })),
      };

      if (item) {
        await ProtectedAPI.put(`/menu/items/${item.id}`, payload);
        toast.success("Item updated successfully");
      } else {
        await ProtectedAPI.post("/menu/items", payload);
        toast.success("Item created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => setVariants([...variants, { name: "", price: "", isActive: true }]);
  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  const addTopping = () => setToppings([...toppings, { name: "", price: "0", isActive: true }]);
  const updateTopping = (index: number, field: string, value: any) => {
    const newToppings = [...toppings];
    newToppings[index][field] = value;
    setToppings(newToppings);
  };
  const removeTopping = (index: number) => setToppings(toppings.filter((_, i) => i !== index));

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isDark ? 'dark text-white' : 'text-black'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[85vh] rounded-2xl border flex flex-col ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
        style={{
          boxShadow: isDark
            ? "0 2px 40px rgba(0,0,0,0.6)"
            : "0 2px 24px rgba(13,148,136,0.12)",
        }}
      >
        {/* Close */}
        <button
          onClick={() => onOpenChange(false)}
          className={`absolute top-6 right-6 p-1.5 rounded-lg transition-colors z-10 ${isDark ? "text-[#555] hover:text-white hover:bg-white/[0.05]" : "text-[#ccc] hover:text-black hover:bg-black/[0.05]"}`}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className={`px-8 py-6 border-b flex-shrink-0 ${isDark ? "border-white/[0.07]" : "border-black/[0.07]"}`}>
          <h2
            className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? "text-[#f0f0f4]" : "text-[#111]"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {item ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <p className={`text-xs mt-1.5 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
            Configure your item details, pricing, variants, and optional toppings below.
          </p>
        </div>
        
        {/* Scrollable Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Name *</Label>
                <Input 
                  placeholder="e.g. Double Cheeseburger"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <Input 
                    type="number" step="0.01" 
                    placeholder="0.00"
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input 
                    type="number" step="0.01" 
                    placeholder="0.00"
                    value={formData.costPrice} 
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="A brief summary of the item..."
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input 
                    placeholder="e.g. BRG-001"
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emoji / Icon</Label>
                  <EmojiSelector 
                    value={formData.image} 
                    onChange={(val) => setFormData({ ...formData, image: val })} 
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Variants & Toppings */}
            <div className="space-y-6">
              {/* Variants */}
              <div className={`space-y-4 rounded-2xl p-5 border ${isDark ? "bg-white/[0.02] border-white/[0.05]" : "bg-black/[0.01] border-black/[0.05]"}`}>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Variants</Label>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addVariant}>
                    <Plus size={14} /> Add Variant
                  </Button>
                </div>
                {variants.map((v, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Input 
                      className="flex-1"
                      placeholder="Name (e.g. Large)" 
                      value={v.name} 
                      onChange={(e) => updateVariant(i, "name", e.target.value)} 
                    />
                    <Input 
                      type="number" step="0.01" 
                      className="w-28"
                      placeholder="Price" 
                      value={v.price} 
                      onChange={(e) => updateVariant(i, "price", e.target.value)} 
                    />
                    <Button variant="destructive" size="icon" onClick={() => removeVariant(i)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {variants.length === 0 && <p className="text-xs text-muted-foreground italic">No variants added yet.</p>}
              </div>

              {/* Toppings */}
              <div className={`space-y-4 rounded-2xl p-5 border ${isDark ? "bg-white/[0.02] border-white/[0.05]" : "bg-black/[0.01] border-black/[0.05]"}`}>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Toppings / Add-ons</Label>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addTopping}>
                    <Plus size={14} /> Add Topping
                  </Button>
                </div>
                <div className="flex items-center gap-3 pb-2">
                  <Label className="text-xs text-muted-foreground shrink-0">Max Allowed (0 = unlimited)</Label>
                  <Input 
                    type="number" 
                    className="w-20 text-center" 
                    value={formData.maxToppings} 
                    onChange={(e) => setFormData({ ...formData, maxToppings: e.target.value })} 
                  />
                </div>
                {toppings.map((t, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Input 
                      className="flex-1"
                      placeholder="Name (e.g. Extra Cheese)" 
                      value={t.name} 
                      onChange={(e) => updateTopping(i, "name", e.target.value)} 
                    />
                    <Input 
                      type="number" step="0.01" 
                      className="w-28"
                      placeholder="Price" 
                      value={t.price} 
                      onChange={(e) => updateTopping(i, "price", e.target.value)} 
                    />
                    <Button variant="destructive" size="icon" onClick={() => removeTopping(i)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {toppings.length === 0 && <p className="text-xs text-muted-foreground italic">No toppings added yet.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-8 py-5 border-t flex justify-end gap-3 flex-shrink-0 ${isDark ? "border-white/[0.07]" : "border-black/[0.07]"}`}>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Item"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

