import mongoose, { Schema, Document, Types } from "mongoose";


export interface IBooking extends Document {
    userId: Types.ObjectId;
    serviceId: Types.ObjectId;
    date: Date;
    notes?: string;
}

const BookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
