
const API_URL = "http://localhost:5000/api";

// ==========================================
// GET EMAIL ID FROM URL
// ==========================================

const params =
    new URLSearchParams(window.location.search);

const emailId =
    params.get("id");


// ==========================================
// LOAD EMAIL
// ==========================================

async function loadMail() {

    try {

        const response =
            await fetch(`${API_URL}/emails/${emailId}`);

        const mail =
            await response.json();


        if (!response.ok) {

            document.getElementById("mailContent").innerHTML =
                `<p>Email not found ❌</p>`;

            return;

        }


        // ==========================================
        // DISPLAY MAIL
        // ==========================================

        document.getElementById("mailContent").innerHTML = `

            <div class="mail-header">

                <h1>
                    ${mail.subject} ❤️
                </h1>

                <p>
                    From:
                    <strong>${mail.sender}</strong>
                </p>

                <small>
                    ${new Date(mail.created_at).toLocaleString()}
                </small>

            </div>

            <hr>

            <div class="mail-message">

                ${mail.message}

            </div>

            <div class="mail-footer">

                ❤️ Forever Yours

            </div>

        `;


        // ==========================================
        // STAR BUTTON
        // ==========================================

        document.getElementById("starButton").innerText =
            mail.is_starred ? "⭐" : "☆";


        document.getElementById("starButton").onclick =
            async function () {

                try {

                    await fetch(
                        `${API_URL}/emails/${emailId}/star`,
                        {
                            method: "PUT"
                        }
                    );

                    loadMail();

                } catch (error) {

                    console.log(
                        "Star error:",
                        error
                    );

                }

            };


        // ==========================================
        // MARK AS READ
        // ==========================================

        await fetch(
            `${API_URL}/emails/${emailId}/read`,
            {
                method: "PUT"
            }
        );


        // ==========================================
        // DELETE BUTTON
        // ==========================================

        document.getElementById("deleteButton").onclick =
            async function () {

                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this love mail? 🗑️❤️"
                    );


                if (!confirmDelete) {

                    return;

                }


                try {
                    console.log("DELETE CLICKED:", emailId);

                    const response =
                        await fetch(
                            `${API_URL}/emails/${emailId}`,
                            {
                                method: "DELETE"
                            }
                        );


                    const data =
                        await response.json();


                    if (data.success) {

                        alert(
                            "Love mail deleted successfully 🗑️❤️"
                        );


                        window.location.href =
                            "inbox.html";

                    } else {

                        alert(
                            "Failed to delete mail ❌"
                        );

                    }


                } catch (error) {

                    console.log(
                        "Delete error:",
                        error
                    );

                    alert(
                        "Unable to delete mail ❌"
                    );

                }

            };

    } catch (error) {

        console.log(error);

        document.getElementById("mailContent").innerHTML =
            `<p>Unable to load love mail ❌</p>`;

    }

}


// ==========================================
// START
// ==========================================

loadMail();