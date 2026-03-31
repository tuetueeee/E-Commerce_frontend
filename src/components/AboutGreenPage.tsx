import { Header } from './Header';
import { Footer } from './Footer';
import { Leaf, Droplets, Recycle, Heart, Award, TreePine, ChevronRight } from 'lucide-react';

export function AboutGreenPage() {
  const materials = [
    {
      name: "Bông hữu cơ",
      icon: <Leaf className="w-8 h-8" />,
      description: "Bông hữu cơ 100% được chứng nhận, trồng không dùng thuốc trừ sâu hoặc phân bón tổng hợp",
      features: ["Được chứng nhận GOTS", "Có thể phân hủy", "Mềm mại & Thoáng khí"],
    },
    {
      name: "Polyester tái chế",
      icon: <Recycle className="w-8 h-8" />,
      description: "Làm từ các chai nhựa tái chế, giảm chất thải và tác động môi trường",
      features: ["Được chứng nhận GRS", "Bền vững", "Hút ẩm tốt"],
    },
    {
      name: "Hỗn hợp tre",
      icon: <TreePine className="w-8 h-8" />,
      description: "Sợi tre bền vững phát triển nhanh mà không cần thuốc trừ sâu",
      features: ["Kháng khuẩn tự nhiên", "Cực mềm mại", "Điều hòa nhiệt độ"],
    },
  ];

  const certifications = [
    {
      name: "GOTS",
      fullName: "Tiêu chuẩn dệt may hữu cơ toàn cầu",
      description: "Đảm bảo tình trạng hữu cơ của dệt may từ thu hoạch đến sản xuất",
    },
    {
      name: "OEKO-TEX",
      fullName: "Tiêu chuẩn 100",
      description: "Chứng nhận sản phẩm không chứa các chất độc hại",
    },
    {
      name: "Thương mại công bằng",
      fullName: "Được chứng nhận thương mại công bằng",
      description: "Đảm bảo lương công bằng và điều kiện làm việc an toàn",
    },
  ];

  const impactStats = [
    { value: "2.5kg", label: "CO₂ được tiết kiệm trên mỗi sản phẩm" },
    { value: "500L", label: "Nước được tiết kiệm" },
    { value: "95%", label: "Giảm chất thải so với thời trang nhanh" },
    { value: "10k+", label: "Cây được trồng" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="#home" className="hover:text-black">Trang chủ</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">Cam kết Xanh</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#BCF181] to-[#ca6946] text-black py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <Leaf className="w-10 h-10 text-green-700" />
            </div>
            <h1 className="font-['Lora'] mb-6">Cam kết Xanh của chúng tôi</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Chúng tôi tin rằng thời trang không nên phải trả giá bằng Trái Đất. Mỗi sản phẩm chúng tôi tạo ra đều được thiết kế với
              tính bền vững làm cốt lõi, từ vật liệu đến sản xuất.
            </p>
            <p className="font-medium">PHONG CÁCH CỦA BẠN. HÀNH TINH CỦA CHÚNG TA. 🌍</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-['Lora'] mb-6">Tại sao chúng tôi Xanh</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ngành thời trang là một trong những ngành gây ô nhiễm lớn nhất thế giới. Chúng tôi ở đây để thay đổi điều đó.
              Thông qua công nghệ In-theo-yêu-cầu, vật liệu bền vững và thực hành thân thiện môi trường,
              chúng tôi đang chứng minh rằng phong cách và tính bền vững có thể song hành cùng nhau.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-[#BCF181]/20 rounded-xl p-6 text-center">
                <p className="font-bold text-3xl text-green-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainable Materials */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-['Lora'] mb-4">Vật liệu bền vững</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cẩn thận lựa chọn mỗi vật liệu để đảm bảo tác động môi trường tối thiểu
                mà không ảnh hưởng đến chất lượng hay sự thoải mái.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {materials.map((material, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-[#BCF181] rounded-full flex items-center justify-center mb-6 text-green-800">
                    {material.icon}
                  </div>
                  <h3 className="font-['Lato'] uppercase tracking-wider mb-3">{material.name}</h3>
                  <p className="text-gray-600 mb-6">{material.description}</p>
                  <div className="space-y-2">
                    {material.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eco-Friendly Inks */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#BCF181] px-4 py-2 rounded-full mb-6">
                <Droplets className="w-5 h-5 text-green-800" />
                <span className="font-medium text-green-900">Mực nước</span>
              </div>
              <h2 className="font-['Lora'] mb-6">In thân thiện môi trường</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Chúng tôi chỉ sử dụng mực nước, không độc hại, không chứa các hóa chất có hại
                như PVC và phthalates. Quy trình in của chúng tôi được thiết kế để giảm thiểu chất thải
                và tiêu thụ năng lượng.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Không có hóa chất độc hại</p>
                    <p className="text-sm text-gray-600">Không chứa PVC, phthalates và formaldehyde</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Droplets className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Công thức mực nước</p>
                    <p className="text-sm text-gray-600">Có thể phân hủy sinh học và an toàn cho môi trường</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Mềm mại & Bền</p>
                    <p className="text-sm text-gray-600">In lâu dài, cảm giác tuyệt vời trên da</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#BCF181] to-[#ca6946] rounded-2xl p-12 text-white">
              <h3 className="font-['Lato'] uppercase tracking-wider mb-4">Lợi ích In-theo-yêu-cầu</h3>
              <p className="mb-6">
                Khác với thời trang truyền thống, chúng tôi chỉ sản xuất những gì được đặt hàng. Điều này có nghĩa là:
              </p>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-bold mb-1">Không sản xuất dư thừa</p>
                  <p className="text-sm text-white/90">Không lãng phí hàng tồn kho hoặc hàng không bán được</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-bold mb-1">Giảm dấu chân carbon</p>
                  <p className="text-sm text-white/90">Ít vận chuyển và lưu trữ hơn</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-bold mb-1">Sử dụng nước ít hơn</p>
                  <p className="text-sm text-white/90">Chỉ sử dụng tài nguyên khi cần thiết</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#BCF181] px-4 py-2 rounded-full mb-6">
                <Award className="w-5 h-5 text-green-800" />
                <span className="font-medium text-green-900">Được chứng nhận & Xác minh</span>
              </div>
              <h2 className="font-['Lora'] mb-4">Chứng nhận Xanh của chúng tôi</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi không chỉ nói về tính bền vững—chúng tôi chứng minh điều đó bằng các
                chứng nhận được quốc tế công nhận.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-green-700" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{cert.fullName}</p>
                  <p className="text-sm text-gray-700">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-[#BCF181] to-[#ca6946] rounded-2xl p-12 text-center">
            <h2 className="font-['Lora'] text-white mb-6">Tham gia sứ mệnh Xanh của chúng tôi</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Mỗi lần mua hàng của bạn giúp trồng cây, giảm chất thải và hỗ trợ các thực hành bền vững.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#blanks"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full transition-all"
              >
                Mua sản phẩm bền vững
              </a>
              <a
                href="#contact"
                className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full transition-all"
              >
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
