import { useContext, useState } from 'react';
import { Menu, X, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const navigate = useNavigate();

  if (!auth) return null;

  const cartCount = cart?.items.length || 0;

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-md transition-shadow">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg">DayyanINTL</span>
              <span className="text-xs text-gray-500">Surgical Instruments</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>
            <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            {auth.user ? (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors hover:bg-gray-100 rounded-lg"
                >
                  <Heart size={20} />
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors hover:bg-gray-100 rounded-lg"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors hover:bg-gray-100 rounded-lg">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{auth.profile?.full_name}</p>
                      <p className="text-xs text-gray-500">{auth.profile?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    {(auth.profile?.role === 'management' || auth.profile?.role === 'owner') && (
                      <Link
                        to={auth.profile.role === 'owner' ? '/owner' : '/management'}
                        className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 border-t border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('/signup')}
                  className="px-4 py-2 bg-primary-600 text-white font-medium hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              About
            </a>
            <a href="#contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
