(() => {
  let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");


signup?.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});

login?.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});

// Signup Handler
document.getElementById("signup-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        if (data.access) {
            localStorage.setItem("access", data.access);
            alert("Registered successfully!");
            window.location.href = "/register/";
        } else {
            alert("Signup failed: " + JSON.stringify(data));
        }
    } catch (err) {
        alert("Signup error");
    }
});

// Login Handler
document.getElementById("login-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        localStorage.setItem("username", username);
        const data = await res.json();
        if (data.access) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            alert("Login successful!");
            window.location.href = "/index/";
        } else {
            alert("Login failed: " + JSON.stringify(data));
        }
    } catch (err) {
        alert("Login error");
    }
});

// Load Notes on /index/
if (window.location.pathname === "/index/") {
    getNotes();
}
})();