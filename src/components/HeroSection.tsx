import { ImageWithFallback } from './figma/ImageWithFallback';
import { Leaf, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1749813991859-8953e5b4dd26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjBlY298ZW58MXx8fHwxNzYzODU1Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Sustainable Fashion Hero"
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#BCF181]/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Leaf className="w-4 h-4 text-[#BCF181]" />
              <span className="text-[#BCF181]">In Theo Yêu Cầu Thân Thiện Môi Trường</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-['Dela_Gothic_One'] tracking-wider mb-6">
              PHONG CÁCH CỦA BẠN.
              <br />
              <span className="text-[#BCF181]">HÀNH TINH CỦA CHÚNG TA.</span>
            </h1>

            {/* Description */}
            <p className="font-['Lora'] mb-4 text-xl tracking-wide">
              Tạo nên phong cách độc đáo của bạn với Print-on-Demand
            </p>
            <p className="text-gray-200 mb-8 max-w-lg">
              Sử dụng vật liệu bền vững, mực in thân thiện môi trường và quy trình sản xuất có trách nhiệm. 
              Mỗi sản phẩm là một bước nhỏ bảo vệ hành tinh.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#ca6946] hover:bg-[#b55835] px-8 py-4 rounded-full text-white font-['Lato'] tracking-wider transition-all hover:scale-105 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                BẮT ĐẦU THIẾT KẾ
              </button>
              <a
                href="#blanks"
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-white font-['Lato'] tracking-wider transition-all inline-block"
              >
                Mua Phôi Áo Bền Vững
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="font-bold">500+</p>
                <p className="text-gray-300">Thiết kế độc đáo</p>
              </div>
              <div>
                <p className="font-bold">100%</p>
                <p className="text-gray-300">Vật liệu bền vững</p>
              </div>
              <div>
                <p className="font-bold">10K+</p>
                <p className="text-gray-300">Khách hàng hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}