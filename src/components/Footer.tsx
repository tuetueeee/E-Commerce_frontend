import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Leaf, Award, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#BCF181] rounded-full p-2">
                <Leaf className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-['Lora'] tracking-wider">Sustainique</span>
            </div>
            <p className="mb-4 text-sm">
              Print-on-demand thời trang bền vững, tạo nên phong cách của bạn, bảo vệ hành tinh.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#BCF181] hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#BCF181] hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#BCF181] hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#BCF181] hover:text-black transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-['Lato'] mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#shop-blanks" className="hover:text-white transition-colors">Áo bền vững</a></li>
              <li><a href="#designs" className="hover:text-white transition-colors">Thiết kế độc đáo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bán chạy nhất</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sản phẩm mới</a></li>
              <li><a href="#vouchers" className="hover:text-white transition-colors">Vouchers & Coins</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-['Lato'] mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about-green" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#about-green" className="hover:text-white transition-colors">Cam kết xanh</a></li>
              <li><a href="#help" className="hover:text-white transition-colors">Trợ giúp & FAQ</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-['Lato'] mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@sustainique.com" className="hover:text-white transition-colors">
                  support@sustainique.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+84123456789" className="hover:text-white transition-colors">
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>123 Green Street, Eco District, Hanoi, Vietnam</span>
              </li>
            </ul>
            <a 
              href="#contact" 
              className="inline-block mt-4 px-4 py-2 bg-[#BCF181] text-black rounded-full hover:bg-[#a8d96d] transition-colors text-sm"
            >
              Gửi tin nhắn →
            </a>
          </div>
        </div>

        {/* Green Certifications */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-center text-white mb-4">Green Certifications</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#BCF181] rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-800" />
              </div>
              <span className="text-xs">GOTS<br/>Certified</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#BCF181] rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-green-800" />
              </div>
              <span className="text-xs">Fair Trade<br/>Approved</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#BCF181] rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-800" />
              </div>
              <span className="text-xs">OEKO-TEX<br/>Standard</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#BCF181] rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-800" />
              </div>
              <span className="text-xs">Carbon<br/>Neutral</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; 2024 Sustainique. All rights reserved. Made with 💚 for the planet.</p>
        </div>
      </div>
    </footer>
  );
}
