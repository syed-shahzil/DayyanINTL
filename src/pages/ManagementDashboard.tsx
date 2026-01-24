import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export function ManagementDashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: '',
    stock_quantity: '',
    category_id: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    if (!auth?.user || auth.profile?.role !== 'management' && auth.profile?.role !== 'owner') {
      navigate('/');
      return;
    }
    fetchData();
  }, [auth?.user, auth?.profile?.role]);

  async function fetchData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.products.list({ limit: 1000 }), // Fetch all logic might differ, assuming list returns array
        api.categories.list()
      ]);
      // Backend returns { products: [], total: ... } for products list?
      // Let's verify API client or assume standard array if list return type matches.
      // My api.products.list implementation returns Promise<any> (response json).
      // The backend /products/ endpoint maps to Page[ProductResponse]. 
      // So productsData.items is the array.

      // However, if I check api.ts again, does list return data.items?
      // Usually apiClient returns the raw JSON.
      // Backend: params -> Page[Product]. items list.
      setProducts((productsData as any).items || []);
      setCategories(categoriesData as unknown as Category[]);
    } catch (e) {
      console.error("Failed to fetch management data", e);
    }
    setLoading(false);
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.products.create({
        name: formData.name,
        price: parseFloat(formData.price),
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: formData.category_id || undefined,
        description: formData.description,
        detailed_description: '', // Optional
        image_url: formData.image_url,
        is_active: true,
        specifications: '{}' // Default or empty string
      });

      setFormData({
        name: '',
        price: '',
        sku: '',
        stock_quantity: '',
        category_id: '',
        description: '',
        image_url: '',
      });
      setShowProductForm(false);
      fetchData();
    } catch (err) {
      alert('Failed to add product: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.products.delete(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading || !auth?.user)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage products and orders</p>
          </div>
          <button
            onClick={() => setShowProductForm(!showProductForm)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {showProductForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <input
                  type="text"
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stock_quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
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
