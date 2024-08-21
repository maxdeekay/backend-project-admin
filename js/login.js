"use strict";

window.onload = () => {
    const form = document.getElementById("login-form");

    form.onsubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        loginUser(username, password);
    }
}

async function loginUser(username, password) {
    const url = "https://backend-project-api.onrender.com/login";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    if (response.ok) {
        const data = await response.json();
        // save JWT token in localStorage for later use
        localStorage.setItem("token", data.response.token);
        window.location.href="admin.html";
    } else {
        const message = document.getElementById("message");
        clearMessage(message);

        message.classList.add("bad");
        message.innerHTML = "Felaktigt användarnamn eller lösenord."
        message.style.display = "flex";
    }
}

function clearMessage(element) {
    element.classList.remove("good");
    element.classList.remove("bad");
    element.innerHTML = "";
    element.style.display = "none";
}