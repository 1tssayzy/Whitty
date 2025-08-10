const form = document.getElementById("registerForm");
const login = document.getElementById("login");
const password = document.getElementById("password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        login: login.value,
        password: password.value,
    };  
    fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then((res) => res.json()).then((response) => {
        if(response.message === "User registered successfully") {
            window.location.href = "/profile";
        }
        else {
            alert("Registration failed: " + response.message);
        }
    })
    .catch((err) => console.error("Error during registration:", err));
});