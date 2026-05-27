import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import ProductCarousel from '../../components/ProductCarousel';
import Layout from '../../layout/Layout';
import {
  fetchProducts,
  fetchCategories,
  fetchBestsellers,
  fetchMostViewed,
  Product,
  Category,
} from '../../services/productAPI';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Main products list
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Carousel products
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [mostViewed, setMostViewed] = useState<Product[]>([]);

  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Load bestsellers & most viewed (carousels)
  useEffect(() => {
    const loadCarousels = async () => {
      try {
        setCarouselLoading(true);
        const [bestsellersRes, mostViewedRes] = await Promise.all([
          fetchBestsellers(),
          fetchMostViewed(),
        ]);
        setBestsellers(bestsellersRes.data);
        setMostViewed(mostViewedRes.data);
      } catch (error) {
        console.error('Error loading carousels:', error);
      } finally {
        setCarouselLoading(false);
      }
    };
    loadCarousels();
  }, []);

  // Load main products list (with filter)
  const loadProducts = useCallback(
    async (pageNum: number, append = false) => {
      try {
        append ? setLoadingMore(true) : setLoading(true);

        // Convert price range to min/max
        let minPrice, maxPrice;
        if (priceRange === '0-100k') {
          minPrice = 0;
          maxPrice = 100000;
        } else if (priceRange === '100k-200k') {
          minPrice = 100000;
          maxPrice = 200000;
        } else if (priceRange === '200k-500k') {
          minPrice = 200000;
          maxPrice = 500000;
        } else if (priceRange === '500k+') {
          minPrice = 500000;
        }

        // Build filter params
        const params: any = {
          page: pageNum,
          limit: 12,
          search: searchTerm || undefined,
          categoryId: selectedCategory || undefined,
          minPrice,
          maxPrice,
          isNew: filterType === 'new' ? true : undefined,
          isBestseller: filterType === 'bestseller' ? true : undefined,
          isPromotion: filterType === 'promotion' ? true : undefined,
        };

        const response = await fetchProducts(params);
        setTotalPages(response.pagination.pages);
        setHasMore(pageNum < response.pagination.pages);

        if (append) {
          setProducts((prev) => [...prev, ...response.data]);
        } else {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        if (!append) setProducts([]);
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [searchTerm, selectedCategory, priceRange, filterType]
  );

  // Load first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1, false);
  }, [searchTerm, selectedCategory, priceRange, filterType, loadProducts]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !loadingMore &&
          currentPage < totalPages
        ) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          loadProducts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [currentPage, hasMore, loading, loadingMore, totalPages, loadProducts]);

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilterOpen(true);
  };

  return (
    <Layout>
      {/* ===== CAROUSELS SECTION ===== */}
      <div className="bg-slate-50">
        <ProductCarousel
          title="🔥 Bán Chạy Nhất"
          products={bestsellers}
          loading={carouselLoading}
          itemsPerPage={5}
        />
        <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
        <ProductCarousel
          title="👁️ Xem Nhiều Nhất"
          products={mostViewed}
          loading={carouselLoading}
          itemsPerPage={5}
        />
      </div>

      {/* ===== SEARCH & FILTER SECTION ===== */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-8 px-4 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm kiếm dây nịt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 border-2 border-amber-500/30 group-hover:border-amber-500/50 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-all duration-300 backdrop-blur text-lg font-semibold"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none group-hover:scale-110 transition-transform" size={24} />
            </div>
          </div>

          {/* Filter Bar */}
          {filterOpen && (
            <div className="bg-slate-800/50 backdrop-blur border border-amber-500/20 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Price Filter */}
              <div>
                <h3 className="text-amber-300 font-bold mb-3 text-sm uppercase tracking-widest">Khoảng Giá</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: '0-100k', label: 'Dưới 100K' },
                    { value: '100k-200k', label: '100K - 200K' },
                    { value: '200k-500k', label: '200K - 500K' },
                    { value: '500k+', label: 'Trên 500K' },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        value={item.value}
                        checked={priceRange === item.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-amber-500"
                      />
                      <span className="text-white/80 group-hover:text-amber-300 transition-colors font-medium">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="text-amber-300 font-bold mb-3 text-sm uppercase tracking-widest">Loại Sản Phẩm</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'new', label: 'Sản phẩm mới' },
                    { value: 'bestseller', label: 'Bán chạy nhất' },
                    { value: 'promotion', label: 'Khuyến mãi' },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="filter"
                        value={item.value}
                        checked={filterType === item.value}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-amber-500"
                      />
                      <span className="text-white/80 group-hover:text-amber-300 transition-colors font-medium">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange('all');
                    setFilterType('all');
                    setFilterOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg font-semibold transition-all border border-red-500/30 transform hover:scale-105"
                >
                  Xóa Bộ Lọc
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Áp Dụng
                </button>
              </div>
            </div>
          )}

          {/* Category Buttons */}
          <div className="flex items-center gap-2 flex-wrap mt-6">
            <button
              onClick={() => {
                setSelectedCategory('');
                setFilterOpen(false);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm transform hover:scale-105 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'text-amber-200 hover:text-white hover:bg-slate-700/50 border border-amber-500/30'
              }`}
            >
              Tất cả
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : 'text-amber-200 hover:text-white hover:bg-slate-700/50 border border-amber-500/30'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {/* Filter Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/30 border border-amber-500/30 text-amber-200 hover:text-white hover:bg-slate-700/50 hover:border-amber-500/50 transition-all font-semibold text-sm transform hover:scale-105"
            >
              <Filter size={18} />
              Lọc
            </button>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION (WITH INFINITE SCROLL) ===== */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results Info */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                Tất Cả Sản Phẩm
              </h2>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-slate-600 text-lg">
              Đã tải <span className="font-bold text-amber-600">{products.length}</span> sản phẩm
              {totalPages > 0 && (
                <span>
                  {' '}
                  | Trang <span className="font-bold text-amber-600">{currentPage}</span> / {totalPages}
                </span>
              )}
            </p>
          </div>

          {/* Loading State (first load) */}
          {loading && products.length === 0 && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/30 border-t-amber-500 mx-auto mb-4"></div>
                <p className="text-slate-700 font-semibold">Đang tải sản phẩm...</p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* No Products */}
          {!loading && products.length === 0 && (
            <div className="text-center py-24 animate-fade-in">
              <Search className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
              <p className="text-slate-700 font-semibold text-lg mb-4">
                Không tìm thấy sản phẩm nào
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange('all');
                  setFilterType('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          )}

          {/* Infinite Scroll Observer */}
          {hasMore && <div ref={observerTarget} className="py-8 text-center" />}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-amber-500/30 border-t-amber-500 mx-auto mb-2"></div>
                <p className="text-slate-600 text-sm">Đang tải thêm...</p>
              </div>
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600 font-semibold">Đã tải hết tất cả sản phẩm</p>
            </div>
          )}
        </div>
      </section>

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
    </Layout>
  );
};

export default HomePage;
