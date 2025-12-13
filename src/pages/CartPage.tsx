import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

export function CartPage() {
  const cart = useContext(CartContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!cart || !auth)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

  const total = cart.getCartTotal();

  if (cart.items.length === 0)
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
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some surgical instruments to get started</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Continue Shopping
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      ${item.product?.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-lg font-semibold text-gray-900">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => cart.clearCart()}
                className="w-full mt-3 border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
