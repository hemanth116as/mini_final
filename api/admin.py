from flask import Flask, request, jsonify, session
import imaplib
import email
from email.header import decode_header
import mysql.connector
from flask_cors import CORS
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# Secret key for session management
app.secret_key = os.urandom(24)

DB_CONFIG = {
    'user': 'root',
    'password': '1234',
    'host': 'localhost',
    'database': 'faculty_db'
}

def clean(text):
    return "".join(c if c.isalnum() else "_" for c in text)

def fetch_emails_from_user(imap_server, user_email, login_email, login_password):
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(login_email, login_password)
    mail.select("inbox")

    status, messages = mail.search(None, f'FROM "{user_email}"')
    email_ids = messages[0].split()

    emails = []

    for e_id in email_ids:
        res, msg = mail.fetch(e_id, "(RFC822)")
        for response_part in msg:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                subject, encoding = decode_header(msg["Subject"])[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else "utf-8")
                from_ = msg.get("From")

                email_data = {
                    "subject": subject,
                    "from": from_,
                    "body": ""
                }

                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        try:
                            body = part.get_payload(decode=True).decode()
                        except:
                            pass
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            email_data["body"] = body
                            break
                else:
                    body = msg.get_payload(decode=True).decode()
                    email_data["body"] = body

                emails.append(email_data)
    mail.logout()
    return emails

def get_faculty_emails():
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    cursor.execute("SELECT faculty_email FROM faculty")
    emails = [email[0] for email in cursor.fetchall()]
    cursor.close()
    connection.close()
    return emails

@app.route('/admin-fetch-emails', methods=['POST'])
def admin_fetch_emails():
    data = request.json
    admin_email = data.get('admin_email')
    admin_pass = data.get('admin_pass')
    imap_server = data.get('imap_server')

    if not all([admin_email, admin_pass, imap_server]):
        return jsonify({"error": "Missing required parameters"}), 400

    session['admin_email'] = admin_email
    session['admin_pass'] = admin_pass
    session['imap_server'] = imap_server

    try:
        faculty_emails = get_faculty_emails()
        all_emails = []
        for faculty_email in faculty_emails:
            emails = fetch_emails_from_user(imap_server, faculty_email, admin_email, admin_pass)
            all_emails.extend(emails)
        return jsonify(all_emails), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/faculty-emails', methods=['GET'])
def faculty_emails():
    try:
        emails = get_faculty_emails()
        return jsonify(emails), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    to = data.get('to')
    subject = data.get('subject')
    body = data.get('body')

    admin_email = 'itachi116as@gmail.com'
    admin_pass = 'mhxb jtye cjpa cnjz'
    imap_server = 'imap.gmail.com'

    if not all([to, subject, body, admin_email, admin_pass, imap_server]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        # Email configuration
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587

        # Create a multipart message
        message = MIMEMultipart()
        message['From'] = admin_email
        message['To'] = to
        message['Subject'] = subject

        # Attach body to the message
        message.attach(MIMEText(body, 'plain'))

        # Connect to the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection using TLS
        server.login(admin_email, admin_pass)

        # Send email
        server.sendmail(admin_email, to, message.as_string())
        server.quit()  # Disconnect from the server

        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
