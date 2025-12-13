import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Heart, Share2, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  detailed_description: string;
  image_url: string;
  sku: string;
  stock_quantity: number;
  specifications?: any;
  category?: { name: string };
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (data) {
      setProduct(data as Product);
      if (auth?.user) {
        checkWishlist(data.id);
      }
    }
    setLoading(false);
  }

  async function checkWishlist(productId: string) {
    if (!auth?.user) return;
    const { data } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('product_id', productId)
      .maybeSingle();

    setWishlisted(!!data);
  }

  const handleAddToCart = async () => {
    if (!auth?.user) {
      navigate('/login');
      return;
    }

    if (cart) {
      await cart.addItem(product!.id, quantity);
      alert('Added to cart');
      setQuantity(1);
    }
  };

  const handleWishlist = async () => {
    if (!auth?.user) {
      navigate('/login');
      return;
    }

    if (wishlisted) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', auth.user.id)
        .eq('product_id', product!.id);
      setWishlisted(false);
    } else {
      await supabase
        .from('wishlist_items')
        .insert({ user_id: auth.user.id, product_id: product!.id });
      setWishlisted(true);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} on DayyanINTL`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Products
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col">
            <div className="mb-4 bg-gray-100 rounded-xl overflow-hidden h-96">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                {product.category?.name || 'General'}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>

            <div className="border-y border-gray-200 py-6">
              <p className="text-4xl font-bold text-primary-600">${product.price.toFixed(2)}</p>
              <div className="mt-4 flex items-center gap-2">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    product.stock_quantity > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} In Stock`
                    : 'Out of Stock'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.detailed_description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Information</h3>
                <p className="text-gray-600 leading-relaxed">{product.detailed_description}</p>
              </div>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    min="1"
                    max={product.stock_quantity}
                    className="w-16 text-center border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <button
                  onClick={handleWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-semibold transition-colors ${
                    wishlisted
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 text-gray-600 hover:border-red-200 hover:text-red-600'
                  }`}
                >
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleShare}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
