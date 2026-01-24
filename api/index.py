import sys
import os

# Add the backend directory to the path so we can import the app
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app

# This is for Vercel's Python runtime
handler = app
