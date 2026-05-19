import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../api/productAPI';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const mainImage = product.images[0]?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-gradient-to-br from-white to-stone-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col border border-amber-100/30 hover:border-amber-300/50"
    >
      {/* Hình ảnh */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 h-64 flex items-center justify-center">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Badge mới */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🆕 New
          </div>
        )}

        {/* Badge bán chạy */}
        {product.isBestseller && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ Best
          </div>
        )}

        {/* Badge khuyến mãi */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discount}%
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Danh mục */}
        <p className="text-xs font-semibold text-amber-700/70 mb-2 uppercase tracking-wide">
          {product.category?.name}
        </p>

        {/* Tên sản phẩm */}
        <h3 className="font-bold text-sm text-slate-800 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-600 font-medium">({product.sold})</span>
        </div>

        {/* Giá */}
        <div className="mb-4 pb-4 border-b border-amber-100/50">
          {product.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-amber-700">
                {product.discountPrice.toLocaleString('vi-VN')}₫
              </span>
              <span className="text-sm text-slate-400 line-through">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-slate-800">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        {/* Tồn kho */}
        <p className="text-xs font-semibold mb-4">
          {product.stock > 0 ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg inline-block">
              ✓ Còn {product.stock} hàng
            </span>
          ) : (
            <span className="text-red-700 bg-red-50 px-2 py-1 rounded-lg inline-block">
              ✗ Hết hàng
            </span>
          )}
        </p>

        {/* Nút Xem chi tiết */}
        <button
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg mt-auto transform group-hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
        >
          <ShoppingCart size={16} />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
