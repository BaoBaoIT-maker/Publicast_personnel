const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang seed dữ liệu...');

  // Xóa dữ liệu cũ
  await prisma.userAccount.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

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

  // Tạo tài khoản người dùng (Customer và Admin)
  const hashedPasswordCustomer = await bcrypt.hash('customer123', 10);
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      fullName: 'Khách Hàng Test',
      status: 'ACTIVE',
      verifiedAt: new Date(),
      role: 'USER',
      accounts: {
        create: {
          provider: 'LOCAL',
          passwordHash: hashedPasswordCustomer,
        },
      },
      cart: {
        create: {},
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      fullName: 'Quản Trị Viên',
      status: 'ACTIVE',
      verifiedAt: new Date(),
      role: 'ADMIN',
      accounts: {
        create: {
          provider: 'LOCAL',
          passwordHash: hashedPasswordAdmin,
        },
      },
      cart: {
        create: {},
      },
    },
  });

  console.log(`✅ Tạo tài khoản thành công!`);
  console.log(`   👤 Customer: customer@test.com / customer123`);
  console.log(`   👑 Admin: admin@test.com / admin123`);

  // Tạo sản phẩm - Generate 50+ sản phẩm để test lazy load
  const productPromises = [];
  const imageUrls = [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606308123297-ef6f5b5bf84a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1476971422521-06133348ef0c?w=800&h=800&fit=crop',
  ];

  const productNames = [
    'Dây nịt da bò nam cao cấp', 'Dây nịt vải thời trang nam', 'Dây nịt nữ mảnh điệu đà',
    'Dây nịt nữ da lộn', 'Dây nịt vải canvas màu sắc', 'Dây nịt da giả bền bỉ',
    'Dây nịt da bò quân đội', 'Dây nịt vải denim nam', 'Dây nịt nữ logo thời trang',
    'Dây nịt casual nam sang trọng', 'Dây nịt nữ da mỏng gọn', 'Dây nịt vải bố chắc chắn',
    'Dây nịt da bò mua 2 tặng 1', 'Dây nịt vải polyester nam', 'Dây nịt nữ họa tiết hoa',
    'Dây nịt nam khóa kim loại', 'Dây nịt nữ khóa đá', 'Dây nịt vải đệm nệm',
    'Dây nịt da bò hạng A', 'Dây nịt canvas xám', 'Dây nịt da đen bóng',
    'Dây nịt vải trắng', 'Dây nịt nữ màu hồng', 'Dây nịt nam màu nâu',
    'Dây nịt da bò cổ điển', 'Dây nịt vải quân sự', 'Dây nịt casual phối màu',
    'Dây nịt nữ xa xỉ', 'Dây nịt nam dễ điều chỉnh', 'Dây nịt vải mềm mại',
    'Dây nịt da bò mỏng', 'Dây nịt nữ thắt eo', 'Dây nịt nam khóa tự động',
    'Dây nịt vải bố bền lâu', 'Dây nịt da bò đan chéo', 'Dây nịt nữ họa tiết chấm',
    'Dây nịt nam dáng thể thao', 'Dây nịt canvas đỏ', 'Dây nịt vải khảm vàng',
    'Dây nịt da bò làm quà tặng', 'Dây nịt nữ tôn dáng', 'Dây nịt nam phong cách lịch lãm',
    'Dây nịt vải jean bền lâu', 'Dây nịt da bò cao cấp nhất', 'Dây nịt nữ khoá kim',
    'Dây nịt casual màu đơn', 'Dây nịt nam cơ bản chất lượng', 'Dây nịt vải mềm cho bé',
    'Dây nịt da bò nam cao cấp v2', 'Dây nịt nữ họa tiết ren', 'Dây nịt khóa tự do điều chỉnh',
    // 20 sản phẩm thêm vào
    'Dây nịt da bò nam thương hiệu', 'Dây nịt nữ màu tím',
    'Dây nịt vải dây thun mềm', 'Dây nịt nam khóa bạc',
    'Dây nịt nữ kiểu thắt chéo', 'Dây nịt da bò màu caramel',
    'Dây nịt casual chất linen', 'Dây nịt nam dáng công sở',
    'Dây nịt nữ họa tiết toàn thân', 'Dây nịt vải hemp bền chắc',
    'Dây nịt da bò xỉn nước', 'Dây nịt nam phối da vải',
    'Dây nịt nữ màu xanh bích', 'Dây nịt casual họa tiết kẻ',
    'Dây nịt da bò nam lót nỉ', 'Dây nịt nữ thun co giãn',
    'Dây nịt vải bố màu olive', 'Dây nịt nam khóa tự động điều chỉnh',
    'Dây nịt nữ da lộn mịn', 'Dây nịt casual phong cách Hàn',
  ];

  for (let i = 0; i < 70; i++) {
    const categoryId = categories[i % 3].id;
    const basePrice = Math.floor(Math.random() * 300000) + 50000;
    const hasDiscount = Math.random() > 0.5;
    const discountPrice = hasDiscount ? Math.floor(basePrice * 0.6) : undefined;
    const isBestseller = i < 10; // 10 bestsellers
    const isNewProduct = i < 15; // 15 new products
    const isPromotion = hasDiscount;
    const productName = productNames[i % productNames.length];

    productPromises.push(
      prisma.product.create({
        data: {
          name: `${productName} #${i + 1}`,
          description: `Sản phẩm ${i + 1}: ${productName} - Chất lượng tốt, giá cạnh tranh`,
          price: basePrice,
          discountPrice: discountPrice,
          stock: Math.floor(Math.random() * 200) + 10,
          sold: Math.floor(Math.random() * 500) + 10,
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          categoryId: categoryId,
          isNew: isNewProduct,
          isBestseller: isBestseller,
          isPromotion: isPromotion,
          images: {
            create: [
              {
                imageUrl: imageUrls[i % imageUrls.length],
                order: 0,
              },
              {
                imageUrl: imageUrls[(i + 1) % imageUrls.length],
                order: 1,
              },
            ],
          },
        },
      })
    );
  }

  const products = await Promise.all(productPromises);

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
