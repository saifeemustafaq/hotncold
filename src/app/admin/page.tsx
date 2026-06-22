"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { type CategoryData, type MenuItemData, type DeleteTarget } from "@/lib/menu/types";
import { adminFetch } from "@/lib/menu/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PinScreen } from "@/components/menu/admin/PinScreen";
import { AdminHeader } from "@/components/menu/admin/AdminHeader";
import { AdminEmptyState } from "@/components/menu/admin/AdminEmptyState";
import { CategoryRow } from "@/components/menu/admin/CategoryRow";
import { CategoryDialog } from "@/components/menu/admin/CategoryDialog";
import { ItemDialog } from "@/components/menu/admin/ItemDialog";
import { DeleteDialog } from "@/components/menu/admin/DeleteDialog";

export default function AdminPage() {
  const [pin, setPin] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(false);

  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryDialogMode, setCategoryDialogMode] = useState<"add" | "edit">("add");
  const [editingCategory, setEditingCategory] = useState<CategoryData | undefined>(undefined);

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemDialogMode, setItemDialogMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<MenuItemData | undefined>(undefined);
  const [itemDialogCategoryId, setItemDialogCategoryId] = useState<string>("");

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  // Persist PIN in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("menu_admin_pin");
    if (stored) setPin(stored);
  }, []);

  function handleAuth(p: string) {
    sessionStorage.setItem("menu_admin_pin", p);
    setPin(p);
  }

  function logout() {
    sessionStorage.removeItem("menu_admin_pin");
    setPin(null);
    setCategories([]);
  }

  const fetchMenu = useCallback(async () => {
    if (!pin) return;
    setLoadingData(true);
    try {
      const res = await adminFetch(pin, "/api/menu/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
        setExpandedIds((prev) => {
          const next = new Set(prev);
          json.data.forEach((c: CategoryData) => next.add(c._id));
          return next;
        });
      }
    } finally {
      setLoadingData(false);
    }
  }, [pin]);

  useEffect(() => {
    if (pin) fetchMenu();
  }, [pin, fetchMenu]);

  // Toggle item availability
  async function toggleAvailable(item: MenuItemData) {
    if (!pin) return;
    const res = await adminFetch(pin, `/api/menu/items/${item._id}`, {
      method: "PUT",
      body: JSON.stringify({ available: !item.available }),
    });
    const json = await res.json();
    if (json.success) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === item.category_id
            ? {
                ...cat,
                items: cat.items.map((i) => (i._id === item._id ? json.data : i)),
              }
            : cat
        )
      );
    }
  }

  // Delete confirm
  async function confirmDelete() {
    if (!deleteTarget || !pin) return;
    const url =
      deleteTarget.type === "category"
        ? `/api/menu/categories/${deleteTarget.id}`
        : `/api/menu/items/${deleteTarget.id}`;
    const res = await adminFetch(pin, url, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      if (deleteTarget.type === "category") {
        setCategories((prev) => prev.filter((c) => c._id !== deleteTarget.id));
      } else {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === deleteTarget.categoryId
              ? {
                  ...cat,
                  items: cat.items.filter((i) => i._id !== deleteTarget.id),
                }
              : cat
          )
        );
      }
      setDeleteTarget(null);
      setDeleteDialogOpen(false);
    }
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Category dialog helpers
  function openAddCategory() {
    setEditingCategory(undefined);
    setCategoryDialogMode("add");
    setCategoryDialogOpen(true);
  }

  function openEditCategory(cat: CategoryData) {
    setEditingCategory(cat);
    setCategoryDialogMode("edit");
    setCategoryDialogOpen(true);
  }

  // Item dialog helpers
  function openAddItem(categoryId: string) {
    setItemDialogCategoryId(categoryId);
    setEditingItem(undefined);
    setItemDialogMode("add");
    setItemDialogOpen(true);
  }

  function openEditItem(item: MenuItemData) {
    setItemDialogCategoryId(item.category_id);
    setEditingItem(item);
    setItemDialogMode("edit");
    setItemDialogOpen(true);
  }

  // Delete dialog helpers
  function openDeleteCategory(cat: CategoryData) {
    setDeleteTarget({ type: "category", id: cat._id, label: cat.name });
    setDeleteDialogOpen(true);
  }

  function openDeleteItem(item: MenuItemData) {
    setDeleteTarget({
      type: "item",
      id: item._id,
      label: item.name,
      categoryId: item.category_id,
    });
    setDeleteDialogOpen(true);
  }

  if (!pin) return <PinScreen onAuth={handleAuth} />;

  const totalItems = categories.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="min-h-screen bg-[#091a0f]">
      <AdminHeader onLogout={logout} />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-20">
        {/* Stats bar + Add Category */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[#7a9a87] text-sm">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
            {" · "}
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
          <Button
            onClick={openAddCategory}
            className="flex items-center gap-2 bg-[#d4a017] text-[#0a1f12] hover:bg-[#f0c842]"
          >
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>

        {/* Loading skeletons */}
        {loadingData && (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl bg-[#1a3a27]" />
            <Skeleton className="h-14 w-full rounded-2xl bg-[#1a3a27]" />
            <Skeleton className="h-14 w-full rounded-2xl bg-[#1a3a27]" />
          </div>
        )}

        {/* Empty state */}
        {!loadingData && categories.length === 0 && (
          <AdminEmptyState onAddCategory={openAddCategory} />
        )}

        {/* Category list */}
        {!loadingData && categories.length > 0 && (
          <div className="space-y-3">
            {categories.map((cat) => (
              <CategoryRow
                key={cat._id}
                category={cat}
                expanded={expandedIds.has(cat._id)}
                onToggleExpand={() => toggleExpand(cat._id)}
                onEditCategory={() => openEditCategory(cat)}
                onDeleteCategory={() => openDeleteCategory(cat)}
                onAddItem={() => openAddItem(cat._id)}
                onEditItem={openEditItem}
                onDeleteItem={openDeleteItem}
                onToggleAvailable={toggleAvailable}
              />
            ))}
          </div>
        )}
      </main>

      {/* Category dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        mode={categoryDialogMode}
        initial={editingCategory}
        pin={pin}
        onSave={(cat) => {
          if (categoryDialogMode === "add") {
            setCategories((prev) => [...prev, cat]);
            setExpandedIds((prev) => new Set([...prev, cat._id]));
          } else {
            setCategories((prev) =>
              prev.map((c) =>
                c._id === cat._id ? { ...c, ...cat, items: c.items } : c
              )
            );
          }
          setCategoryDialogOpen(false);
        }}
      />

      {/* Item dialog */}
      <ItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        mode={itemDialogMode}
        categoryId={itemDialogCategoryId}
        initial={editingItem}
        pin={pin}
        onSave={(item) => {
          if (itemDialogMode === "add") {
            setCategories((prev) =>
              prev.map((cat) =>
                cat._id === itemDialogCategoryId
                  ? { ...cat, items: [...cat.items, item] }
                  : cat
              )
            );
          } else {
            setCategories((prev) =>
              prev.map((cat) =>
                cat._id === itemDialogCategoryId
                  ? {
                      ...cat,
                      items: cat.items.map((i) =>
                        i._id === item._id ? item : i
                      ),
                    }
                  : cat
              )
            );
          }
          setItemDialogOpen(false);
        }}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        target={deleteTarget}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
