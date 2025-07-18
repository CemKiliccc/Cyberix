function logTimestamp(action) {
  const now = new Date();
  console.log(`${action} at ${now.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`);
}

function clearForm(fields) {
  fields.forEach(field => {
    if (field) field.value = '';
  });
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector(".toggle-password");

  if (passwordInput) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.textContent = "👁️‍🗨️";
      logTimestamp("Password shown");
    } else {
      passwordInput.type = "password";
      toggleIcon.textContent = "👁";
      logTimestamp("Password hidden");
    }
  } else {
    console.error("Password input not found!");
  }
}

// Utility function to show loading state
function showLoading(element, show) {
  const button = document.querySelector("button");
  if (show) {
    button.disabled = true;
    button.textContent = "Yükleniyor...";
  } else {
    button.disabled = false;
    button.textContent = button.id === "loginButton" ? "Sign in" : "Kayıt Ol";
  }
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

  showLoading(errorMessage, true);
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, surname, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...");
      clearForm([document.getElementById("name"), document.getElementById("surname"), document.getElementById("email"), document.getElementById("password")]);
      setTimeout(() => (window.location.href = "/login.html"), 1000);
    } else {
      errorMessage.textContent = data.message || "Kayıt başarısız.";
    }
  } catch (error) {
    errorMessage.textContent = "Sunucuya bağlanılamadı.";
  } finally {
    showLoading(errorMessage, false);
  }
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  if (!username || !password) {
    errorMessage.textContent = "Lütfen tüm alanları doldurun.";
    return;
  }

  showLoading(errorMessage, true);
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...");
      clearForm([document.getElementById("username"), document.getElementById("password")]);
      setTimeout(() => (window.location.href = "/anasayfa.html"), 1000);
    } else {
      errorMessage.textContent = data.message || "Giriş başarısız. Bilgilerinizi kontrol edin.";
    }
  } catch (error) {
    errorMessage.textContent = "Sunucuya bağlanılamadı.";
  } finally {
    showLoading(errorMessage, false);
  }
}

async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Çıkış yapıldı! Ana sayfaya yönlendiriliyorsunuz...");
      window.location.href = "/login.html";
    } else {
      const data = await response.json();
      alert(data.message || "Çıkış başarısız.");
    }
  } catch (error) {
    alert("Sunucuya bağlanılamadı.");
  }
}