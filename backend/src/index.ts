import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET saknas i .env");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("MONGO_URI saknas i .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongoDB kopplad");
    app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
  })
  .catch((err) => console.log(err));
