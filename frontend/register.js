function registerUser() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const status = document.getElementById("registerStatus");

    if (name === "" || email === "" || password === "") {
        status.innerText = "Please fill all fields ❤️";
        return;
    }

    status.innerText = "Registering...";

    fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                status.innerText = "Registration successful! ❤️";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);

            } else {
                status.innerText = data.message || "Registration failed ❌";
            }

        })
        .catch(error => {
            console.error(error);
            status.innerText = "Backend connection failed ❌";
        });
}