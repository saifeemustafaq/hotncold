import { create } from 'zustand';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: Record<string, CartItem>;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: {},
  addItem: (item) =>
    set((state) => ({
      items: {
        ...state.items,
        [item._id]: {
          ...item,
          quantity: (state.items[item._id]?.quantity || 0) + 1,
        },
      },
    })),
  removeItem: (id) =>
    set((state) => {
      const newItems = { ...state.items };
      delete newItems[id];
      return { items: newItems };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = { ...state.items };
        delete newItems[id];
        return { items: newItems };
      }
      return {
        items: {
          ...state.items,
          [id]: { ...state.items[id], quantity },
        },
      };
    }),
  clearCart: () => set({ items: {} }),
}));
