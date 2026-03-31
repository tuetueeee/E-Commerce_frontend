import { Header } from './Header';
import { Footer } from './Footer';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Leaf, Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { apiServices } from '../services/apiConfig';
import { Loading } from './ui/loading';

export function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#BCF181] rounded-full mb-4">
              <Leaf className="w-8 h-8 text-green-800" />
            </div>
            <h1 className="font-['Lora'] mb-2">
              {emailSent ? 'Kiểm tra Email của bạn' : 'Quên mật khẩu?'}
            </h1>
            <p className="text-gray-600">
              {emailSent
                ? "Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn"
                : "Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu"
              }
            </p>
          </div>

          {!emailSent ? (
            <>
              {/* Reset Form */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                {loading && <Loading fullScreen text="Đang gửi liên kết đặt lại..." />}
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      setLoading(true);
                      setError(null);
                      await apiServices.auth.forgotPassword(email);
                      setEmailSent(true);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Không thể gửi liên kết đặt lại');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="space-y-6"
                >
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Địa chỉ Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ca6946] hover:bg-[#b55835] disabled:bg-gray-400 text-white py-3 rounded-full transition-all font-medium"
                  >
                    {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                  </button>
                </form>
              </div>

              {/* Back to Login */}
              <a
                href="#login"
                className="flex items-center justify-center gap-2 mt-6 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại đăng nhập</span>
              </a>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="bg-white border-2 border-green-600 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-['Lato'] uppercase tracking-wider mb-2">Email đã được gửi!</h3>
                  <p className="text-gray-600 mb-4">
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến:
                  </p>
                  <p className="font-medium text-[#ca6946] mb-6">
                    customer@sustainique.com
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Không nhận được email?</strong>
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Kiểm tra thư mục spam/thư rác</li>
                    <li>• Đảm bảo bạn đã nhập đúng email</li>
                    <li>• Liên kết hết hạn sau 1 giờ</li>
                  </ul>
                </div>

                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full border-2 border-[#ca6946] text-[#ca6946] hover:bg-[#ca6946] hover:text-white py-3 rounded-full transition-all font-medium mb-3"
                >
                  Gửi lại Email
                </button>

                <a
                  href="#login"
                  className="block w-full text-center border-2 border-gray-300 hover:bg-gray-50 py-3 rounded-full transition-all"
                >
                  Quay lại Đăng nhập
                </a>
              </div>
            </>
          )}

          {/* Help Section */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Cần thêm trợ giúp?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Nếu bạn gặp khó khăn khi đặt lại mật khẩu, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
            </p>
            <a
              href="#contact"
              className="text-sm text-[#ca6946] hover:underline font-medium"
            >
              Liên hệ hỗ trợ →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
