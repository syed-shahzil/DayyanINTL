from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from app.api import deps
from app.core.database import get_db
from app.models.product import Product, Category
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse

router = APIRouter()

# --- Categories ---

@router.get("/categories", response_model=List[CategoryResponse])
async def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Retrieve categories.
    """
    result = await db.execute(select(Category).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/categories", response_model=CategoryResponse)
async def create_category(
    *,
    db: AsyncSession = Depends(get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Create new category.
    """
    category = Category(**category_in.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

# --- Products ---

@router.get("/products", response_model=List[ProductResponse])
async def read_products(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[str] = None,
    search: Optional[str] = None,
) -> Any:
    """
    Retrieve products.
    """
    query = select(Product).options(selectinload(Product.category)).order_by(desc(Product.created_at))
    
    if category_id:
        query = query.where(Product.category_id == category_id)
        
    if search:
        query = query.where(Product.name.contains(search))
        
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/products", response_model=ProductResponse)
async def create_product(
    *,
    db: AsyncSession = Depends(get_db),
    product_in: ProductCreate,
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Create new product.
    """
    product = Product(**product_in.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    
    # Eager load category for response
    # Re-fetch with category
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == product.id)
    )
    return result.scalars().first()

@router.get("/products/{id}", response_model=ProductResponse)
async def read_product(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
) -> Any:
    """
    Get product by ID.
    """
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == id)
    )
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/products/{id}", response_model=ProductResponse)
async def update_product(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    product_in: ProductUpdate,
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Update product.
    """
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
        
    db.add(product)
    await db.commit()
    await db.refresh(product)
    
    # Re-fetch for category
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == id)
    )
    return result.scalars().first()

@router.delete("/products/{id}", response_model=ProductResponse)
async def delete_product(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Delete product.
    """
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    await db.delete(product)
    await db.commit()
    return product
