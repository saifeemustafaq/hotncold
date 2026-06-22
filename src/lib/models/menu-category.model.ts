import mongoose, { Schema, Model } from "mongoose";

export interface IMenuCategory {
  name: string;
  emoji: string;
  description?: string;
  order: number;
  created_at: Date;
}

const MenuCategorySchema = new Schema<IMenuCategory>(
  {
    name: { type: String, required: true, trim: true },
    emoji: { type: String, required: true, default: "🍽️" },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const MenuCategory: Model<IMenuCategory> =
  mongoose.models.MenuCategory ??
  mongoose.model<IMenuCategory>("MenuCategory", MenuCategorySchema);
