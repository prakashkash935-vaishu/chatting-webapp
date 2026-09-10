// ==========================================
// LOVEBOX LOGIN ❤️
// ==========================================

const API_URL = "http://localhost:5000/api";


// ==========================================
// LOGIN USER
// ==========================================

async function loginUser() {

    console.log("Login button clicked ❤️");
    console.log("Login API called");


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const status =
        document.getElementById("loginStatus");


    // ======================================
    // VALIDATION
    // ======================================

    if (!email || !password) {

        status.innerText =
            "Please enter email and password ❌";

        return;
    }


    status.innerText =
        "Logging in... ❤️";


    try {

        // ==================================
        // CALL LOGIN API
        // ==================================

        const response = await fetch(
            `${API_URL}/login`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: email,

                    password: password

                })

            }
        );


        const data =
            await response.json();


        console.log(
            "Login response:",
            data
        );


        // ==================================
        // LOGIN SUCCESS
        // ==================================

        if (response.ok && data.success) {

            status.innerText =
                "Login successful ❤️";


            // Save logged-in user
            localStorage.setItem(
                "loveboxUser",
                JSON.stringify(data.user)
            );


            console.log(
                "Logged in user:",
                data.user
            );


            // ==================================
            // NEXT PAGE
            // ==================================

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 1000);


        } else {

            status.innerText =
                data.error ||
                "Invalid email or password ❌";

        }

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        status.innerText =
            "Backend connection failed ❌";

    }

}