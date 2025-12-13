import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  imageUrl: string;
  productCount?: number;
}

export function CategoryCard({ name, description, icon: Icon, imageUrl, productCount }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products?category=${name.toLowerCase()}`)}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer"
    >
      <div className="relative overflow-hidden h-40 bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <Icon className="text-primary-600" size={24} />
          {productCount && (
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {productCount} items
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
