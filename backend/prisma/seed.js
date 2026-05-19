const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang seed dữ liệu...');

  // Xóa dữ liệu cũ
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Tạo danh mục
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Dây nịt Nam',
        description: 'Dây nịt chất lượng cao dành cho nam giới',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dây nịt Nữ',
        description: 'Dây nịt thời trang dành cho nữ giới',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dây nịt Casual',
        description: 'Dây nịt phong cách tự do',
        image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500&h=500&fit=crop',
      },
    }),
  ]);

  console.log(`✅ Tạo ${categories.length} danh mục thành công!`);

  // Tạo sản phẩm
  const products = await Promise.all([
    // Dây nịt Nam
    prisma.product.create({
      data: {
        name: 'Dây nịt da bò nam cao cấp',
        description: 'Dây nịt da bò cao cấp, bền và đẹp',
        price: 299000,
        discountPrice: 199000,
        stock: 50,
        sold: 125,
        rating: 4.5,
        categoryId: categories[0].id,
        isNew: true,
        isBestseller: true,
        isPromotion: true,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
              order: 0,
            },
            {
              imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
              order: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dây nịt vải thời trang nam',
        description: 'Dây nịt vải chất lượng, thoải mái khi đeo',
        price: 99000,
        stock: 100,
        sold: 89,
        rating: 4,
        categoryId: categories[0].id,
        isNew: false,
        isBestseller: true,
        isPromotion: false,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop',
              order: 0,
            },
          ],
        },
      },
    }),

    // Dây nịt Nữ
    prisma.product.create({
      data: {
        name: 'Dây nịt nữ mảnh điệu đà',
        description: 'Dây nịt nữ mảnh, thanh lịch và quyến rũ',
        price: 149000,
        discountPrice: 99000,
        stock: 75,
        sold: 234,
        rating: 4.8,
        categoryId: categories[1].id,
        isNew: true,
        isBestseller: true,
        isPromotion: true,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
              order: 0,
            },
            {
              imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
              order: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dây nịt nữ da lộn',
        description: 'Dây nịt da lộn mềm mại, thoải mái',
        price: 189000,
        stock: 60,
        sold: 156,
        rating: 4.3,
        categoryId: categories[1].id,
        isNew: true,
        isBestseller: false,
        isPromotion: false,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1606308123297-ef6f5b5bf84a?w=800&h=800&fit=crop',
              order: 0,
            },
          ],
        },
      },
    }),

    // Dây nịt Casual
    prisma.product.create({
      data: {
        name: 'Dây nịt vải canvas màu sắc',
        description: 'Dây nịt vải canvas đa màu sắc, năng động',
        price: 79000,
        stock: 200,
        sold: 567,
        rating: 4.6,
        categoryId: categories[2].id,
        isNew: false,
        isBestseller: true,
        isPromotion: false,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
              order: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dây nịt da giả bền bỉ',
        description: 'Dây nịt da giả giá rẻ, chất lượng tốt',
        price: 59000,
        discountPrice: 39000,
        stock: 150,
        sold: 432,
        rating: 4.1,
        categoryId: categories[2].id,
        isNew: false,
        isBestseller: true,
        isPromotion: true,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=800&fit=crop',
              order: 0,
            },
            {
              imageUrl: 'https://images.unsplash.com/photo-1476971422521-06133348ef0c?w=800&h=800&fit=crop',
              order: 1,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Tạo ${products.length} sản phẩm thành công!`);

  console.log('✨ Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
