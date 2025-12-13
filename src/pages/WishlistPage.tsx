import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

interface WishlistItem {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    sku: string;
    category?: { name: string };
  };
}

export function WishlistPage() {
  const auth = useContext(AuthContext);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      fetchWishlist();
    }
  }, [auth?.user]);

  async function fetchWishlist() {
    const { data } = await supabase
      .from('wishlist_items')
      .select('*, product:products(*)')
      .eq('user_id', auth!.user!.id);

    setItems(data || []);
    setLoading(false);
  }

  if (!auth?.user)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view wishlist</h1>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Sign In
        </button>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Wishlist is empty</h1>
            <p className="text-gray-600 mb-6">Add items to your wishlist to view them later</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              id={item.product!.id}
              name={item.product!.name}
              price={item.product!.price}
              image={item.product!.image_url}
              category={item.product?.category?.name || 'General'}
              sku={item.product!.sku}
              isWishlisted={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
