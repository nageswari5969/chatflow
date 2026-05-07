import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-change-me')
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/chatflow')
    CLERK_SECRET_KEY = os.getenv('CLERK_SECRET_KEY', '')
    CLERK_PUBLISHABLE_KEY = os.getenv('CLERK_PUBLISHABLE_KEY', '')
    CLERK_JWKS_URL = os.getenv('CLERK_JWKS_URL', '')
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', '')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET', '')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
