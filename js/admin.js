"use strict";

const baseURL = "http://127.0.0.1:3000";

window.onload = async () => {
    // check if user is authorized
    await checkAuth();

    document.getElementById("logout-button").onclick = () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    };

    document.getElementById("add-button").onclick = () => addConsumable();
    document.getElementById("cancel-button").onclick = () => resetCreate();

    // draws the menu items
    drawConsumables(await getMenu());
}

// function that adds a new consumable to the database
async function addConsumable() {
    resetCreate();

    const container = document.getElementById("create-window");
    container.style.display = "flex";

    const form = document.getElementById("creation-form");
    form.onsubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        handleConsumable(formData, "add", container);
    }
};

// function that updates an existing consumable in the database
function updateConsumable(consumable) {
    resetCreate();

    const container = document.getElementById("create-window");
    const title = document.getElementById("title");
    const ingredients = document.getElementById("ingredients");
    const price = document.getElementById("price");
    const id = document.getElementById("id");

    title.value = consumable.title;
    ingredients.value = consumable.ingredients;
    price.value = consumable.price;
    id.value = consumable._id;

    container.style.display = "flex";

    const form = document.getElementById("creation-form");
    form.onsubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        handleConsumable(formData, "update", container);
    }
}

// used for adding and updating consumables. the function both validates inputs and sends API requests
async function handleConsumable(form, action, container) {
    const title = form.get("title");
    const ingredients = form.get("ingredients").toLowerCase().split(",");
    const price = form.get("price");
    
    // checking if ingredients is empty
    const ingredientExist = !(ingredients.length === 1 && ingredients[0] === "");
    
    // validating input
    if (!title || !ingredientExist || !price) {
        const missingTitle = document.getElementById("title").classList.toggle("red-border", !title);
        const MTT = document.getElementById("title-error-text");
        MTT.innerHTML = missingTitle ? "Måste fyllas i" : "";
        
        const missingIngredients = document.getElementById("ingredients").classList.toggle("red-border", !ingredientExist);
        const MIT = document.getElementById("ingredients-error-text");
        MIT.innerHTML = missingIngredients ? "Måste fyllas i" : "";

        const missingPrice = document.getElementById("price").classList.toggle("red-border", !price);
        const MPT = document.getElementById("price-error-text");
        MPT.innerHTML = missingPrice ? "Måste fyllas i" : "";
        
        return;
    }
    
    // checks if price is a number
    const isNumber = /^\d+$/.test(price);
    if (!isNumber) {
        document.getElementById("price").classList.toggle("red-border", !isNumber);
        document.getElementById("price-error-text").innerHTML = "Får endast innehålla siffror";
        return;
    }

    // add new consumable
    if (action === "add") {
        try {
            const url = baseURL + "/admin/add";
            const token = localStorage.getItem("token");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title: title,
                    ingredients: ingredients,
                    price: price
                })
            });

            // if the consumable was added correctly
            if (response.ok) {
                drawConsumables(await getMenu());
                container.style.display = "none";
            } else {
                console.log("Server error adding consumable");
            }
        } catch (error) {
            console.log("Error adding consumable: " + error);
        }
    // update existing consumable
    } else if (action == "update") {
        try {
            const id = form.get("id");
            const url = baseURL + "/admin/update/" + id;
            const token = localStorage.getItem("token");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title: title,
                    ingredients: ingredients,
                    price: price
                })
            })
            
            // if the consumable was updated correctly
            if (response.ok) {
                drawConsumables(await getMenu());
                container.style.display = "none";
            } else {
                console.log("Server error updating consumable");
            }
        } catch (error) {
            console.log("Error updating consumable: " + error);
        }
    }
}

// function to delete a consumable from the database
async function deleteConsumable(id) {
    try {
        const url = baseURL + "/admin/delete/" + id;
        const token = localStorage.getItem("token");
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // remove the deleted dish - finns det bättre sätt att göra utan att behöva ladda om?
        if (response.ok) location.reload();
    } catch (error) {
        console.log("Error deleting consumable: " + error);
    }
}

// function that draws all consumables, uses an object as argument
function drawConsumables(consumables) {
    const container = document.getElementById("consumable-container");
    container.innerHTML = "";

    consumables.consumables.forEach((consumable) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const ingr = document.createElement("p");
        const price = document.createElement("p");
        const buttonDiv = document.createElement("div");
        const updateBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        // updates consumable in database, consumable object as parameter
        updateBtn.onclick = () => updateConsumable(consumable);

        // deletes consumable from database, objectID of consumable as parameter
        deleteBtn.onclick = () => deleteConsumable(consumable._id);

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
        buttonDiv.appendChild(updateBtn);
        buttonDiv.appendChild(deleteBtn);
        div.appendChild(buttonDiv);
        container.appendChild(div);
    });
}

// gets the current menu from the database
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

// authorizes the user - redirects to index.html if not authorized
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

// resets the create-window used for creation of new consumables or updating of existing ones
function resetCreate() {
    const create = document.getElementById("create-window");
    const title = document.getElementById("title");
    const ingredients = document.getElementById("ingredients");
    const price = document.getElementById("price");

    document.getElementById("title-error-text").innerHTML = "";
    document.getElementById("ingredients-error-text").innerHTML = "";
    document.getElementById("price-error-text").innerHTML = "";

    title.classList.remove("red-border");
    ingredients.classList.remove("red-border");
    price.classList.remove("red-border");

    title.value = "";
    ingredients.value = "";
    price.value = "";
    create.style.display = "none";
}