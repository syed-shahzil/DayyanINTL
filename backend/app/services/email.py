import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, html_content: str) -> bool:
    if not settings.SMTP_SERVER or not settings.SMTP_PORT or not settings.SMTP_USER:
        logger.warning("SMTP settings not configured. Email to %s not sent.", to_email)
        return False
        
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = settings.FROM_EMAIL or settings.SMTP_USER
        message["To"] = to_email

        part = MIMEText(html_content, "html")
        message.attach(part)

        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.FROM_EMAIL or settings.SMTP_USER, to_email, message.as_string())
        
        return True
    except Exception as e:
        logger.error("Failed to send email: %s", e)
        return False

def send_verification_email(to_email: str, code: str) -> bool:
    subject = "Verify your email - DayyanINTL"
    html_content = f"""
    <html>
        <body>
            <h2>Welcome to DayyanINTL</h2>
            <p>Please verify your email address by entering the following code:</p>
            <h1>{code}</h1>
            <p>This code will expire in 24 hours.</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, html_content)

def send_order_notification(to_email: str, order_id: str, total: float) -> bool:
    subject = f"New Order Received: {order_id}"
    html_content = f"""
    <html>
        <body>
            <h2>New Order Received</h2>
            <p>Order ID: <b>{order_id}</b></p>
            <p>Total Amount: <b>${total}</b></p>
            <p>Please check the owner dashboard for details.</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, html_content)
