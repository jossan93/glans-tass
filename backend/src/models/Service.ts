import mongoose, { Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number; // i minuter
  animalType: "hund" | "katt";
  order: number;
  isActive: boolean;
  isSeeded: false,
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // 1h som standard
    },
    animalType: {
      type: String,
      enum: ["hund", "katt"],
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSeeded: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model<IService>("Service", ServiceSchema);
