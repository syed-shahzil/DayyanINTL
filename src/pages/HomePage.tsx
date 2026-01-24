import { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { api } from '../lib/api';
import {
  Stethoscope,
  Bone,
  Smile,
  Ear,
  Activity,
  Droplet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
  sku: string;
  category: Category;
}

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categoryIcons: { [key: string]: any } = {
    general: Stethoscope,
    orthopedic: Bone,
    dental: Smile,
    ent: Ear,
    diagnostic: Activity,
    disposable: Droplet,
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [categoriesData, productsData] = await Promise.all([
        api.categories.list(),
        api.products.list({ limit: 6, is_active: true }),
      ]);

      setCategories(categoriesData as Category[]);
      // data.items handling if backend returns pagination object
      const products = (productsData as any).items || productsData;
      setFeaturedProducts(Array.isArray(products) ? products.slice(0, 6) : []);
    } catch (e) {
      console.error("Failed to fetch home data", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Surgical Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of surgical instruments organized by specialty.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  description={cat.description}
                  icon={categoryIcons[cat.name.toLowerCase()] || Stethoscope}
                  imageUrl={cat.image_url}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular surgical instruments trusted by healthcare professionals.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProducts.map((product) => (
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
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hospital Grade</h3>
              <p className="text-gray-600">
                All instruments meet international standards and hospital requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precision Engineering</h3>
              <p className="text-gray-600">
                Meticulously crafted with attention to detail for surgical excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sterilizable</h3>
              <p className="text-gray-600">
                All instruments are fully sterilizable and safe for medical use.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
