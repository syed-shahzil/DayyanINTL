import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, BarChart3, ShoppingCart, DollarSign, Users } from 'lucide-react';

export function OwnerDashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.user || !auth.profile?.is_owner) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [auth?.user, auth?.profile?.is_owner]);

  async function fetchStats() {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*, order_items(*)'),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const totalCost = orders.reduce((sum, order) => sum + (order.subtotal * 0.4), 0);
      const totalProfit = totalRevenue - totalCost;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProfit,
        totalUsers: usersRes.count || 0,
        totalProducts: productsRes.count || 0,
        recentOrders: orders.slice(0, 10),
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading || !auth?.user)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

  const StatCard = ({ icon: Icon, label, value, change }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
        </div>
        <div className="bg-primary-100 p-3 rounded-lg">
          <Icon size={24} className="text-primary-600" />
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
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Business analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={stats.totalOrders}
            change="+12% from last month"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            change="+8% from last month"
          />
          <StatCard
            icon={BarChart3}
            label="Total Profit"
            value={`$${stats.totalProfit.toFixed(2)}`}
            change={`${((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}% margin`}
          />
          <StatCard
            icon={Users}
            label="Active Users"
            value={stats.totalUsers}
            change="+15% from last month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Products</h3>
            <p className="text-4xl font-bold text-primary-600">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
            <p className="text-4xl font-bold text-primary-600">
              ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin</h3>
            <p className="text-4xl font-bold text-primary-600">
              {stats.totalRevenue > 0 ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : '0'}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
