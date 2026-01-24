from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import Any
from app.api import deps
from app.services import blob_storage
from app.models.user import User

router = APIRouter()

@router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_manager) # Only managers/owners can upload
) -> Any:
    """
    Upload an image to Azure Blob Storage.
    Returns the URL of the uploaded image.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Check file size (optional, can be done via middleware or reading chunks)
    # content = await file.read()
    # if len(content) > 5 * 1024 * 1024: ...
    
    try:
        content = await file.read()
        url = blob_storage.upload_image_to_blob(content, file.filename, file.content_type)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
