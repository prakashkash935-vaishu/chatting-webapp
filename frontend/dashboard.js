const API_URL = "http://localhost:5000/api";

// ==========================================
// CHECK LOGIN
// ==========================================

const loggedUser = localStorage.getItem("loveboxUser");

if (!loggedUser) {
    window.location.href = "login.html";
}

const user = JSON.parse(loggedUser);

console.log("DASHBOARD USER:", user);


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        // ===============================
        // LOVE MAILS
        // ===============================

        const emailResponse =
            await fetch(
                `${API_URL}/emails?user_id=${user.id}`
            );

        const emails =
            await emailResponse.json();

        console.log("Dashboard Emails:", emails);

        document.getElementById("mailCount").textContent =
            emails.length;


        // ===============================
        // STARRED
        // ===============================

        const starredEmails =
            emails.filter(
                email => email.is_starred == 1
            );

        document.getElementById("starCount").textContent =
            starredEmails.length;


        // ===============================
        // MEMORIES
        // ===============================

        const memoryResponse =
            await fetch(
                `${API_URL}/memories`
            );

        const memories =
            await memoryResponse.json();

        console.log("Dashboard Memories:", memories);

        document.getElementById("memoryCount").textContent =
            memories.length;


        // ===============================
        // SECRETS
        // ===============================

        const secrets =
            JSON.parse(
                localStorage.getItem("loveboxSecrets")
            ) || [];

        document.getElementById("secretCount").textContent =
            secrets.length;


        // ===============================
        // WELCOME USER NAME
        // ===============================

        const welcomeUser =
            document.getElementById("welcomeUser");

        if (welcomeUser) {

            welcomeUser.textContent =
                user.name || "My Love";

        }


        console.log("Dashboard loaded successfully ❤️");

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ==========================================
// START DASHBOARD
// ==========================================

loadDashboard();