import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../services/productAPI';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  loading?: boolean;
  itemsPerPage?: number;
}

export default function ProductCarousel({
  title,
  products,
  loading = false,
  itemsPerPage = 5,
}: ProductCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedProducts = products.slice(startIdx, endIdx);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {currentPage + 1} / {totalPages || 1}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500/30 border-t-amber-500 mx-auto mb-4"></div>
              <p className="text-slate-700 font-semibold">Đang tải sản phẩm...</p>
            </div>
          </div>
        )}

        {/* Carousel */}
        {!loading && (
          <div className="relative">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 z-10"
                  aria-label="Previous products"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 z-10"
                  aria-label="Next products"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPage
                        ? 'bg-amber-600 w-8'
                        : 'bg-amber-300 hover:bg-amber-400'
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 font-semibold">Không có sản phẩm nào</p>
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </section>
  );
}
