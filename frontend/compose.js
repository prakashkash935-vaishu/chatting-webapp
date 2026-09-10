const API_URL = "http://localhost:5000/api";

// ===============================
// CHECK LOGIN
// ===============================

const loggedUser = localStorage.getItem("loveboxUser");

if (!loggedUser) {
    alert("Please login first ❌");
    window.location.href = "login.html";
}

const currentUser = JSON.parse(loggedUser);

console.log("COMPOSE CURRENT USER:", currentUser);


// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

    const receiver = document.getElementById("receiver");

    try {

        const response = await fetch(`${API_URL}/users`);

        const users = await response.json();

        console.log("Users received:", users);

        receiver.innerHTML =
            '<option value="">Select your Love ❤️</option>';

        users.forEach(user => {

            if (user.id === currentUser.id) {
                return;
            }

            const option = document.createElement("option");

            option.value = user.id;

            option.textContent =
                `${user.name} ❤️ (${user.email})`;

            receiver.appendChild(option);
        });

    } catch (error) {

        console.error("USER LOAD ERROR:", error);

    }
}


// ===============================
// SEND MAIL
// ===============================

async function sendMail() {

    const receiver_id =
        document.getElementById("receiver").value;

    const subject =
        document.getElementById("subject").value.trim();

    const message =
        document.getElementById("message").value.trim();

    const status =
        document.getElementById("status");


    if (!receiver_id) {
        status.innerText = "Please select receiver ❤️";
        return;
    }

    if (!subject || !message) {
        status.innerText =
            "Please fill subject and message ❤️";
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/emails`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    sender_id: currentUser.id,

                    receiver_id: Number(receiver_id),

                    subject: subject,

                    message: message
                })
            }
        );


        const data = await response.json();

        console.log("SEND MAIL RESPONSE:", data);


        if (response.ok && data.success) {

            status.innerText =
                "Love mail sent successfully ❤️";

            setTimeout(() => {
                window.location.href = "inbox.html";
            }, 1000);

        } else {

            status.innerText =
                data.error ||
                "Failed to send mail ❌";
        }


    } catch (error) {

        console.error("SEND MAIL ERROR:", error);

        status.innerText =
            "Backend connection failed ❌";
    }
}


// ===============================
// PAGE LOAD
// ===============================

loadUsers();