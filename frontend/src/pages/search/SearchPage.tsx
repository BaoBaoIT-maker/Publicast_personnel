import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { fetchProducts, fetchCategories, Product, Category } from '../../api/productAPI';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [isNew, setIsNew] = useState(searchParams.get('isNew') === 'true');
  const [isBestseller, setIsBestseller] = useState(searchParams.get('isBestseller') === 'true');
  const [isPromotion, setIsPromotion] = useState(searchParams.get('isPromotion') === 'true');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

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

  // Load products with filters
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts({
          page: currentPage,
          limit: 12,
          search: searchTerm,
          categoryId: selectedCategory || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          isNew: isNew || undefined,
          isBestseller: isBestseller || undefined,
          isPromotion: isPromotion || undefined,
        });

        setProducts(response.data);
        setTotalProducts(response.pagination.total);
        setTotalPages(response.pagination.pages);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchTerm, selectedCategory, minPrice, maxPrice, isNew, isBestseller, isPromotion, currentPage]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('categoryId', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (isNew) params.set('isNew', 'true');
    if (isBestseller) params.set('isBestseller', 'true');
    if (isPromotion) params.set('isPromotion', 'true');
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, isNew, isBestseller, isPromotion, currentPage, setSearchParams]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setIsNew(false);
    setIsBestseller(false);
    setIsPromotion(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            ← Quay lại trang chủ
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Tìm kiếm & Lọc sản phẩm</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ===== SIDEBAR FILTERS ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>
                {(searchTerm || selectedCategory || minPrice || maxPrice || isNew || isBestseller || isPromotion) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                  >
                    <X size={16} />
                    Reset
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng giá</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Tối đa"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => {
                      setIsNew(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">Sản phẩm mới</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => {
                      setIsBestseller(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">Bán chạy</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPromotion}
                    onChange={(e) => {
                      setIsPromotion(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">Khuyến mãi</span>
                </label>
              </div>
            </div>
          </div>

          {/* ===== PRODUCTS GRID ===== */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h2>
                <p className="text-gray-600">
                  Tìm thấy <span className="font-bold text-blue-600">{totalProducts}</span> sản phẩm
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Trước
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <Search size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Reset bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
