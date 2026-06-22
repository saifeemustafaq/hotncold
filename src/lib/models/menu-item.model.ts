import mongoose, { Schema, Model, Types } from "mongoose";

export interface IMenuItem {
  category_id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  order: number;
  created_at: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ??
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
