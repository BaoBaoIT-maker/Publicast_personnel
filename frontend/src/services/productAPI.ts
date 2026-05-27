import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: false is the default, we use JWT tokens instead
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sold: number;
  rating: number;
  categoryId: string;
  isNew: boolean;
  isBestseller: boolean;
  isPromotion: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  images: Array<{
    id: string;
    imageUrl: string;
    order: number;
  }>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product & {
    reviews: Array<{
      id: string;
      rating: number;
      comment?: string;
      user: {
        id: string;
        fullName: string;
        avatarUrl?: string;
      };
      createdAt: string;
    }>;
    similarProducts: Product[];
  };
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

// ===== PRODUCT API CALLS =====

/**
 * Lấy danh sách sản phẩm với lọc & tìm kiếm
 */
export const fetchProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isPromotion?: boolean;
}): Promise<ProductsResponse> => {
  try {
    console.log('🔍 Gọi API fetchProducts với params:', params);
    const response = await apiClient.get<ProductsResponse>('/products', {
      params,
    });
    console.log('✅ Nhận response:', response.data.data.length, 'sản phẩm');
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi fetchProducts:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm');
  }
};

/**
 * Lấy chi tiết 1 sản phẩm
 */
export const fetchProductDetail = async (id: string): Promise<ProductDetailResponse> => {
  try {
    const response = await apiClient.get<ProductDetailResponse>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy chi tiết sản phẩm');
  }
};

/**
 * Lấy danh sách danh mục
 */
export const fetchCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await apiClient.get<CategoriesResponse>('/categories');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách danh mục');
  }
};

/**
 * Lấy sản phẩm mới nhất
 */
export const fetchNewProducts = async (limit = 8): Promise<ProductsResponse> => {
  return fetchProducts({
    limit,
    isNew: true,
    page: 1,
  });
};

/**
 * Lấy sản phẩm bán chạy nhất (từ /products/bestsellers)
 */
export const fetchBestsellers = async (): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get<ProductsResponse>('/products/bestsellers');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy sản phẩm bán chạy');
  }
};

/**
 * Lấy sản phẩm bán chạy nhất (phiên bản legacy - dùng filter)
 */
export const fetchBestsellerProducts = async (limit = 8): Promise<ProductsResponse> => {
  return fetchProducts({
    limit,
    isBestseller: true,
    page: 1,
  });
};

/**
 * Lấy sản phẩm xem nhiều nhất (từ /products/most-viewed)
 */
export const fetchMostViewed = async (): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get<ProductsResponse>('/products/most-viewed');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy sản phẩm xem nhiều');
  }
};

/**
 * Lấy sản phẩm khuyến mãi
 */
export const fetchPromotionProducts = async (limit = 8): Promise<ProductsResponse> => {
  return fetchProducts({
    limit,
    isPromotion: true,
    page: 1,
  });
};

/**
 * Lấy 10 sản phẩm bán chạy nhất (top bestsellers)
 */
export const fetchTopBestsellers = async (): Promise<{ success: boolean; data: Product[] }> => {
  try {
    const response = await apiClient.get('/products/bestsellers');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy sản phẩm bán chạy');
  }
};

/**
 * Lấy 10 sản phẩm xem nhiều nhất (top most viewed)
 */
export const fetchTopMostViewed = async (): Promise<{ success: boolean; data: Product[] }> => {
  try {
    const response = await apiClient.get('/products/most-viewed');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy sản phẩm xem nhiều');
  }
};

/**
 * Lấy sản phẩm theo danh mục (với phân trang - lazy loading)
 */
export const fetchProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 12
): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get<ProductsResponse>(
      `/categories/${categoryId}/products`,
      { params: { page, limit } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy sản phẩm theo danh mục');
  }
};
