import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                D
              </div>
              <div>
                <p className="font-bold text-gray-900">DayyanINTL</p>
                <p className="text-xs text-gray-500">Surgical Instruments</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Premium surgical instruments for healthcare professionals worldwide. Quality, precision, and reliability.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Products
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products?category=general" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  General Surgery
                </a>
              </li>
              <li>
                <a href="/products?category=orthopedic" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Orthopedic
                </a>
              </li>
              <li>
                <a href="/products?category=dental" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Dental
                </a>
              </li>
              <li>
                <a href="/products?category=ent" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  ENT
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-sm">info@dayyanintl.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-sm">123 Medical Avenue, Healthcare City, HC 12345</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {currentYear} DayyanINTL. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
