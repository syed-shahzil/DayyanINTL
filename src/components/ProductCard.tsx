import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sku: string;
  isWishlisted?: boolean;
}

export function ProductCard({ id, name, price, image, category, sku, isWishlisted = false }: ProductCardProps) {
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const handleAddToCart = async () => {
    if (!auth?.user) {
      alert('Please sign in to add items to cart');
      return;
    }

    if (cart) {
      await cart.addItem(id, 1);
      alert('Added to cart');
    }
  };

  const handleWishlist = async () => {
    if (!auth?.user) {
      alert('Please sign in to add to wishlist');
      return;
    }

    setIsWishlistLoading(true);
    if (wishlisted) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', auth.user.id)
        .eq('product_id', id);
      setWishlisted(false);
    } else {
      await supabase
        .from('wishlist_items')
        .insert({ user_id: auth.user.id, product_id: id });
      setWishlisted(true);
    }
    setIsWishlistLoading(false);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/product/${id}`;
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} on DayyanINTL`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow hover:border-primary-300 group">
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-gray-100 h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-primary-600 shadow-md">
          {category}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${id}`} className="block mb-2 hover:text-primary-600 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:underline">{name}</h3>
        </Link>

        <p className="text-xs text-gray-500 mb-3">SKU: {sku}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary-600">${price.toFixed(2)}</span>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            <ShoppingCart size={16} />
            Add
          </button>
          <button
            onClick={handleWishlist}
            disabled={isWishlistLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors font-medium text-sm ${
              wishlisted
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
            }`}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 text-gray-600 py-2 text-sm hover:text-primary-600 transition-colors border border-gray-200 rounded-lg hover:border-primary-300"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}
