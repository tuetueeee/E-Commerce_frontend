import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from './Header';
import { Footer } from './Footer';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
  pageName?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  pageName = 'trang này'
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, getToken } = useAuth();
  const token = getToken();

  console.log('[ProtectedRoute] Auth state:', { user, isLoading, isAuthenticated, token, pageName });

  // Still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ca6946] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not logged in - check both state and localStorage fallback
  if ((!isAuthenticated && !token) || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Warning Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-['Lato'] font-bold text-red-800 mb-2">
                Yêu cầu đăng nhập
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn cần phải đăng nhập để truy cập {pageName}.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href="#login"
                  className="bg-[#ca6946] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#b55835] transition-colors"
                >
                  Đăng nhập
                </a>
                <a
                  href="#register"
                  className="border-2 border-[#ca6946] text-[#ca6946] px-6 py-3 rounded-full font-semibold hover:bg-[#ca6946]/10 transition-colors"
                >
                  Tạo tài khoản mới
                </a>
                <a
                  href="#home"
                  className="text-gray-600 hover:text-black transition-colors mt-2"
                >
                  ← Quay lại trang chủ
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check role for admin pages
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-['Lato'] font-bold text-red-800 mb-2">
                Quyền hạn không đủ
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn không có quyền truy cập trang quản trị.
              </p>
              
              <a
                href="#home"
                className="bg-[#ca6946] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#b55835] transition-colors inline-block"
              >
                Quay lại trang chủ
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // User is logged in and has correct role
  return <>{children}</>;
}

