const API_URL = "http://localhost:5000/api";

async function uploadMemory() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const photo = document.getElementById("photo").files[0];
    const status = document.getElementById("status");

    if (!title || !photo) {
        status.innerText = "Please enter title and select a photo ❤️";
        return;
    }

    const currentUser =
        JSON.parse(localStorage.getItem("loveboxUser"));

    if (!currentUser) {
        status.innerText = "Please login first ❌";
        return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", photo);
    try {

        status.innerText = "Uploading... ❤️";

        console.log("MEMORY UPLOAD REQUEST STARTED ❤️");
        const response = await fetch(
            `${API_URL}/memories/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const text = await response.text();

        console.log("MEMORY UPLOAD RESPONSE:", text);

        if (!response.ok) {
            throw new Error(text);
        }

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.error);
        }

        status.innerText = "Memory added successfully ❤️📸";

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("photo").value = "";

        loadMemories();

    } catch (error) {

        console.error("MEMORY ERROR:", error);

        status.innerText =
            "UPLOAD ERROR ❌ " + error.message;

        alert("UPLOAD ERROR ❌\n" + error.message);
    }


}

async function loadMemories() {

    try {

        const response =
            await fetch(`${API_URL}/memories`);

        const memories =
            await response.json();

        const container =
            document.getElementById("memoryList");

        container.innerHTML = "";

        memories.forEach(memory => {

            const div =
                document.createElement("div");

            div.className = "memory-card";

            div.innerHTML = `
                <img
                    src="http://localhost:5000/uploads/${memory.photo}"
                    alt="${memory.title}"
                    onclick="openFullScreen(this.src)"
                >

                <h2>${memory.title} ❤️</h2>

                <p>${memory.description || ""}</p>

                <small>
                    ${new Date(memory.created_at).toLocaleDateString()}
                </small>
    
<button class="delete-memory"
        onclick="deleteMemory(event, ${memory.id})">
    🗑️ Delete
</button>
            `;

            container.appendChild(div);

        });

    } catch (error) {

        console.log(error);

    }
}
async function deleteMemory(event, memoryId) {

    event.stopPropagation();

    const confirmDelete = confirm(
        "இந்த beautiful memory-யை delete செய்யவா? 🗑️❤️"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${API_URL}/memories/${memoryId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log("DELETE MEMORY RESPONSE:", data);

        if (response.ok && data.success) {

            alert("Memory deleted successfully 🗑️❤️");

            loadMemories();
            updateMemoryCount();

        } else {

            alert(data.error || "Failed to delete memory ❌");

        }

    } catch (error) {

        console.error("DELETE MEMORY ERROR:", error);

        alert("Unable to delete memory ❌");

    }
}

loadMemories();

async function updateMemoryCount() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/memories"
        );

        const memories = await response.json();

        document.getElementById("memoryCount").textContent =
            `${memories.length} Memories ❤️`;

    } catch (error) {

        console.error("Memory count error:", error);

    }
}
function openFullScreen(imageSrc) {
    const overlay = document.createElement("div");

    overlay.id = "imageOverlay";

    overlay.innerHTML = `
        <span class="close-image" onclick="closeFullScreen()">✕</span>
        <img src="${imageSrc}" alt="Memory">
    `;

    document.body.appendChild(overlay);
}

function closeFullScreen() {
    const overlay = document.getElementById("imageOverlay");

    if (overlay) {
        overlay.remove();
    }
}

updateMemoryCount();
