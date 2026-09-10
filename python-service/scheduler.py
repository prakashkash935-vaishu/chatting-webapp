try:
    import mysql.connector  # type: ignore[import-not-found]
except ImportError as exc:
    raise RuntimeError(
        "mysql-connector-python is required. Install it with: pip install mysql-connector-python"
    ) from exc

import time
from datetime import datetime


def check_scheduled_emails():

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Prakash$1999",
        database="lovebox"
    )

    cursor = db.cursor(dictionary=True)


    cursor.execute("""
        SELECT *
        FROM scheduled_emails
        WHERE unlock_at <= NOW()
        AND is_unlocked = FALSE
    """)


    emails = cursor.fetchall()


    for email in emails:

        print(
            "Unlocking:",
            email["subject"]
        )

        cursor.execute("""
            INSERT INTO emails
            (sender_id, receiver_id, subject, message)
            VALUES (%s, %s, %s, %s)
        """, (
            email["sender_id"],
            email["receiver_id"],
            email["subject"],
            email["message"]
        ))


        cursor.execute("""
            UPDATE scheduled_emails
            SET is_unlocked = TRUE
            WHERE id = %s
        """, (email["id"],))


    db.commit()

    cursor.close()
    db.close()


while True:

    check_scheduled_emails()

    time.sleep(25)