import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes"
import bookingRoutes from "./routes/bookingRoutes";
import serviceRoutes from "./routes/serviceRoutes";

const app = express();

// app.use(cors());
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://glansochtass.netlify.app"
];

app.use(
    cors({
        origin: function(origin, callback) {
            // till låt requests utan origin
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn("bocked by cors:", origin);
                callback(new Error("not allowed by cors"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
/*
const corsOrigin =
    process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

app.use(
    cors({
        origin:corsOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
*/
// till låt optian för alla routes
// app.options("/*", cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/service", serviceRoutes);

// test route
app.get("/", (req, res) => res.send("server funkar"));

export default app;
