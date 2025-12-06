const form = document.getElementById("registerForm");
const login = document.getElementById("login");
const password = document.getElementById("password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        username: username.value,
        password: password.value,
    };
    try {
          const response =  await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    const result = await response.json();
    if (result.redirect) {
        window.location.href = result.redirect;
    } else {
        alert("Registration failed: " + result.message);
    }
    }catch (error) {
        console.error("Error registration:", error);
        alert("Registration failed: " + error.message);
    }     
    
});