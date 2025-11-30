"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { clearCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";

import Link from "next/link";

const OrderSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Clear cart when payment is successful
    if (typeof window !== "undefined") {
      dispatch(clearCart());
      // Clear cart backup from localStorage
      localStorage.removeItem('cart_backup');
    }
  }, [dispatch]);

  return (
    <>
      <Breadcrumb title={"Đặt hàng thành công"} pages={["Trang chủ", "Đặt hàng thành công"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[600px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 sm:p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-dark mb-4">
              Đặt hàng thành công!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.
            </p>

            {/* Order Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg text-dark mb-4">
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium text-dark">
                    Thanh toán khi nhận hàng
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái đơn hàng:</span>
                  <span className="font-medium text-blue">Đang xử lý</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian giao hàng dự kiến:</span>
                  <span className="font-medium text-dark">
                    3-5 ngày làm việc
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex justify-center items-center px-8 py-3 bg-blue text-white font-medium rounded-md hover:bg-blue-dark transition-colors duration-200"
              >
                Tiếp tục mua sắm
              </Link>

              <Link
                href="/my-account"
                className="inline-flex justify-center items-center px-8 py-3 border border-blue text-blue font-medium rounded-md hover:bg-blue hover:text-white transition-colors duration-200"
              >
                Xem lịch sử đơn hàng
              </Link>
            </div>

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-dark mb-2">Bước tiếp theo?</h4>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Bạn sẽ nhận được email xác nhận đơn hàng trong thời gian ngắn</li>
                <li>• Chúng tôi sẽ xử lý đơn hàng của bạn trong vòng 1-2 ngày làm việc</li>
                <li>• Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản của mình</li>
                <li>• Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
