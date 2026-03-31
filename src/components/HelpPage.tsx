import { Header } from './Header';
import { Footer } from './Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { Search, ChevronRight, MessageCircle, Mail, Phone } from 'lucide-react';

const faqCategories = [
  {
    category: "Đơn hàng & Vận chuyển",
    faqs: [
      {
        question: "Thời gian vận chuyển mất bao lâu?",
        answer: "Vận chuyển tiêu chuẩn mất 5-7 ngày làm việc. Vận chuyển nhanh (2-3 ngày) có sẵn với phí bổ sung. Tất cả đơn hàng được vận chuyển carbon-neutral!"
      },
      {
        question: "Tôi có thể theo dõi đơn hàng không?",
        answer: "Có! Khi đơn hàng được gửi đi, bạn sẽ nhận được mã vận đơn qua email. Bạn cũng có thể theo dõi đơn hàng trong Bảng điều khiển của bạn ở mục 'Đơn hàng'."
      },
      {
        question: "Nếu đơn hàng đến muộn thì sao?",
        answer: "Vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi nếu đơn hàng của bạn chưa đến trong thời gian ước tính. Chúng tôi sẽ điều tra và giúp giải quyết vấn đề."
      },
    ]
  },
  {
    category: "Tùy chỉnh & Thiết kế",
    faqs: [
      {
        question: "Làm thế nào để tùy chỉnh sản phẩm?",
        answer: "Chọn một sản phẩm phôi, nhấp 'Bắt đầu thiết kế', sau đó sử dụng công cụ tùy chỉnh để tải lên hình ảnh, thêm văn bản, hoặc chọn từ thư viện thiết kế của chúng tôi."
      },
      {
        question: "Bạn chấp nhận định dạng file nào?",
        answer: "Chúng tôi chấp nhận file PNG, JPG và SVG. Để có chất lượng in tốt nhất, chúng tôi khuyên dùng hình ảnh độ phân giải cao (300 DPI) với nền trong suốt."
      },
      {
        question: "Tôi có thể xem trước thiết kế trước khi đặt hàng không?",
        answer: "Có! Công cụ tùy chỉnh của chúng tôi hiển thị bản xem trước thời gian thực của thiết kế trên sản phẩm. Bạn có thể điều chỉnh kích thước, vị trí và xoay trước khi thêm vào giỏ hàng."
      },
    ]
  },
  {
    category: "Sản phẩm & Chất lượng",
    faqs: [
      {
        question: "Sản phẩm của bạn được làm từ chất liệu gì?",
        answer: "Chúng tôi sử dụng 100% cotton hữu cơ, polyester tái chế và hỗn hợp tre. Tất cả chất liệu đều được chứng nhận (GOTS, OEKO-TEX, Fair Trade)."
      },
      {
        question: "Làm thế nào để chăm sóc sản phẩm thân thiện môi trường?",
        answer: "Giặt bằng nước lạnh, mặt trong ra ngoài và phơi khô khi có thể. Sử dụng chất tẩy rửa thân thiện môi trường. Tránh chất tẩy và nhiệt độ cao để bảo quản chất lượng in."
      },
      {
        question: "Bạn cung cấp những size nào?",
        answer: "Chúng tôi cung cấp size từ S đến XXL. Kiểm tra hướng dẫn size trên mỗi trang sản phẩm để biết số đo chi tiết."
      },
    ]
  },
  {
    category: "Đổi trả & Hoàn tiền",
    faqs: [
      {
        question: "Chính sách đổi trả của bạn là gì?",
        answer: "Sản phẩm tùy chỉnh có thể được trả lại trong vòng 14 ngày nếu có vấn đề về chất lượng hoặc lỗi in. Liên hệ với chúng tôi kèm ảnh và chúng tôi sẽ xử lý!"
      },
      {
        question: "Tôi có thể đổi sang size khác không?",
        answer: "Có! Nếu sản phẩm không vừa, liên hệ với chúng tôi trong vòng 14 ngày và chúng tôi sẽ sắp xếp đổi hàng (tùy thuộc vào tình trạng tồn kho)."
      },
    ]
  },
  {
    category: "Điểm Xanh & Phần thưởng",
    faqs: [
      {
        question: "Làm thế nào để kiếm Điểm Xanh?",
        answer: "Kiếm 10 điểm cho mỗi 100.000₫ chi tiêu, cộng thêm 50 điểm thưởng cho sản phẩm thân thiện môi trường, 100 điểm cho đánh giá và 200 điểm cho giới thiệu."
      },
      {
        question: "Làm thế nào để đổi điểm?",
        answer: "Vào Bảng điều khiển > tab Phần thưởng, chọn voucher và áp dụng mã khi thanh toán. Điểm có thể được sử dụng để giảm giá và miễn phí vận chuyển."
      },
      {
        question: "Điểm Xanh có hết hạn không?",
        answer: "Điểm có hiệu lực trong 12 tháng kể từ ngày kiếm được. Chúng tôi sẽ gửi cho bạn lời nhắc trước khi chúng hết hạn."
      },
    ]
  },
];

export function HelpPage() {
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
              <span className="text-black">Trung tâm trợ giúp</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#BCF181] to-[#ca6946] text-black py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-['Lora'] mb-4">Chúng tôi có thể giúp gì cho bạn?</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Tìm câu trả lời cho các câu hỏi thường gặp hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm câu trả lời..."
                className="pl-14 pr-4 py-4 rounded-full border-2 border-white/50 focus:border-white bg-white/90 backdrop-blur-sm text-lg"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-['Lora'] text-center mb-12">Câu hỏi thường gặp</h2>

          <div className="space-y-8">
            {faqCategories.map((category, idx) => (
              <div key={idx}>
                <h3 className="font-['Lato'] uppercase tracking-wider mb-4 text-[#ca6946]">
                  {category.category}
                </h3>
                <Accordion type="single" collapsible className="border rounded-xl overflow-hidden">
                  {category.faqs.map((faq, faqIdx) => (
                    <AccordionItem key={faqIdx} value={`${idx}-${faqIdx}`} className="border-b last:border-b-0">
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 bg-gray-50 text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-['Lora'] mb-4">Vẫn cần trợ giúp?</h2>
              <p className="text-gray-600">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <a href="#contact" className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-['Lato'] uppercase tracking-wider mb-2">Trò chuyện trực tiếp</h3>
                <p className="text-sm text-gray-600 mb-4">Trò chuyện với đội ngũ của chúng tôi</p>
                <p className="text-sm font-medium text-[#ca6946]">Có sẵn 9AM - 6PM</p>
              </a>

              <a href="mailto:support@sustainique.com" className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-['Lato'] uppercase tracking-wider mb-2">Gửi Email</h3>
                <p className="text-sm text-gray-600 mb-4">support@sustainique.com</p>
                <p className="text-sm font-medium text-[#ca6946]">Phản hồi trong 24 giờ</p>
              </a>

              <a href="tel:+841234567890" className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-['Lato'] uppercase tracking-wider mb-2">Gọi điện</h3>
                <p className="text-sm text-gray-600 mb-4">+84 123 456 789</p>
                <p className="text-sm font-medium text-[#ca6946]">Thứ 2-Thứ 6 9AM - 6PM</p>
              </a>
            </div>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h3 className="font-['Lato'] uppercase tracking-wider text-center mb-8">Chủ đề phổ biến</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Hướng dẫn size', 'Thông tin vận chuyển', 'Đơn hàng tùy chỉnh', 'Chứng nhận Xanh', 'Chính sách đổi trả', 'Điểm Xanh', 'Phương thức thanh toán', 'Cài đặt tài khoản'].map((topic) => (
              <button
                key={topic}
                className="px-6 py-3 border-2 border-gray-300 rounded-full hover:border-[#ca6946] hover:text-[#ca6946] transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
