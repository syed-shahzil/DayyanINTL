from fastapi import APIRouter
from app.api.endpoints import auth, products, utils, orders, users, cart, wishlist, stats

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
