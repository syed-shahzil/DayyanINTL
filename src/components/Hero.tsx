import { ArrowRight, Shield, Zap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-teal-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Precision Surgical <span className="text-primary-600">Instruments</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Trusted by healthcare professionals worldwide. DayyanINTL delivers premium surgical instruments with precision, quality, and reliability you can depend on.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all hover:shadow-lg font-semibold"
              >
                Shop Now
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg hover:bg-primary-50 transition-all font-semibold"
              >
                Browse Catalog
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <Shield size={28} className="text-primary-600" />
                <p className="text-sm font-semibold text-gray-900">Hospital Grade</p>
                <p className="text-xs text-gray-500">ISO certified</p>
              </div>
              <div className="space-y-2">
                <Zap size={28} className="text-primary-600" />
                <p className="text-sm font-semibold text-gray-900">Fast Shipping</p>
                <p className="text-xs text-gray-500">Worldwide delivery</p>
              </div>
              <div className="space-y-2">
                <Award size={28} className="text-primary-600" />
                <p className="text-sm font-semibold text-gray-900">Expert Support</p>
                <p className="text-xs text-gray-500">24/7 assistance</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-teal-100 rounded-2xl transform rotate-3"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Surgical instruments"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Premium Quality Guarantee</h3>
                <p className="text-sm text-gray-600">All instruments undergo rigorous quality control and sterilization standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
