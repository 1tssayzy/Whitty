const form = document.getElementById("loginInput");
const login = document.getElementById("loginL");
const password = document.getElementById("passwordL");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    login: login.value,
    password: password.value,
  };

fetch('http://localhost:8080/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(result => console.log("Ответ сервера:", result))
.catch(err => console.error("Ошибка запроса:", err));
});
