
// ==========================================
// LOVEBOX BACKEND SERVER ❤️
// ==========================================

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ==========================================
// UPLOADS FOLDER
// ==========================================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


// ==========================================
// MULTER IMAGE UPLOAD
// ==========================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(__dirname, "uploads")
        );

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});

const upload = multer({
    storage: storage
});


// ==========================================
// HOME / TEST API
// ==========================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "LOVEBOX Backend is running ❤️"

    });

});


// ==========================================
// REGISTER USER
// ==========================================

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;


    if (!name || !email || !password) {

        return res.status(400).json({

            success: false,

            error:
                "All fields are required"

        });

    }


    const checkSql =
        "SELECT id FROM users WHERE email = ?";


    db.query(
        checkSql,
        [email],
        (err, results) => {

            if (err) {

                console.log(
                    "REGISTER CHECK ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Database error"

                });

            }


            if (results.length > 0) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Email already registered"

                });

            }


            const insertSql = `
                INSERT INTO users
                (name, email, password)
                VALUES (?, ?, ?)
            `;


            db.query(
                insertSql,
                [
                    name,
                    email,
                    password
                ],
                (err, result) => {

                    if (err) {

                        console.log(
                            "REGISTER ERROR:",
                            err
                        );

                        return res.status(500).json({

                            success: false,

                            error:
                                "Registration failed"

                        });

                    }


                    res.json({

                        success: true,

                        message:
                            "Registration successful ❤️",

                        userId:
                            result.insertId

                    });

                }
            );

        }
    );

});


// ======================
// LOGIN USER
// ==========================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            success: false,

            error:
                "Email and password are required"

        });

    }


    const sql = `
        SELECT
            id,
            name,
            email
        FROM users
        WHERE email = ?
        AND password = ?
    `;


    db.query(
        sql,
        [
            email,
            password
        ],
        (err, results) => {

            if (err) {

                console.log(
                    "LOGIN ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Database error"

                });

            }


            if (results.length === 0) {

                return res.status(401).json({

                    success: false,

                    error:
                        "Invalid email or password"

                });

            }


            res.json({

                success: true,

                message:
                    "Login successful ❤️",

                user:
                    results[0]

            });

        }
    );

});


// ==========================================
// GET ALL USERS
// Used in Compose page
// ==========================================

app.get("/api/users", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email
        FROM users
        ORDER BY name
    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.log(
                    "USERS ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Database error"

                });

            }


            res.json(results);

        }
    );

});


// ==========================================
// GET MY INBOX EMAILS
// ==========================================

app.get("/api/emails", (req, res) => {

    const userId =
        req.query.user_id;


    if (!userId) {

        return res.status(400).json({

            success: false,

            error:
                "User ID is required"

        });

    }


    const sql = `
        SELECT

            emails.id,

            emails.sender_id,

            emails.receiver_id,

            users.name AS sender,

            emails.subject,

            emails.message,

            emails.is_read,

            emails.is_starred,

            emails.created_at

        FROM emails

        JOIN users

        ON emails.sender_id = users.id

        WHERE emails.receiver_id = ?

        ORDER BY emails.created_at DESC
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.log(
                    "GET EMAILS ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

});
// ==========================================
// GET MY INBOX EMAILS
// ==========================================

app.get("/api/emails", (req, res) => {

    const userId =
        req.query.user_id;


    if (!userId) {

        return res.status(400).json({

            success: false,

            error:
                "User ID is required"

        });

    }


    const sql = `
        SELECT

            emails.id,

            emails.sender_id,

            emails.receiver_id,

            users.name AS sender,

            emails.subject,

            emails.message,

            emails.is_read,

            emails.is_starred,

            emails.created_at

        FROM emails

        JOIN users

        ON emails.sender_id = users.id

        WHERE emails.receiver_id = ?

        ORDER BY emails.created_at DESC
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.log(
                    "GET EMAILS ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

});


// ==========================================
// GET SINGLE EMAIL
// ==========================================

app.get("/api/emails/:id", (req, res) => {

    const emailId =
        req.params.id;


    const sql = `
        SELECT

            emails.id,

            emails.sender_id,

            emails.receiver_id,

            users.name AS sender,

            emails.subject,

            emails.message,

            emails.is_read,

            emails.is_starred,

            emails.created_at

        FROM emails

        JOIN users

        ON emails.sender_id = users.id

        WHERE emails.id = ?
    `;


    db.query(
        sql,
        [emailId],
        (err, results) => {

            if (err) {

                console.log(
                    "GET SINGLE EMAIL ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Database error"

                });

            }


            if (results.length === 0) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Email not found"

                });

            }


            res.json(results[0]);

        }
    );

});


