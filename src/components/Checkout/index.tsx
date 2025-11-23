"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";
import { RootState } from "../../redux/store";
import { checkoutCart, selectCartItems, selectCartTotal, selectCartLoading, selectCartError, fetchCartItems } from "../../redux/features/cart-slice";
import { CheckoutRequest } from "../../types/cart";
import { useAuth } from "@/contexts/AuthContext";

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY' | 'CASH_ON_DELIVERY'>('VNPAY');

  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCartItems() as any);
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!shippingAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    // Lấy userId từ context (ưu tiên) hoặc từ localStorage user
    let userId: number | null = null;
    if (user?.id) {
      userId = user.id;
    } else if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.id) userId = parsed.id;
        } catch (e) {
          // ignore parse error
        }
      }
    }

    if (!userId) {
      toast.error("Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    const checkoutRequest: CheckoutRequest = {
      userId,
      paymentMethod,
      shippingAddress: shippingAddress.trim(),
      note: notes.trim() || undefined
    };

    // Backup cart to localStorage before checkout (for VNPAY in case payment is cancelled)
    if (paymentMethod === 'VNPAY' && typeof window !== 'undefined' && cartItems.length > 0) {
      try {
        localStorage.setItem('cart_backup', JSON.stringify({
          items: cartItems,
          timestamp: Date.now()
        }));
      } catch (e) {
        // Ignore localStorage errors
      }
    }

    try {
      const result = await dispatch(checkoutCart(checkoutRequest) as any);
      if (checkoutCart.fulfilled.match(result)) {
        toast.success("Đặt hàng thành công!");
        // For VNPAY, redirect is handled by payment_url
        // For COD, go to order history
        if (paymentMethod === 'CASH_ON_DELIVERY') {
          router.push('/my-account?tab=orders');
        }
      } else {
        toast.error(result.payload?.message || "Thanh toán thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi trong quá trình thanh toán");
    }
  };
  return (
    <>
      <Breadcrumb title={"Thanh toán"} pages={["thanh toán"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- shipping address --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                  <h3 className="font-medium text-xl text-dark mb-5">Địa chỉ giao hàng</h3>
                  <div>
                    <label htmlFor="shippingAddress" className="block mb-2.5">
                      Địa chỉ giao hàng <span className="text-red">*</span>
                    </label>
                    <textarea
                      name="shippingAddress"
                      id="shippingAddress"
                      rows={3}
                      placeholder="Nhập địa chỉ giao hàng đầy đủ của bạn"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      required
                    />
                  </div>
                </div>

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Ghi chú khác (tùy chọn)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Ghi chú về đơn hàng của bạn, ví dụ: ghi chú đặc biệt cho việc giao hàng."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Sản phẩm</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Tổng tiền
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product items --> */}
                    {cartItems.map((item) => (
                      <div key={item.id || item.productId} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{item.productName}</p>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            ${(item.subtotal || (item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- shipping fee --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Phí vận chuyển</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">$0.00</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Tổng cộng</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${cartTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- payment box --> */}
                <PaymentMethod onPaymentChange={setPaymentMethod} />

                {/* <!-- error message --> */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-7.5">
                    {error}
                  </div>
                )}

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
