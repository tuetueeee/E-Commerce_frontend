import { ImageWithFallback } from './figma/ImageWithFallback';
import { Leaf, Droplets, Recycle } from 'lucide-react';

const commitments = [
  {
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1603873945428-67b1c22e6450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwZmFicmljfGVufDF8fHx8MTc2Mzc5NjMzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Vật Liệu Tốt Hơn",
    description: "100% cotton hữu cơ và vải tái chế từ nguồn bền vững, được chứng nhận GOTS và OEKO-TEX",
    stat: "100%",
    statLabel: "Hữu Cơ",
  },
  {
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1668506904013-810e73073cfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGRyb3BsZXQlMjBuYXR1cmV8ZW58MXx8fHwxNzYzNzc2NzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Mực In Sạch Hơn",
    description: "Mực in water-based không độc hại, giảm 80% lượng nước sử dụng trong sản xuất",
    stat: "80%",
    statLabel: "Tiết Kiệm Nước",
  },
  {
    icon: Recycle,
    image: "https://images.unsplash.com/photo-1642402806417-e451280d845b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBzdXN0YWluYWJpbGl0eXxlbnwxfHx8fDE3NjM4MDMwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Sản Xuất Có Trách Nhiệm",
    description: "Quy trình sản xuất có trách nhiệm, carbon-neutral shipping và zero-waste packaging",
    stat: "0%",
    statLabel: "Chất Thải",
  },
];

export function GreenCommitment() {
  return (
    <section id="green" className="py-20 bg-gradient-to-b from-[#BCF181]/10 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#BCF181] px-4 py-2 rounded-full mb-4">
            <Leaf className="w-4 h-4 text-green-800" />
            <span className="text-green-800">Cam Kết Của Chúng Tôi</span>
          </div>
          <h2 className="font-['Lato'] uppercase tracking-wider mb-4">
            Cam Kết Xanh Của Chúng Tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết bảo vệ hành tinh thông qua việc sử dụng vật liệu bền vững, 
            quy trình sản xuất có trách nhiệm và đóng góp cho cộng đồng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {commitments.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group border border-gray-100">
              {/* Large Icon Circle */}
              <div className="relative mb-6 mx-auto w-32 h-32">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 bg-[#BCF181] opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-3 shadow-lg">
                  <item.icon className="w-6 h-6 text-green-700" />
                </div>
              </div>

              {/* Stat */}
              <div className="mb-4">
                <p className="font-bold text-green-700">{item.stat}</p>
                <p className="text-gray-500">{item.statLabel}</p>
              </div>

              {/* Title & Description */}
              <h3 className="font-['Lato'] mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-[#ca6946] hover:bg-[#b55835] text-white px-8 py-3 rounded-full transition-all inline-flex items-center gap-2">
            Tìm Hiểu Thêm Về Sứ Mệnh Của Chúng Tôi
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}