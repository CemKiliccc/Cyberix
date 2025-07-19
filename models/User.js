const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // İsteğe bağlı, kayıt sırasında alınabilir
  },
  surname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Aynı e-posta ile ikinci kayıt yapılamaz
    lowercase: true, // Küçük harfe çevirir
    trim: true,      // Boşlukları temizler
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // createdAt ve updatedAt alanlarını otomatik ekler

module.exports = mongoose.model("User", userSchema);
