from flask import Flask, jsonify, request
from flask_cors import CORS
import imaplib
import email
from email.header import decode_header
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# IMAP Configuration (Update with your email server details)
IMAP_SERVER = 'imap.gmail.com'
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
ADMIN_EMAIL = 'itachi116as@gmail.com'

def fetch_emails(login_email, login_password):
    try:
        # Connect to the IMAP server
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(login_email, login_password)
        mail.select('inbox')

        # Search for emails from the admin
        status, response = mail.search(None, 'FROM', ADMIN_EMAIL)

        # Initialize an empty list to store fetched emails
        emails = []

        for num in response[0].split():
            status, data = mail.fetch(num, '(RFC822)')
            raw_email = data[0][1]
            msg = email.message_from_bytes(raw_email)

            # Decode email subject and sender
            subject, encoding = decode_header(msg['Subject'])[0]
            sender = msg.get('From')

            if isinstance(subject, bytes):
                subject = subject.decode(encoding or 'utf-8')

            # Extract email body
            body = ''
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    if content_type == 'text/plain':
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                body = msg.get_payload(decode=True).decode()

            emails.append({
                'subject': subject,
                'from': sender,
                'body': body
            })

        mail.logout()
        return emails

    except imaplib.IMAP4.error as e:
        print(f"IMAP Error: {str(e)}")
        return None  # Return None to indicate login error

    except Exception as e:
        print(f"Error fetching emails: {str(e)}")
        return []

def send_email(from_email, to_email, subject, body, login_password):
    try:
        # Create a multipart message
        message = MIMEMultipart()
        message['From'] = from_email
        message['To'] = to_email
        message['Subject'] = subject

        # Attach body to the message
        message.attach(MIMEText(body, 'plain'))

        # Connect to the SMTP server
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Secure the connection using TLS
        server.login(from_email, login_password)

        # Send email
        server.sendmail(from_email, to_email, message.as_string())
        print('Email sent successfully!')
        server.quit()  # Disconnect from the server
        return True
    except smtplib.SMTPAuthenticationError:
        print('SMTP Authentication Error: Invalid credentials')
        return False
    except Exception as e:
        print(f'Error sending email: {str(e)}')
        return False

@app.route('/fetch-admin-emails', methods=['POST'])
def fetch_admin_emails():
    data = request.json
    login_email = data.get('login_email')
    login_password = data.get('login_password')
    if not login_email or not login_password:
        return jsonify({"error": "Missing login credentials"}), 400

    emails = fetch_emails(login_email, login_password)
    if emails is None:
        return jsonify({"error": "Invalid credentials"}), 401  # Unauthorized status code
    else:
        return jsonify(emails), 200

@app.route('/send-email-to-admin', methods=['POST'])
def send_email_to_admin():
    data = request.json
    from_email = data.get('from')
    to_email = ADMIN_EMAIL
    subject = data.get('subject')
    body = data.get('body')
    login_password = data.get('login_password')

    if not from_email or not subject or not body or not login_password:
        return jsonify({"error": "Missing required fields"}), 400

    # Sending email to admin
    if send_email(from_email, to_email, subject, body, login_password):
        return jsonify({"message": "Email sent successfully"}), 200
    else:
        return jsonify({"error": "Failed to send email. Check your credentials."}), 401

if __name__ == '__main__':
    app.run(debug=True)