// ==========================================
// SEND EMAIL
// ==========================================

app.post("/api/emails", (req, res) => {

    const {
        sender_id,
        receiver_id,
        subject,
        message
    } = req.body;


    if (
        !sender_id ||
        !receiver_id ||
        !subject ||
        !message
    ) {

        return res.status(400).json({

            success: false,

            error:
                "All email fields are required"

        });

    }


    const sql = `
        INSERT INTO emails
        (
            sender_id,
            receiver_id,
            subject,
            message
        )
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            sender_id,
            receiver_id,
            subject,
            message
        ],
        (err, result) => {

            if (err) {

                console.log(
                    "SEND EMAIL ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Failed to send email"

                });

            }


            res.json({

                success: true,

                message:
                    "Love mail sent successfully ❤️",

                emailId:
                    result.insertId

            });

        }
    );

});


// ==========================================
// STAR / UNSTAR EMAIL
// ==========================================

app.put("/api/emails/:id/star", (req, res) => {

    const emailId =
        req.params.id;


    const sql = `
        UPDATE emails
        SET is_starred =
            CASE
                WHEN is_starred = 1 THEN 0
                ELSE 1
            END
        WHERE id = ?
    `;


    db.query(
        sql,
        [emailId],
        (err) => {

            if (err) {

                console.log(
                    "STAR ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Failed to update star"

                });

            }


            res.json({

                success: true,

                message:
                    "Star updated ⭐"

            });

        }
    );

});


// ==========================================
// MARK EMAIL AS READ
// ==========================================

app.put("/api/emails/:id/read", (req, res) => {

    const emailId =
        req.params.id;


    const sql = `
        UPDATE emails
        SET is_read = 1
        WHERE id = ?
    `;


    db.query(
        sql,
        [emailId],
        (err) => {

            if (err) {

                console.log(
                    "READ ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Failed to mark email as read"

                });

            }


            res.json({

                success: true,

                message:
                    "Email marked as read ❤️"

            });

        }
    );

});

// ==========================================
// UPLOAD MEMORY PHOTO
// ==========================================

app.post(
    "/api/memories/upload",
    upload.single("image"),
    (req, res) => {

        console.log("MEMORY UPLOAD ROUTE CALLED ❤️");

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No image uploaded"
            });
        }

        const title = req.body.title || "";
        const description = req.body.description || "";

        const sql = `
            INSERT INTO memories
            (title, description, photo)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [title, description, req.file.filename],
            (err, result) => {

                if (err) {
                    console.log("MYSQL MEMORY ERROR:", err);

                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                console.log("MEMORY SAVED ❤️");

                res.json({
                    success: true,
                    message: "Memory uploaded ❤️",
                    memoryId: result.insertId,
                    photo: req.file.filename
                });
            }
        );
    }
);

// ==========================================
// GET MEMORIES
// ==========================================

app.get("/api/memories", (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            description,
            photo,
            created_at
        FROM memories
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log("GET MEMORIES ERROR:", err);

            return res.status(500).json({
                success: false,
                error: err.message
            });

        }

        res.json(results);

    });

});
// ==========================================
// DELETE MEMORY
// ==========================================

app.delete("/api/memories/:id", (req, res) => {

    const memoryId = req.params.id;

    const sql = "DELETE FROM memories WHERE id = ?";

    db.query(sql, [memoryId], (err, result) => {

        if (err) {
            console.log("DELETE MEMORY ERROR:", err);

            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "Memory not found"
            });
        }

        console.log("MEMORY DELETED ❤️");

        res.json({
            success: true,
            message: "Memory deleted successfully ❤️"
        });

    });

});
// ==========================================
// DELETE EMAIL
// ==========================================

app.delete("/api/emails/:id", (req, res) => {

    console.log(
        "DELETE ROUTE CALLED:",
        req.params.id
    );


    const emailId =
        req.params.id;


    const sql =
        "DELETE FROM emails WHERE id = ?";


    db.query(
        sql,
        [emailId],
        (err, result) => {

            if (err) {

                console.log(
                    "DELETE ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    error:
                        "Failed to delete email"

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Email not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Love mail deleted successfully 🗑️❤️"

            });

        }
    );

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log("");

    console.log(
        "================================="
    );

    console.log(
        "❤️ LOVEBOX SERVER STARTED ❤️"
    );

    console.log(
        "================================="
    );

    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );

    console.log(
        `📡 API running on http://localhost:${PORT}/api`
    );

    console.log(
        "================================="
    );

    console.log("");

});