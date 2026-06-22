export interface MenuItemData {
  _id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  order: number;
}

export interface CategoryData {
  _id: string;
  name: string;
  emoji: string;
  description?: string;
  order: number;
  items: MenuItemData[];
}

export interface DeleteTarget {
  type: "category" | "item";
  id: string;
  label: string;
  categoryId?: string;
}
