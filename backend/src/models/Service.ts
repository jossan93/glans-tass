import mongoose, { Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number; // i minuter
  animalType: "hund" | "katt";
  isActive: boolean;
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IService>("Service", ServiceSchema);
