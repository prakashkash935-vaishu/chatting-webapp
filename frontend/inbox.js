const API_URL = "http://localhost:5000/api";


// ===============================
// LOAD INBOX
// ===============================

async function loadInbox() {

    const currentUser =
        JSON.parse(localStorage.getItem("user"));

    // Login இல்லையென்றால் login page
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    console.log("Logged in user:", currentUser);

    try {

        const response =
            await fetch(`${API_URL}/emails`);

        const emails =
            await response.json();

        console.log("All emails:", emails);

        // Current user-க்கு வந்த mails மட்டும்
        const myEmails = emails.filter(
            email =>
                Number(email.receiver_id) ===
                Number(currentUser.id)
        );

        console.log("My inbox:", myEmails);

        displayEmails(myEmails);

    } catch (error) {

        console.error("INBOX ERROR:", error);

        document.getElementById("emailList").innerHTML =
            "<p>Backend connection failed ❌</p>";
    }
}


// ===============================
// DISPLAY EMAILS
// ===============================

function displayEmails(emails) {

    const emailList =
        document.getElementById("emailList");

    emailList.innerHTML = "";

    if (emails.length === 0) {

        emailList.innerHTML = `
            <p class="loading">
                No love mails yet ❤️
            </p>
        `;

        return;
    }


    emails.forEach(email => {

        const mail =
            document.createElement("div");

        mail.className = "email-item";

        mail.innerHTML = `
            <h3>❤️ ${email.subject}</h3>

            <p>
                <strong>From:</strong>
                ${email.sender}
            </p>

            <p>
                ${email.message}
            </p>
        `;

        emailList.appendChild(mail);

    });
}


// ===============================
// PAGE LOAD
// ===============================

loadInbox();