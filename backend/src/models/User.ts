
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    _id: Types.ObjectId;
}

const UserSchema: Schema = new Schema ({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum:["admin", "user"], default: "user" }
});

export default mongoose.model<IUser>("User", UserSchema);
