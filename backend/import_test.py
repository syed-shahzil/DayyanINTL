
print("DEBUG: Starting import test...")
try:
    from app.core.config import settings
    print(f"DEBUG: settings loaded, PROJECT_NAME: {settings.PROJECT_NAME}")
    
    from app.core.security import pwd_context
    print("DEBUG: security.pwd_context loaded")
    
    from app.core.database import Base, engine
    print("DEBUG: database Base and engine loaded")
    
    from app import models
    print("DEBUG: app.models loaded")
    
    from app.api.api import api_router
    print("DEBUG: api_router loaded")
    
    from app.main import app
    print("DEBUG: app.main.app loaded")
    
    print("✅ ALL IMPORTS SUCCESSFUL")
except Exception as e:
    print(f"❌ IMPORT FAILED: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
