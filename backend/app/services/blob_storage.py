from azure.storage.blob import BlobServiceClient
from app.core.config import settings
import uuid
import os

def upload_image_to_blob(file_content: bytes, filename: str, content_type: str) -> str:
    if not settings.AZURE_STORAGE_CONNECTION_STRING:
        # Fallback or error if not configured
        raise Exception("Azure Storage Connection String not configured")
        
    try:
        blob_service_client = BlobServiceClient.from_connection_string(settings.AZURE_STORAGE_CONNECTION_STRING)
        container_client = blob_service_client.get_container_client(settings.AZURE_CONTAINER_NAME)
        
        # Create container if not exists
        if not container_client.exists():
            container_client.create_container(public_access="blob")
            
        # Generate unique filename
        ext = os.path.splitext(filename)[1]
        blob_name = f"{uuid.uuid4()}{ext}"
        blob_client = container_client.get_blob_client(blob_name)
        
        blob_client.upload_blob(file_content, content_settings={"content_type": content_type}, overwrite=True)
        
        return blob_client.url
    except Exception as e:
        print(f"Error uploading to Azure: {e}")
        raise e
