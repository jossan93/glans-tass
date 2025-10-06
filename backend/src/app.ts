import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => res.send("server funkar"));

export default app;
