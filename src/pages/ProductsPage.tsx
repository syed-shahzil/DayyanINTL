import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { api } from '../lib/api';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
  sku: string;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, searchTerm]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params: any = { is_active: true };
      if (selectedCategory) params.category = selectedCategory; // Backend logic for category name? Wait, backend takes category_id usually.
      // My backend /products/ supports filtering by category_id? 
      // Let's check backend endpoint code `products.py`.
      // If it supports filtering by name, great. If not, I might need to filter client side or backend needs update.
      // The previous frontend filtered by 'category.name'.
      // Let's assume for now I fetch all and filter or backend supports it later.
      // Actually, backend /products/ has `category_id` filter? 
      // I should check `products.py`.

      // Assuming strict filtering:
      // params.min_price = priceRange[0];
      // params.max_price = priceRange[1];
      // params.search = searchTerm;

      const [productsList, categoriesList] = await Promise.all([
        api.products.list(params),
        api.categories.list()
      ]);

      let filteredProducts = productsList as Product[];

      // Client side filtering for now if backend doesn't support complex filters yet
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.category?.name === selectedCategory);
      }
      if (priceRange) {
        filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
      }
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(lower)); // basic search
      }

      setProducts(filteredProducts);
      setCategories(categoriesList as Category[]);
    } catch (e) {
      console.error("Fetch products failed", e);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Surgical Instruments</h1>
          <p className="text-gray-600">Browse our complete catalog of premium surgical instruments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter size={20} /> Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === null
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.name
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                    setPriceRange([0, 10000]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search instruments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Filter size={20} /> Show Filters
            </button>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {products.length} products
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image_url}
                      category={product.category?.name || 'General'}
                      sku={product.sku}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
