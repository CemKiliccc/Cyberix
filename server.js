// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

// MongoDB bağlantısı
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route'lar
app.use("/api/auth", authRoutes);

// Basit test endpointi
app.get("/", (req, res) => res.send("Sunucu çalışıyor 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔊 Sunucu ${PORT} portunda çalışıyor...`));
