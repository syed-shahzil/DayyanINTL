import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Package } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product_name?: string;
  product?: { name: string };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items?: OrderItem[]; // Backend returns 'items', Supabase returned 'order_items'
}

export function OrdersPage() {
  const auth = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      fetchOrders();
    }
  }, [auth?.user]);

  async function fetchOrders() {
    try {
      const data = await api.orders.myOrders();
      setOrders(data);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
    setLoading(false);
  }

  if (!auth?.user)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view orders</h1>
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

  if (orders.length === 0)
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
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
            <p className="text-gray-600 mb-6">Start shopping to create your first order</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm text-gray-900">{order.id.slice(0, 8)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-gray-900">${order.total_amount.toFixed(2)}</p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-sm text-gray-600">
                        {item.product_name || item.product?.name} × {item.quantity} @ ${item.price_at_purchase.toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
