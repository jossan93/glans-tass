import express from "express";
import cors from "cors";
import mongoose  from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

// const app = express();
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI;

 // app.use(cors());
// app.use(express.json());

if (!MONGO_URI) {
    console.error("MONGO_URI saknas i .env");
    process.exit(1)
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("mongoDB kopplad");
        app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
    }
)
.catch((err) => console.log(err));