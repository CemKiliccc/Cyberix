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
    errorMessage.textContent = "Please fill in all fields!!";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.textContent = "Enter a valid email address.";   
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorMessage.textContent = "Password must contain at least 8 characters, one letter and one number.";
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
    errorMessage.textContent = "Could not connect to the server.";
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
    errorMessage.textContent = "Please fill in all fields.";
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
      alert("Login successful! You are being redirected to the home page...");
      clearForm([document.getElementById("username"), document.getElementById("password")]);
      setTimeout(() => (window.location.href = "/anasayfa.html"), 1000);
    } else {
      errorMessage.textContent = data.message || "Login failed. Check your information.";
    }
  } catch (error) {
    errorMessage.textContent = "Could not connect to the server.";
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
async function send() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  const errorMessage = document.getElementById("error-message") || document.createElement("div");
  errorMessage.id = "error-message";
  if (!document.body.contains(errorMessage)) {
    document.body.appendChild(errorMessage); // Eğer yoksa ekle
  }
  errorMessage.textContent = "";

  if (!email) {
    errorMessage.textContent = "Please enter your email address.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.textContent = "Enter a valid email address.";
    return;
  }

  showLoading(emailInput, true); // Buton yerine inputa göre yükleniyor göstermek için
  try {
    const response = await fetch("/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("A verification code has been sent to your email.");
      logTimestamp("Verification code sent");
      localStorage.setItem("email", email); // ✔ verify.html'de lazım
      window.location.href = "/verify.html";
      emailInput.value = ""; 
    } else {
      errorMessage.textContent = data.message || "Failed to send code.";
    }
  } catch (error) {
    errorMessage.textContent = "Could not connect to the server.";
  } finally {
    showLoading(emailInput, false);
  }
}
async function verifyCode() {
  const codeInputs = document.querySelectorAll(".otp-input");
  const code = Array.from(codeInputs).map(i => i.value).join("");
  const email = localStorage.getItem("email");

  if (code.length !== 6) return alert("Please enter the 4-digit code.");

  const res = await fetch("/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("code", code);  // ✅ Şifre yenileme için saklanıyor
    window.location.href = "/resetpassword.html";
  } else {
    alert(data.message);
  }
}

async function resetPassword() {
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  const email = localStorage.getItem("email");
  const code = localStorage.getItem("code");

  if (!newPassword || !confirmPassword) return alert("Please fill in both password fields.");
  if (newPassword !== confirmPassword) return alert("Passwords do not match.");
  if (!email || !code) return alert("Missing verification session. Please go back.");

  try {
    const res = await fetch("/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful!");
      localStorage.removeItem("email");
      localStorage.removeItem("code");
      window.location.href = "/login.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Server error.");
  }
}
