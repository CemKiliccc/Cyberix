function goBack() {
  window.history.back();
}

async function register() {
  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  if (!name || !surname || !email || !password) {
    errorMessage.textContent = "Lütfen tüm alanları doldurun.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.textContent = "Geçerli bir e-posta adresi girin.";
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
if (!passwordRegex.test(password)) {
  errorMessage.textContent = "Şifre en az 8 karakter, bir harf ve bir sayı içermelidir.";
  return;
}


  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, surname, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...");
      window.location.href = "/index.html";
    } else {
      errorMessage.textContent = data.message || "Kayıt başarısız.";
    }
  } catch (error) {
    errorMessage.textContent = "Sunucuya bağlanılamadı.";
  }
  
}
async function loign(){
  
}