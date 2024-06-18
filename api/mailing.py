import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email configuration
smtp_server = 'smtp.gmail.com'
smtp_port = 587  
smtp_username = 'itachi116as@gmail.com'
smtp_password = 'mhxb jtye cjpa cnjz'
sender_email = 'itachi116as@gmail.com'
receiver_email = 'hemanth116as@gmail.com'
subject = 'Subject of the Email'
body = 'Body of the Email'

# Create a multipart message
message = MIMEMultipart()
message['From'] = sender_email
message['To'] = receiver_email
message['Subject'] = subject

# Attach body to the message
message.attach(MIMEText(body, 'plain'))

# Connect to the SMTP server
try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()  # Secure the connection using TLS
    server.login(smtp_username, smtp_password)
    
    # Send email
    server.sendmail(sender_email, receiver_email, message.as_string())
    print('Email sent successfully!')
except Exception as e:
    print(f'Error sending email: {str(e)}')
finally:
    server.quit()  # Disconnect from the server
