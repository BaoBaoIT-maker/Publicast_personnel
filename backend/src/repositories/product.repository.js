const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ProductRepository {
  /**
   * Lấy danh sách sản phẩm với các điều kiện lọc
   * @param {number} page - Số trang
   * @param {number} limit - Số sản phẩm/trang
   * @param {string} search - Tìm kiếm theo tên
   * @param {string} categoryId - Lọc theo danh mục
   * @param {number} minPrice - Giá tối thiểu
   * @param {number} maxPrice - Giá tối đa
   * @param {boolean} isNew - Lọc sản phẩm mới
   * @param {boolean} isBestseller - Lọc bán chạy
   * @param {boolean} isPromotion - Lọc khuyến mãi
   */
  async findAllProducts({
    page = 1,
    limit = 12,
    search = '',
    categoryId = null,
    minPrice = null,
    maxPrice = null,
    isNew = null,
    isBestseller = null,
    isPromotion = null,
  }) {
    const skip = (page - 1) * limit;

    // Tạo điều kiện WHERE
    const where = {};
    const filters = [];

    // Tìm kiếm theo tên hoặc description
    if (search && search.trim()) {
      const searchTerm = search.trim();
      filters.push({
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      });
      console.log('🔎 Search filter:', { searchTerm });
    }

    // Lọc theo danh mục
    if (categoryId) {
      filters.push({ categoryId });
    }

    // Lọc theo giá
    if (minPrice !== null || maxPrice !== null) {
      const priceFilter = {};
      if (minPrice !== null) {
        priceFilter.gte = minPrice;
      }
      if (maxPrice !== null) {
        priceFilter.lte = maxPrice;
      }
      filters.push({ price: priceFilter });
      console.log('💰 Price filter:', priceFilter);
    }

    // Lọc theo loại sản phẩm
    if (isNew !== null) {
      filters.push({ isNew });
    }

    if (isBestseller !== null) {
      filters.push({ isBestseller });
    }

    if (isPromotion !== null) {
      filters.push({ isPromotion });
    }

    // Gộp tất cả filters
    if (filters.length > 0) {
      if (filters.length === 1) {
        Object.assign(where, filters[0]);
      } else {
        where.AND = filters;
      }
    }

    console.log('📋 Final WHERE clause:', JSON.stringify(where, null, 2));

    // Lấy danh sách sản phẩm
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Lấy tổng số sản phẩm
    const total = await prisma.product.count({ where });

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết 1 sản phẩm
   */
  async findProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    return product;
  }

  /**
   * Lấy danh sách danh mục
   */
  async findCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Lấy sản phẩm tương tự (cùng danh mục)
   */
  async findSimilarProducts(categoryId, productId, limit = 4) {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Tạo sản phẩm mới (cho Admin)
   */
  async createProduct(data) {
    const { images, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images?.map((img, index) => ({
            imageUrl: img,
            order: index,
          })) || [],
        },
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return product;
  }

  /**
   * Cập nhật sản phẩm (cho Admin)
   */
  async updateProduct(id, data) {
    const { images, ...productData } = data;

    const product = await prisma.product.update({
      where: { id },
      data: productData,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return product;
  }

  /**
   * Lấy sản phẩm bán chạy nhất (top 10)
   */
  async findBestsellers() {
    return await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { sold: 'desc' },
      take: 10,
    });
  }

  /**
   * Lấy sản phẩm xem nhiều nhất (top 10)
   */
  async findMostViewed() {
    return await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
    });
  }

  /**
   * Lấy sản phẩm theo danh mục với phân trang (lazy loading)
   */
  async findProductsByCategory(categoryId, page = 1, limit = 12) {
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.product.count({ where: { categoryId } });

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new ProductRepository();
