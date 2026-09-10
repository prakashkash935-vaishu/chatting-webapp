
// ==========================================
// LOVEBOX APP ❤️
// ==========================================

const API_URL = "http://localhost:5000/api";


// ==========================================
// CHECK LOGIN
// ==========================================

const loggedUser =
    localStorage.getItem("loveboxUser");

if (!loggedUser) {
    window.location.href = "login.html";
}


// ==========================================
// GET LOGGED-IN USER
// ==========================================

const user =
    JSON.parse(loggedUser);

console.log("Current logged-in user:", user);


// ==========================================
// VARIABLES
// ==========================================

let allEmails = [];


// ==========================================
// LOAD EMAILS
// ==========================================

async function loadEmails() {

    try {

        // Get emails for logged-in user
        const response =
            await fetch(
                `${API_URL}/emails?user_id=2`
            );

        const data =
            await response.json();

        console.log(
            "Emails received:",
            data
        );

        allEmails = data;


        // ==================================
        // CHECK URL HASH
        // ==================================

        if (window.location.hash === "#starred") {

            showStarred();

        } else if (
            window.location.hash === "#mylove"
        ) {

            showMyLove();

        } else {

            displayEmails(allEmails);

        }

    } catch (error) {

        console.error(
            "Load emails error:",
            error
        );

        const emailList =
            document.getElementById("emailList");

        if (emailList) {

            emailList.innerHTML =
                "<p>Unable to load emails ❌</p>";

        }

    }

}


// ==========================================
// DISPLAY EMAILS
// ==========================================

function displayEmails(emails) {

    const emailList =
        document.getElementById("emailList");

    if (!emailList) return;


    if (emails.length === 0) {

        emailList.innerHTML =
            "<p class='loading'>No love mails found ❤️</p>";

        return;
    }


    emailList.innerHTML = "";


    emails.forEach(email => {

        const div =
            document.createElement("div");

        div.className = "email";


        // Unread mail
        if (!email.is_read) {

            div.classList.add("unread");

        }


        div.innerHTML = `

            <div class="email-left">

                <strong>
                    ${email.sender || "Unknown"}
                </strong>

                <span>
                    ${email.subject || "No Subject"}
                </span>

            </div>


            <div class="email-middle">

                <p>
                    ${email.message || ""}
                </p>

            </div>


            <div class="email-right">

                <button
                    class="star-btn"
                    onclick="toggleStar(event, ${email.id})"
                >
                    ${email.is_starred ? "⭐" : "☆"}
                </button>

                <small>
                    ${formatDate(email.created_at)}
                </small>

            </div>

        `;


        // Open mail
        div.onclick = function () {

            window.location.href =
                `mail.html?id=${email.id}`;

        };


        emailList.appendChild(div);

    });

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) return "";

    return new Date(date)
        .toLocaleString();

}


// ==========================================
// SEARCH MAIL
// ==================================================
// ==========================================
// SEARCH MAIL
// ==========================================

function searchMail() {

    const searchInput =
        document.getElementById("search");

    if (!searchInput) return;


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredEmails =
        allEmails.filter(email => {

            return (

                (email.sender || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (email.subject || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (email.message || "")
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayEmails(filteredEmails);

}


// ==========================================
// TOGGLE STAR
// ==========================================

async function toggleStar(event, emailId) {

    event.stopPropagation();

    try {

        const response =
            await fetch(
                `${API_URL}/emails/${emailId}/star`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        console.log(
            "Star response:",
            data
        );


        if (response.ok) {

            await loadEmails();

        }

    } catch (error) {

        console.error(
            "Star error:",
            error
        );

    }

}


// ==========================================
// SHOW STARRED
// ==========================================

function showStarred() {

    window.location.hash = "starred";


    const pageTitle =
        document.getElementById("pageTitle");

    if (pageTitle) {

        pageTitle.innerText =
            "Starred ⭐";

    }


    const starredEmails =
        allEmails.filter(
            email => email.is_starred == 1
        );


    displayEmails(starredEmails);

}


// ==========================================
// SHOW MY LOVE
// ==========================================

function showMyLove() {

    window.location.hash = "mylove";


    const pageTitle =
        document.getElementById("pageTitle");

    if (pageTitle) {

        pageTitle.innerText =
            "My Love ❤️";

    }


    const myLoveEmails =
        allEmails.filter(email => {

            return (
                email.sender &&
                email.sender.toLowerCase()
                    .includes("love")
            );

        });


    displayEmails(myLoveEmails);

}


// ==========================================
// HASH CHANGE
// ==========================================

window.addEventListener(
    "hashchange",
    function () {

        if (
            window.location.hash === "#starred"
        ) {

            showStarred();

        } else if (
            window.location.hash === "#mylove"
        ) {

            showMyLove();

        } else {

            const pageTitle =
                document.getElementById("pageTitle");

            if (pageTitle) {

                pageTitle.innerText =
                    "Inbox ❤️";

            }

            displayEmails(allEmails);

        }

    }
);


// ==========================================
// LOAD EMAILS ON PAGE LOAD
// ==========================================

loadEmails();