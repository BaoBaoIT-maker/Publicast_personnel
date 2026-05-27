import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchProductDetail, Product } from '../../services/productAPI';
import ProductCard from '../../components/ProductCard';
import Layout from '../../layout/Layout';
import { useAppDispatch } from '../../hooks';
import { addToCart } from '../../redux/cartSlice';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProductDetail = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const response = await fetchProductDetail(id);
        setProduct(response.data);
        setSimilarProducts(response.data.similarProducts || []);
      } catch (error) {
        console.error('Error loading product detail:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500/30 border-t-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">Đang tải sản phẩm...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg font-bold mb-4">Sản phẩm không tồn tại</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const mainImage = product.images[0]?.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image';
  const finalPrice = product.discountPrice || product.price;

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-md mb-8">
          {/* Left: Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={4}
                className="w-full"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.imageUrl}
                      alt={`Product ${index}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => setActiveImageIndex(index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category */}
            <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating}/5 ({product.sold} lượt mua)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  {finalPrice.toLocaleString('vi-VN')}₫
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {product.price.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>
              {discountPercent > 0 && (
                <p className="text-green-600 font-semibold">
                  Tiết kiệm {((product.price - finalPrice) * quantity).toLocaleString('vi-VN')}₫
                </p>
              )}
            </div>

            {/* Stock Info */}
            <div className="mb-6 p-4 border-2 border-gray-300 rounded-lg">
              {product.stock > 0 ? (
                <p className="text-green-600 font-bold text-lg">
                  ✓ Còn {product.stock} sản phẩm trong kho
                </p>
              ) : (
                <p className="text-red-600 font-bold text-lg">✗ Sản phẩm tạm hết hàng</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="font-semibold text-gray-800 mb-3">Số lượng:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                disabled={product.stock === 0 || addingToCart}
                onClick={async () => {
                  try {
                    setAddingToCart(true);
                    await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
                    alert('Đã thêm sản phẩm vào giỏ hàng!');
                  } catch (error: any) {
                    alert(error || 'Lỗi khi thêm vào giỏ hàng');
                  } finally {
                    setAddingToCart(false);
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-bold flex items-center justify-center transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((similar) => (
                <ProductCard key={similar.id} product={similar} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section (Placeholder) */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá sản phẩm</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {review.user.avatarUrl && (
                      <img
                        src={review.user.avatarUrl}
                        alt={review.user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{review.user.fullName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Chưa có đánh giá nào</p>
          )}
        </section>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;
