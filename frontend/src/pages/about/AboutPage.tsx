import React from 'react';
import { Award, Users, Truck, Heart } from 'lucide-react';
import Layout from '../../components/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      {/* ===== HERO SECTION ===== */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 px-4 border-b-2 border-amber-500">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent animate-pulse">
            Về ConCaiNit Deluxe
          </h1>
          <p className="text-xl text-amber-200 max-w-3xl mx-auto leading-relaxed">
            Hành trình tạo nên những chiếc dây nịt cao cấp, sang trọng và đầy phong cách
          </p>
        </div>
      </section>

      {/* ===== MISSION SECTION ===== */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                ConCaiNit Deluxe được thành lập với một mục đích duy nhất: mang đến những chiếc dây nịt không chỉ bền bỉ, mà còn là biểu tượng của phong cách và sang trọng.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Chúng tôi tin rằng mỗi chi tiết nhỏ đều quan trọng. Từ chất liệu cao cấp đến thiết kế tinh xảo, mỗi sản phẩm của ConCaiNit Deluxe đều được tạo ra với tình yêu và sự tận tâm.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Không chỉ là một phụ kiện, dây nịt của chúng tôi là một phần của phong cách sống của bạn.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">⌛</div>
                <h3 className="text-2xl font-bold">ConCaiNit Deluxe</h3>
                <p className="text-amber-100 mt-2">Nâng tầm phong cách, khác biệt tính cách</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="bg-gradient-to-r from-stone-100 to-stone-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Giá Trị Cốt Lõi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-amber-400 border border-amber-100/50 transition-all duration-300 transform hover:scale-105">
              <Award className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Chất Lượng Tuyệt Vời</h3>
              <p className="text-slate-600">
                Mỗi sản phẩm được kiểm tra kỹ lưỡng để đảm bảo chất lượng tốt nhất cho khách hàng.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-amber-400 border border-amber-100/50 transition-all duration-300 transform hover:scale-105">
              <Users className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dịch Vụ Khách Hàng</h3>
              <p className="text-slate-600">
                Đội ngũ chuyên nghiệp của chúng tôi luôn sẵn sàng giúp đỡ bạn mọi lúc.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-amber-400 border border-amber-100/50 transition-all duration-300 transform hover:scale-105">
              <Truck className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Giao Hàng Nhanh</h3>
              <p className="text-slate-600">
                Chúng tôi cam kết giao hàng nhanh chóng và an toàn đến tay bạn.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:border-amber-400 border border-amber-100/50 transition-all duration-300 transform hover:scale-105">
              <Heart className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tình Yêu Công Việc</h3>
              <p className="text-slate-600">
                Passion là động lực của chúng tôi để tạo ra những sản phẩm tuyệt vời.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE SECTION ===== */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">Hành Trình Của Chúng Tôi</h2>

          <div className="space-y-8">
            {/* Timeline Item 1 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">2020</span>
              </div>
              <div className="bg-white rounded-xl p-8 flex-1 shadow-lg border-l-4 border-amber-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Khởi Đầu</h3>
                <p className="text-slate-600">
                  ConCaiNit Deluxe được thành lập với ý tưởng tạo nên những chiếc dây nịt đúng nghĩa cao cấp.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">2021</span>
              </div>
              <div className="bg-white rounded-xl p-8 flex-1 shadow-lg border-l-4 border-amber-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Phát Triển Dòng Sản Phẩm</h3>
                <p className="text-slate-600">
                  Ra mắt các dòng sản phẩm: Dây nịt Nam, Dây nịt Nữ, và Dây nịt Casual với thiết kế đa dạng.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">2022</span>
              </div>
              <div className="bg-white rounded-xl p-8 flex-1 shadow-lg border-l-4 border-amber-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Mở Rộng Thị Trường</h3>
                <p className="text-slate-600">
                  Mở rộng bán hàng trực tuyến, được yêu thích bởi hàng nghìn khách hàng trên khắp nước.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">2026</span>
              </div>
              <div className="bg-white rounded-xl p-8 flex-1 shadow-lg border-l-4 border-amber-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ngày Hôm Nay</h3>
                <p className="text-slate-600">
                  Tiếp tục phát triển, nâng cao chất lượng, và mang đến những sản phẩm tốt nhất cho bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
            Đội Ngũ Tài Năng
          </h2>

          <p className="text-center text-amber-200 text-lg mb-8 max-w-3xl mx-auto">
            Những người lành nghề, đầy tình đam mê với công việc, luôn không ngừng sáng tạo để mang đến những chiếc dây nịt hoàn hảo cho bạn.
          </p>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Cảm Ơn Bạn Đã Tin Tưởng ConCaiNit Deluxe</h3>
            <p className="text-amber-100">
              Hành trình còn dài, chúng tôi sẽ luôn ở đây để phục vụ bạn
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default AboutPage;
