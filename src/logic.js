const form = document.getElementById("loginInput");
const loginField = document.getElementById("loginL");
const passwordField = document.getElementById("passwordL");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    login: loginField.value,
    password: passwordField.value,
  };

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json(); 
    if (result.redirect) {
      window.location.href = result.redirect;
    } else {
      alert("Login failed: " + result.message);
    }
  } catch (err) {
    console.error("Error during login:", err);
  }
});