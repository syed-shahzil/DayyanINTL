"""
Test database connectivity and check if tables exist
"""
import asyncio
import sys
from sqlalchemy import text, inspect
from app.core.database import engine
from app.core.config import settings

async def test_connection():
    print("="*60)
    print("DATABASE CONNECTION TEST")
    print("="*60)
    
    print(f"\n📋 Connection String (masked):")
    dsn_parts = settings.SQL_SERVER_DSN.split('@')
    if len(dsn_parts) > 1:
        print(f"   Server: {dsn_parts[1].split('/')[0]}")
        print(f"   Database: {dsn_parts[1].split('/')[-1].split('?')[0]}")
    else:
        print(f"   {settings.SQL_SERVER_DSN[:50]}...")
    
    try:
        # Test basic connection
        print("\n🔌 Testing connection...")
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("   ✅ Connection successful!")
            
            # Check SQL Server version
            result = await conn.execute(text("SELECT @@VERSION"))
            version = result.scalar()
            print(f"\n📊 SQL Server Version:")
            print(f"   {version[:100]}...")
            
        # Check if tables exist
        print("\n📦 Checking tables...")
        async with engine.connect() as conn:
            # Get list of tables
            result = await conn.execute(text("""
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_NAME
            """))
            tables = [row[0] for row in result.fetchall()]
            
            if tables:
                print(f"   ✅ Found {len(tables)} table(s):")
                for table in tables:
                    print(f"      - {table}")
            else:
                print("   ⚠️  No tables found in database!")
                print("   📝 Expected tables: users, email_verifications, products, categories, orders, order_items, cart_items, wishlist_items, audit_logs")
                
        print("\n✅ Database connectivity test completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Database connection failed!")
        print(f"   Error type: {type(e).__name__}")
        print(f"   Error message: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
