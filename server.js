require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");


const app = express();

connectDB();

app.use(express.json()); 
app.use(express.static("frontend"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Sunucu çalışıyor!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Sunucu ${PORT} portunda çalışıyor`);
});
app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Hoşgeldin, kullanıcı ID'n: " + req.user.id });
});
