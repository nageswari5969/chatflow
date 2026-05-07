import cloudinary
import cloudinary.uploader
from flask import current_app

def configure_cloudinary():
    cloudinary.config(
        cloud_name=current_app.config['CLOUDINARY_CLOUD_NAME'],
        api_key=current_app.config['CLOUDINARY_API_KEY'],
        api_secret=current_app.config['CLOUDINARY_API_SECRET'],
    )

def upload_image(file, folder='chatflow'):
    configure_cloudinary()
    result = cloudinary.uploader.upload(file, folder=folder)
    return result.get('secure_url')

def delete_image(public_id):
    configure_cloudinary()
    cloudinary.uploader.destroy(public_id)
