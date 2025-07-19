require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));
app.use("/api/auth", authRoutes);

const verificationCodes = {};

// ✅ Nodemailer ayarı
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ 1. Kod gönderme
app.post("/send-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "E-mail is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "E-mail not found." });

  const code = Math.floor(100000 + Math.random() * 900000);
  verificationCodes[email] = code;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your password reset code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✔ Code ${code} sent to ${email}`);
    res.json({ message: "Verification code sent." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Email could not be sent." });
  }
});

// ✅ 2. Kod doğrulama
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Missing email or code." });

  if (verificationCodes[email] && verificationCodes[email].toString() === code.toString()) {
    return res.json({ message: "Code verified." });
  }

  return res.status(400).json({ message: "Invalid code." });
});

// ✅ 3. Yeni şifre belirleme
app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: "Missing fields." });

  if (verificationCodes[email] && verificationCodes[email].toString() === code.toString()) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    delete verificationCodes[email];
    return res.json({ message: "Password reset successful." });
  } else {
    return res.status(400).json({ message: "Invalid or expired code." });
  }
});

app.get("/", (req, res) => {
  res.send("Sunucu çalışıyor!");
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Hoşgeldin, kullanıcı ID'n: " + req.user.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
