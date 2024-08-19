"use strict";

const baseURL = "http://127.0.0.1:3000";

window.onload = async () => {
    // check if user is authorized
    await checkAuth();

    document.getElementById("logout-button").onclick = () => {
        // logout here
    };

    document.getElementById("add-button").onclick = () => addConsumable();
    document.getElementById("cancel-button").onclick = () => resetCreate();
    // draws the menu items
    drawConsumables(await getMenu());
}

function addConsumable() {
    // add consumable
};

function updateConsumable(consumable) {
    resetCreate();

    const container = document.getElementById("create-window");
    const title = document.getElementById("title");
    const ingredients = document.getElementById("ingredients");
    const price = document.getElementById("price");

    title.value = consumable.title;
    ingredients.value = consumable.ingredients;
    price.value = consumable.price;

    container.style.display = "flex";

    // call function that does the API request with object and update/delete as parameters
}

async function handleConsumables(consumable, action) {
    // handle the API requests

    /* const url = baseURL + "/admin/update/" + consumable._id;
    const response = await fetch(url, {

    }); */
}

function drawConsumables(consumables) {
    const container = document.getElementById("consumable-container");

    consumables.consumables.forEach((consumable) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const ingr = document.createElement("p");
        const price = document.createElement("p");
        const updateBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        updateBtn.onclick = () => {
            updateConsumable(consumable);
        }

        deleteBtn.onclick = () => {
            deleteConsumable(consumable._id);
        }

        div.classList.add("consumable");
        title.classList.add("title");
        ingr.classList.add("ingredients");
        price.classList.add("price");
        updateBtn.classList.add("button", "update-button");
        deleteBtn.classList.add("button", "delete-button");

        const titleText = document.createTextNode(consumable.title);
        const ingrText = document.createTextNode(consumable.ingredients.join(", "));
        const priceText = document.createTextNode(consumable.price);
        const updateBtnText = document.createTextNode("ÄNDRA");
        const deleteBtnText = document.createTextNode("TA BORT");

        title.appendChild(titleText);
        ingr.appendChild(ingrText);
        price.appendChild(priceText);
        updateBtn.appendChild(updateBtnText);
        deleteBtn.appendChild(deleteBtnText);

        div.appendChild(title);
        div.appendChild(ingr);
        div.appendChild(price);
        div.appendChild(updateBtn);
        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

async function getMenu() {
    const url = baseURL + "/consumables";
    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    } else {
        console.log("Error");
    }

    return response.ok ? await response.json() : console.log("Server error");
} 

async function checkAuth() {
    const url = baseURL + "/admin/view";
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) window.location.href="index.html";
}

function resetCreate() {
    const create = document.getElementById("create-window");
    const container = document.getElementById("create-window");
    const title = document.getElementById("title");
    const ingredients = document.getElementById("ingredients");
    const price = document.getElementById("price");

    title.value = "";
    ingredients.value = "";
    price.value = "";
    create.style.display = "none";
}