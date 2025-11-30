"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { fetchCartItems } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";

import Link from "next/link";

const OrderFailed = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const errorMessage = searchParams?.get("message") || "Đã xảy ra lỗi không mong muốn khi xử lý đơn hàng của bạn.";
  const errorCode = searchParams?.get("code") || "UNKNOWN_ERROR";

  useEffect(() => {
    // Restore cart items from backend when payment is cancelled/failed
    // This ensures cart is restored if backend still has the items
    if (typeof window !== "undefined" && user) {
      dispatch(fetchCartItems() as any);
    }

    // Show error notification
    if (typeof window !== "undefined") {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
    // Note: Error details are already displayed in the UI, no need to log to console
  }, [errorMessage, errorCode, dispatch, user]);

  const handleRetryCheckout = () => {
    router.push("/checkout");
  };

  const handleContactSupport = () => {
    // Could redirect to a contact page or open a support modal
    router.push("/contact");
  };

  return (
    <>
      <Breadcrumb title={"Đặt hàng thất bại"} pages={["Trang chủ", "Thanh toán", "Đặt hàng thất bại"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[600px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 sm:p-12 text-center">
            {/* Failed Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            {/* Failed Message */}
            <h1 className="text-3xl font-bold text-dark mb-4">
              Đặt hàng thất bại
            </h1>

            <p className="text-lg text-gray-600 mb-4">
              Xin lỗi, chúng tôi không thể xử lý đơn hàng của bạn vào lúc này.
            </p>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2">
                Chi tiết lỗi
              </h3>
              <p className="text-red-700 text-sm">
                {errorMessage}
              </p>
              {errorCode !== "UNKNOWN_ERROR" && (
                <p className="text-red-600 text-xs mt-1">
                  Mã lỗi: {errorCode}
                </p>
              )}
            </div>

            {/* Order Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg text-dark mb-4">
                Điều gì có thể đã xảy ra?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Thanh toán bị từ chối hoặc chưa hoàn tất</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Sản phẩm trong giỏ hàng không còn khả dụng</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Vấn đề kết nối mạng</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Máy chủ tạm thời không khả dụng</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={handleRetryCheckout}
                className="inline-flex justify-center items-center px-8 py-3 bg-blue text-white font-medium rounded-md hover:bg-blue-dark transition-colors duration-200"
              >
                Thử lại
              </button>

              <button
                onClick={handleContactSupport}
                className="inline-flex justify-center items-center px-8 py-3 border border-red text-red font-medium rounded-md hover:bg-red hover:text-white transition-colors duration-200"
              >
                Liên hệ hỗ trợ
              </button>
            </div>

            {/* Additional Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cart"
                className="inline-flex justify-center items-center px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                ← Quay lại giỏ hàng
              </Link>

              <Link
                href="/"
                className="inline-flex justify-center items-center px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* Helpful Tips */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-dark mb-2">Mẹo nhanh</h4>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Kiểm tra thông tin thanh toán và thử lại</li>
                <li>• Đảm bảo tất cả sản phẩm trong giỏ hàng vẫn còn khả dụng</li>
                <li>• Thử làm mới trang và hoàn tất thanh toán lại</li>
                <li>• Liên hệ đội ngũ hỗ trợ nếu vấn đề vẫn tiếp tục</li>
              </ul>
            </div>

            {/* Support Information */}
            {user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-dark mb-2">Cần hỗ trợ?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Đội ngũ hỗ trợ khách hàng của chúng tôi sẵn sàng giúp bạn hoàn tất đơn hàng.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1 text-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>support@pcecommerce.com</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1 text-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span>1-800-PC-SHOP</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderFailed;