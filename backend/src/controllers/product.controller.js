const productRepository = require('../repositories/product.repository');

class ProductController {
  /**
   * GET /api/products
   * Lấy danh sách sản phẩm với lọc & tìm kiếm
   */
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        categoryId = null,
        minPrice = null,
        maxPrice = null,
        isNew = null,
        isBestseller = null,
        isPromotion = null,
      } = req.query;

      console.log('📦 Nhận request products:', {
        search: search || 'none',
        categoryId: categoryId || 'none',
        priceRange: minPrice || maxPrice ? `${minPrice || 'min'}-${maxPrice || 'max'}` : 'none',
        isNew,
        isBestseller,
        isPromotion,
      });

      const result = await productRepository.findAllProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        categoryId,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        isNew: isNew === 'true' ? true : isNew === 'false' ? false : null,
        isBestseller: isBestseller === 'true' ? true : isBestseller === 'false' ? false : null,
        isPromotion: isPromotion === 'true' ? true : isPromotion === 'false' ? false : null,
      });

      console.log(`✅ Trả về ${result.data.length} sản phẩm`);

      res.status(200).json({
        success: true,
        message: 'Lấy danh sách sản phẩm thành công',
        ...result,
      });
    } catch (error) {
      console.error('❌ Lỗi getProducts:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách sản phẩm',
      });
    }
  }

  /**
   * GET /api/products/:id
   * Lấy chi tiết 1 sản phẩm
   */
  async getProductDetail(req, res) {
    try {
      const { id } = req.params;

      const product = await productRepository.findProductById(id);

      // Lấy sản phẩm tương tự
      const similarProducts = await productRepository.findSimilarProducts(
        product.categoryId,
        id,
        4
      );

      res.status(200).json({
        success: true,
        message: 'Lấy chi tiết sản phẩm thành công',
        data: {
          ...product,
          similarProducts,
        },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Sản phẩm không tồn tại',
      });
    }
  }

  /**
   * GET /api/categories
   * Lấy danh sách danh mục
   */
  async getCategories(req, res) {
    try {
      const categories = await productRepository.findCategories();

      res.status(200).json({
        success: true,
        message: 'Lấy danh mục thành công',
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh mục',
      });
    }
  }

  /**
   * GET /api/products/bestsellers
   * Lấy 10 sản phẩm bán chạy nhất
   */
  async getBestsellers(req, res) {
    try {
      const products = await productRepository.findBestsellers();

      res.status(200).json({
        success: true,
        message: 'Lấy sản phẩm bán chạy thành công',
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy sản phẩm bán chạy',
      });
    }
  }

  /**
   * GET /api/products/most-viewed
   * Lấy 10 sản phẩm xem nhiều nhất
   */
  async getMostViewed(req, res) {
    try {
      const products = await productRepository.findMostViewed();

      res.status(200).json({
        success: true,
        message: 'Lấy sản phẩm xem nhiều thành công',
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy sản phẩm xem nhiều',
      });
    }
  }

  /**
   * GET /api/categories/:categoryId/products
   * Lấy sản phẩm theo danh mục (có phân trang - lazy loading)
   */
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 12 } = req.query;

      const result = await productRepository.findProductsByCategory(
        categoryId,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        message: 'Lấy sản phẩm theo danh mục thành công',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy sản phẩm theo danh mục',
      });
    }
  }
}

module.exports = new ProductController();
